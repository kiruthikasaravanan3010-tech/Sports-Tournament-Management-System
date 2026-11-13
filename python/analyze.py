
import os
from pathlib import Path

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import mysql.connector

from dotenv import load_dotenv


# ---------------------------------
# 1. Folder Setup
# ---------------------------------

ROOT = Path(__file__).resolve().parents[1]

OUT = ROOT / "outputs"
OUT.mkdir(exist_ok=True)

WEB_OUT = ROOT / "frontend" / "public" / "analytics"
WEB_OUT.mkdir(parents=True, exist_ok=True)

load_dotenv(Path(__file__).with_name(".env"))


# ---------------------------------
# 2. Database Connection
# ---------------------------------

db = mysql.connector.connect(
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", "3306")),
    database=os.getenv("DB_NAME", "sports_tournament"),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", "")
)


# ---------------------------------
# 3. Chart Save Function
# ---------------------------------

def save_chart(filename):
    plt.tight_layout()

    plt.savefig(OUT / filename)
    plt.savefig(WEB_OUT / filename)

    plt.close()


# ---------------------------------
# 4. Main Analytics
# ---------------------------------

try:

    print("Reading data from MySQL...")

    teams = pd.read_sql("SELECT * FROM teams", db)
    matches = pd.read_sql("SELECT * FROM matches", db)
    results = pd.read_sql("SELECT * FROM results", db)
    players = pd.read_sql("SELECT * FROM players", db)

    chart_files = [
        "team_points.png",
        "win_draw_loss.png",
        "player_participation.png"
    ]

    # Remove old charts before generating new ones
    if matches.empty:
        for filename in chart_files:
            (OUT / filename).unlink(missing_ok=True)
            (WEB_OUT / filename).unlink(missing_ok=True)

        print("No match data available.")
    else:

        # ---------------------------------
        # 5. Match Analysis
        # ---------------------------------

        df = matches.merge(
            results,
            on="match_id",
            how="left"
        )

        df["team1_score"] = df["team1_score"].fillna(0)
        df["team2_score"] = df["team2_score"].fillna(0)

        df["match_date"] = pd.to_datetime(
            df["match_date"],
            errors="coerce"
        )

        df["score_difference"] = (
            df["team1_score"] - df["team2_score"]
        ).abs()

        df["match_month"] = (
            df["match_date"].dt.to_period("M").astype(str)
        )

        df["result_flag"] = df.apply(
            lambda r: "Draw"
            if r.team1_score == r.team2_score
            else (
                "Team 1 Win"
                if r.team1_score > r.team2_score
                else "Team 2 Win"
            ),
            axis=1
        )

        df.drop_duplicates(
            subset=["match_id"]
        ).to_csv(
            OUT / "match_analysis_cleaned.csv",
            index=False
        )

        players.to_csv(
            OUT / "players_export.csv",
            index=False
        )

        # ---------------------------------
        # 6. Team Standings Calculation
        # ---------------------------------

        stat = {}

        completed = df[df["status"] == "COMPLETED"]

        for _, r in completed.iterrows():

            a = int(r.team1_id)
            b = int(r.team2_id)

            for tid in (a, b):

                stat.setdefault(
                    tid,
                    {
                        "played": 0,
                        "won": 0,
                        "drawn": 0,
                        "lost": 0,
                        "points": 0,
                        "score_for": 0,
                        "score_against": 0
                    }
                )

            x = int(r.team1_score)
            y = int(r.team2_score)

            stat[a]["played"] += 1
            stat[b]["played"] += 1

            stat[a]["score_for"] += x
            stat[a]["score_against"] += y

            stat[b]["score_for"] += y
            stat[b]["score_against"] += x

            if x > y:

                stat[a]["won"] += 1
                stat[a]["points"] += 3
                stat[b]["lost"] += 1

            elif y > x:

                stat[b]["won"] += 1
                stat[b]["points"] += 3
                stat[a]["lost"] += 1

            else:

                stat[a]["drawn"] += 1
                stat[b]["drawn"] += 1

                stat[a]["points"] += 1
                stat[b]["points"] += 1

        standings = pd.DataFrame(
            [
                {"team_id": k, **v}
                for k, v in stat.items()
            ]
        )

        # ---------------------------------
        # 7. Team Points Chart
        # ---------------------------------

        if not standings.empty:

            standings = standings.merge(
                teams[["team_id", "team_name"]],
                on="team_id",
                how="left"
            )

            standings["score_difference"] = (
                standings["score_for"]
                - standings["score_against"]
            )

            standings = standings.sort_values(
                ["points", "score_difference", "score_for"],
                ascending=False
            )

            standings.to_csv(
                OUT / "team_standings.csv",
                index=False
            )

            plt.figure(figsize=(8, 5))

            sns.barplot(
                data=standings,
                x="points",
                y="team_name"
            )

            plt.title("Team Points")
            plt.xlabel("Points")
            plt.ylabel("Team")

            save_chart("team_points.png")

            # ---------------------------------
            # 8. Win Draw Loss Chart
            # ---------------------------------

            melt = standings.melt(
                id_vars="team_name",
                value_vars=["won", "drawn", "lost"],
                var_name="result",
                value_name="count"
            )

            plt.figure(figsize=(8, 5))

            sns.barplot(
                data=melt,
                x="team_name",
                y="count",
                hue="result"
            )

            plt.title("Win / Draw / Loss")
            plt.xlabel("Team")
            plt.ylabel("Matches")

            save_chart("win_draw_loss.png")

        else:

            for filename in [
                "team_points.png",
                "win_draw_loss.png"
            ]:
                (OUT / filename).unlink(missing_ok=True)
                (WEB_OUT / filename).unlink(missing_ok=True)

        # ---------------------------------
        # 9. Player Participation Chart
        # ---------------------------------

        if not players.empty:

            plt.figure(figsize=(8, 5))

            sns.barplot(
                data=players,
                x="participation_count",
                y="player_name"
            )

            plt.title("Player Participation")
            plt.xlabel("Participation Count")
            plt.ylabel("Player")

            save_chart("player_participation.png")

        else:

            (OUT / "player_participation.png").unlink(
                missing_ok=True
            )

            (WEB_OUT / "player_participation.png").unlink(
                missing_ok=True
            )

    print("Analytics completed successfully!")
    print("Charts saved in outputs and frontend/public/analytics.")

finally:

    db.close()

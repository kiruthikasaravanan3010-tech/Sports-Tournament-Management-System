
from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import pandas as pd
import plotly.express as px
import json
import os
from dotenv import load_dotenv
from pathlib import Path

app = Flask(__name__)
CORS(app)

load_dotenv(Path(__file__).with_name(".env"))


def get_database():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        database=os.getenv("DB_NAME", "sports_tournament"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "")
    )


@app.route("/api/analytics", methods=["GET"])
def analytics():

    db = None

    try:
        db = get_database()

        teams = pd.read_sql("SELECT * FROM teams", db)
        matches = pd.read_sql("SELECT * FROM matches", db)
        results = pd.read_sql("SELECT * FROM results", db)

        # Merge match and result data
        df = matches.merge(results, on="match_id", how="left")

        if not df.empty:
            df["team1_score"] = df["team1_score"].fillna(0)
            df["team2_score"] = df["team2_score"].fillna(0)

        # Team statistics
        stats = {}

        if not df.empty:
            completed = df[df["status"] == "COMPLETED"]

            for _, r in completed.iterrows():

                a = int(r.team1_id)
                b = int(r.team2_id)

                for tid in (a, b):
                    stats.setdefault(tid, {
                        "played": 0,
                        "won": 0,
                        "drawn": 0,
                        "lost": 0,
                        "points": 0,
                        "score_for": 0,
                        "score_against": 0
                    })

                x = int(r.team1_score)
                y = int(r.team2_score)

                stats[a]["played"] += 1
                stats[b]["played"] += 1

                stats[a]["score_for"] += x
                stats[a]["score_against"] += y

                stats[b]["score_for"] += y
                stats[b]["score_against"] += x

                if x > y:
                    stats[a]["won"] += 1
                    stats[a]["points"] += 3
                    stats[b]["lost"] += 1

                elif y > x:
                    stats[b]["won"] += 1
                    stats[b]["points"] += 3
                    stats[a]["lost"] += 1

                else:
                    stats[a]["drawn"] += 1
                    stats[b]["drawn"] += 1
                    stats[a]["points"] += 1
                    stats[b]["points"] += 1

        standings = pd.DataFrame([
            {"team_id": k, **v}
            for k, v in stats.items()
        ])

        if not standings.empty:
            standings = standings.merge(
                teams[["team_id", "team_name"]],
                on="team_id",
                how="left"
            )

            standings["score_difference"] = (
                standings["score_for"] -
                standings["score_against"]
            )

            standings = standings.sort_values(
                ["points", "score_difference", "score_for"],
                ascending=False
            )

        # Chart 1: Team Points
        if not standings.empty:
            fig1 = px.pie(
                standings,
                names="team_name",
                values="points",
                title="Team Points Distribution",
                hole=0.45
            )
            fig1.update_traces(
                textinfo="label+percent+value",
                textposition="inside"
            )
        else:
            fig1 = px.pie(title="Team Points - No Data")

        # Chart 2: Win / Draw / Loss
        if not standings.empty:
            melt = standings.melt(
                id_vars="team_name",
                value_vars=["won", "drawn", "lost"],
                var_name="result",
                value_name="count"
            )

            fig2 = px.bar(
                melt,
                x="team_name",
                y="count",
                color="result",
                barmode="group",
                title="Win / Draw / Loss",
                labels={
                    "team_name": "Team",
                    "count": "Matches",
                    "result": "Match Result"
                },
                text="count"
            )
            fig2.update_traces(textposition="outside")
        else:
            fig2 = px.bar(title="Win / Draw / Loss - No Data")

        # Chart 3: Team Performance - Score Comparison
        if not standings.empty:
            score_data = standings.melt(
                id_vars="team_name",
                value_vars=["score_for", "score_against"],
                var_name="score_type",
                value_name="score"
            )

            score_data["score_type"] = score_data[
                "score_type"
            ].map({
                "score_for": "Score For",
                "score_against": "Score Against"
            })

            fig3 = px.bar(
                score_data,
                x="team_name",
                y="score",
                color="score_type",
                barmode="group",
                title="Team Performance - Score Comparison",
                labels={
                    "team_name": "Team",
                    "score": "Total Score",
                    "score_type": "Score Type"
                },
                text="score",
                color_discrete_map={
                    "Score For": "#3B82F6",
                    "Score Against": "#F59E0B"
                }
            )

            fig3.update_traces(textposition="outside")
            fig3.update_layout(
                xaxis_title="Teams",
                yaxis_title="Total Score",
                legend_title="Performance",
                bargap=0.35
            )
        else:
            fig3 = px.bar(
                title="Team Performance - No Match Data"
            )

        return jsonify({
            "success": True,
            "charts": {
                "teamPoints": json.loads(fig1.to_json()),
                "winDrawLoss": json.loads(fig2.to_json()),
                "teamPerformance": json.loads(fig3.to_json())
            },
            "standings": standings.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        if db is not None:
            db.close()


@app.route("/api/analytics/status", methods=["GET"])
def status():
    return jsonify({
        "message": "Python Analytics API is running"
    })


if __name__ == "__main__":
    app.run(port=5001, debug=True)

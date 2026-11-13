
package com.sports.stms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "results")
public class GameResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    public Long resultId;

    @Column(name = "match_id", unique = true)
    public Long matchId;

    @Column(name = "team1_score")
    public int team1Score;

    @Column(name = "team2_score")
    public int team2Score;

    @Column(name = "winner_team_id")
    public Long winnerTeamId;

    public GameResult() {
    }
}


package com.sports.stms.model;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name = "matches")
public class GameMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    public Long matchId;

    @Column(name = "tournament_id", nullable = false)
    public Long tournamentId;

    @Column(name = "team1_id", nullable = false)
    public Long team1Id;

    @Column(name = "team2_id", nullable = false)
    public Long team2Id;

    @Column(name = "venue_id")
    public Long venueId;

    @Column(name = "match_date")
    public LocalDate matchDate;

    @Column(name = "match_time")
    public LocalTime matchTime;

    @Column(name = "round_name")
    public String roundName;

    @Column(name = "status")
    public String status = "SCHEDULED";

    public GameMatch() {
    }
}

package com.sports.stms.model;
import jakarta.persistence.*; import java.time.LocalDate;
@Entity @Table(name="tournaments")
public class Tournament {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long tournamentId;
 public String tournamentName; public Long sportId; public LocalDate startDate; public LocalDate endDate; public String formatName="LEAGUE";
 public Tournament() {}
}

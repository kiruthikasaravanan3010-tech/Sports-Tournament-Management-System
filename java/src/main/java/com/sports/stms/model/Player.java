package com.sports.stms.model;
import jakarta.persistence.*;
@Entity @Table(name="players")
public class Player {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long playerId;
 public String playerName; public Long teamId; public String roleName; public Integer jerseyNumber; public int participationCount;
 public Player() {}
}

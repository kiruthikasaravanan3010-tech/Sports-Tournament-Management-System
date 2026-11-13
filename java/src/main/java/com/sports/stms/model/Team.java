package com.sports.stms.model;
import jakarta.persistence.*;
@Entity @Table(name="teams")
public class Team {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long teamId;
 public String teamName; public Long departmentId; public Long sportId; public boolean active=true;
 public Team() {}
}

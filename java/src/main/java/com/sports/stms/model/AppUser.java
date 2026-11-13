package com.sports.stms.model;
import jakarta.persistence.*;
@Entity @Table(name="app_users")
public class AppUser {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long userId;
 @Column(unique=true) public String username; public String passwordHash; public String roleName;
 public AppUser() {}
}

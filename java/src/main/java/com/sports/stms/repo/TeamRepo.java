package com.sports.stms.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sports.stms.model.Team;
public interface TeamRepo extends JpaRepository<Team,Long> {}

package com.sports.stms.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sports.stms.model.GameMatch;
public interface MatchRepo extends JpaRepository<GameMatch,Long> {}

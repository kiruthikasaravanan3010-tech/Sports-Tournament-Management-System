package com.sports.stms.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sports.stms.model.GameResult;
import java.util.Optional;
public interface ResultRepo extends JpaRepository<GameResult,Long> { Optional<GameResult> findByMatchId(Long id); }

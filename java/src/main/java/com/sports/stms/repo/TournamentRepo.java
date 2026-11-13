package com.sports.stms.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sports.stms.model.Tournament;
public interface TournamentRepo extends JpaRepository<Tournament,Long> {}

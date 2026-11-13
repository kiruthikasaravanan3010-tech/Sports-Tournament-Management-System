package com.sports.stms.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sports.stms.model.Player;
public interface PlayerRepo extends JpaRepository<Player,Long> {}

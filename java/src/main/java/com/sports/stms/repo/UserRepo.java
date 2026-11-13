package com.sports.stms.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sports.stms.model.AppUser;
import java.util.Optional;
public interface UserRepo extends JpaRepository<AppUser,Long> { Optional<AppUser> findByUsername(String name); }

package com.sports.stms;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.sports.stms.model.AppUser;
import com.sports.stms.repo.UserRepo;
@SpringBootApplication
public class StmsApplication {
 public static void main(String[] args){SpringApplication.run(StmsApplication.class,args);}
 @Bean CommandLineRunner seed(UserRepo repo){return args->{String[][] a={{"admin","admin123","ADMIN"},{"coordinator","coord123","COORDINATOR"},{"scorer","scorer123","SCORER"},{"viewer","viewer123","VIEWER"},{"analyst","analyst123","ANALYST"}};for(String[] x:a)if(repo.findByUsername(x[0]).isEmpty()){AppUser u=new AppUser();u.username=x[0];u.passwordHash=new BCryptPasswordEncoder().encode(x[1]);u.roleName=x[2];repo.save(u);}};}
}

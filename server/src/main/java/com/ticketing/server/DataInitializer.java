package com.ticketing.server;

import com.ticketing.server.model.Role;
import com.ticketing.server.model.User;
import com.ticketing.server.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User(null, "admin", passwordEncoder.encode("admin"), Role.ADMIN));
                userRepository.save(new User(null, "user", passwordEncoder.encode("user"), Role.USER));
                userRepository.save(new User(null, "agent", passwordEncoder.encode("agent"), Role.SUPPORT_AGENT));
            }
        };
    }
}

package com.trustlink;

import com.trustlink.model.User;
import com.trustlink.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            if (userRepository.findByEmail("user@gmail.com").isEmpty()) {
                User user = new User();
                user.setName("Demo User");
                user.setEmail("user@gmail.com");
                user.setPassword(passwordEncoder.encode("1234"));
                user.setRole("USER");
                user.setStatus("ACTIVE");
                userRepository.save(user);
            }

            if (userRepository.findByEmail("provider@gmail.com").isEmpty()) {
                User provider = new User();
                provider.setName("Demo Provider");
                provider.setEmail("provider@gmail.com");
                provider.setPassword(passwordEncoder.encode("1234"));
                provider.setRole("PROVIDER");
                provider.setStatus("ACTIVE");
                userRepository.save(provider);
            }

            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User admin = new User();
                admin.setName("Demo Admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("admin1234"));
                admin.setRole("ADMIN");
                admin.setStatus("ACTIVE");
                userRepository.save(admin);
            }
        };
    }
}
package com.trustlink.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                        "/",
                        "/index.html",
                        "/login.html",
                        "/register.html",
                        "/dashboard-user.html",
                        "/dashboard-provider.html",
                        "/dashboard-admin.html",
                        "/booking.html",
                        "/**.html",
                        "/**.js",
                        "/**.css"
                ).permitAll()

                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/users/add").permitAll()

                .requestMatchers("/users/all").hasRole("ADMIN")
                .requestMatchers("/admin/**").hasRole("ADMIN")

                .requestMatchers("/providers/add").hasRole("ADMIN")
                .requestMatchers("/providers/**").hasAnyRole("USER", "ADMIN", "PROVIDER")

                .requestMatchers("/bookings/create").hasRole("USER")
                .requestMatchers("/bookings/my").hasRole("USER")
                .requestMatchers("/bookings/accept").hasRole("ADMIN")
                .requestMatchers("/bookings/reject").hasRole("ADMIN")
                .requestMatchers("/bookings/complete").hasAnyRole("ADMIN", "PROVIDER")

                .requestMatchers("/payments/**").hasRole("USER")

                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
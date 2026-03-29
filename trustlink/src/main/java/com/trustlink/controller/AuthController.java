package com.trustlink.controller;

import com.trustlink.dto.AuthResponse;
import com.trustlink.model.User;
import com.trustlink.service.UserService;
import com.trustlink.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody User user) {

        User existingUser = userService.findByEmail(user.getEmail());

        if (existingUser != null &&
                passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {

            String token = jwtUtil.generateToken(existingUser.getEmail());

            AuthResponse response = new AuthResponse(
                    token,
                    existingUser.getRole(),
                    existingUser.getEmail(),
                    "Login successful"
            );

            return ResponseEntity.ok(response);
        }

        AuthResponse response = new AuthResponse(
                null,
                null,
                null,
                "Invalid Credentials"
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
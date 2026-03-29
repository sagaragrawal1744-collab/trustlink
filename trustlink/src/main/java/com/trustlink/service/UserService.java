package com.trustlink.service;

import com.trustlink.model.User;
import com.trustlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 🔐 Inject encoder
    @Autowired
    private PasswordEncoder passwordEncoder;

    // SAVE USER (WITH HASHING)
    public User saveUser(User user) {

        // 🔥 Convert plain password → hashed password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Find user by email (for login)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
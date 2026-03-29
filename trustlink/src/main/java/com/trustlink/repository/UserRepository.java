package com.trustlink.repository;

import com.trustlink.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

/*
 * This interface connects our Java code with database
 * JpaRepository provides CRUD methods automatically
 */
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom method (we will use later for login)
    User findByEmail(String email);
}
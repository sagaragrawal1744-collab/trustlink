package com.trustlink.repository;

import com.trustlink.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserEmail(String email);

    // 🔥 NEW METHOD
    List<Booking> findByProviderEmail(String email);
}
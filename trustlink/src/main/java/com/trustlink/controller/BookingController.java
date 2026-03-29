package com.trustlink.controller;

import com.trustlink.model.Booking;
import com.trustlink.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 🔥 CREATE BOOKING (USER)
    @PostMapping("/create")
    public Booking createBooking(@RequestParam Long providerId,
                                 Authentication auth) {

        String email = auth.getName();
        return bookingService.createBooking(email, providerId);
    }

    // 🔥 GET MY BOOKINGS (USER)
    @GetMapping("/my")
    public List<Booking> getMyBookings(Authentication auth) {

        String email = auth.getName();
        return bookingService.getUserBookings(email);
    }

    // 🔥 ACCEPT BOOKING (ADMIN)
    @PostMapping("/accept")
    public Booking acceptBooking(@RequestParam Long bookingId) {
        return bookingService.acceptBooking(bookingId);
    }

    // 🔥 REJECT BOOKING (ADMIN)
    @PostMapping("/reject")
    public Booking rejectBooking(@RequestParam Long bookingId) {
        return bookingService.rejectBooking(bookingId);
    }

    // 🔥 COMPLETE BOOKING (ADMIN)
    @PostMapping("/complete")
    public Booking completeBooking(@RequestParam Long bookingId) {
        return bookingService.completeBooking(bookingId);
    }
}
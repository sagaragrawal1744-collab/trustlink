package com.trustlink.controller;

import com.trustlink.model.Booking;
import com.trustlink.model.Provider;
import com.trustlink.service.BookingService;
import com.trustlink.service.ProviderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/providers")
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    @Autowired
    private BookingService bookingService;

    // Provider registration / add
    @PostMapping("/add")
    public Provider addProvider(@Valid @RequestBody Provider provider) {
        return providerService.saveProvider(provider);
    }

    // Get approved providers by service type only
    @GetMapping("/{type}")
    public List<Provider> getByType(@PathVariable String type) {
        return providerService.getApprovedProvidersByType(type);
    }

    // NEW: get approved providers by service type + location
    @GetMapping("/search")
    public List<Provider> searchProviders(@RequestParam String type,
                                          @RequestParam String location) {
        return providerService.getApprovedProvidersByTypeAndLocation(type, location);
    }

    // Provider dashboard
    @GetMapping("/my-bookings")
    public List<Booking> getMyBookings(Authentication auth) {
        String email = auth.getName();
        return bookingService.getProviderBookings(email);
    }

    @PostMapping("/accept-booking")
    public Booking acceptMyBooking(@RequestParam Long bookingId, Authentication auth) {
        String email = auth.getName();
        return bookingService.providerAcceptBooking(bookingId, email);
    }

    @PostMapping("/reject-booking")
    public Booking rejectMyBooking(@RequestParam Long bookingId, Authentication auth) {
        String email = auth.getName();
        return bookingService.providerRejectBooking(bookingId, email);
    }

    @PostMapping("/complete-booking")
    public Booking completeMyBooking(@RequestParam Long bookingId, Authentication auth) {
        String email = auth.getName();
        return bookingService.providerCompleteBooking(bookingId, email);
    }
}
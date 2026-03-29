package com.trustlink.service;

import com.trustlink.model.Booking;
import com.trustlink.model.Provider;
import com.trustlink.repository.BookingRepository;
import com.trustlink.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ProviderRepository providerRepository;

    // Create booking and assign provider
    public Booking createBooking(String email, Long providerId) {

    Provider provider = providerRepository.findById(providerId)
           .orElseThrow(() -> new com.trustlink.exception.ResourceNotFoundException("Provider not found"));

    Booking booking = new Booking();
    booking.setUserEmail(email);
    booking.setProviderId(providerId);

    // ✅ USE provider properly
    booking.setProviderEmail(provider.getEmail());  
    // OR if later you add email field → provider.getEmail()

    booking.setStatus("PENDING");
    booking.setBookingTime(LocalDateTime.now());

    return bookingRepository.save(booking);
}
    // User bookings
    public List<Booking> getUserBookings(String email) {
        return bookingRepository.findByUserEmail(email);
    }

    // Provider bookings
    public List<Booking> getProviderBookings(String email) {
        return bookingRepository.findByProviderEmail(email);
    }

    // Admin accept
    public Booking acceptBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
             .orElseThrow(() -> new com.trustlink.exception.ResourceNotFoundException("Booking not found"));

        booking.setStatus("ACCEPTED");
        return bookingRepository.save(booking);
    }

    // Admin reject
    public Booking rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
               .orElseThrow(() -> new com.trustlink.exception.ResourceNotFoundException("Booking not found"));

        booking.setStatus("REJECTED");
        return bookingRepository.save(booking);
    }

    // Admin complete
    public Booking completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
              .orElseThrow(() -> new com.trustlink.exception.ResourceNotFoundException("Booking not found"));

        booking.setStatus("COMPLETED");
        return bookingRepository.save(booking);
    }

    // Provider accept only own booking
    public Booking providerAcceptBooking(Long bookingId, String providerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
               .orElseThrow(() -> new com.trustlink.exception.ResourceNotFoundException("Booking not found"));
        if (!providerEmail.equals(booking.getProviderEmail())) {
            throw new RuntimeException("You are not allowed to accept this booking");
        }

        booking.setStatus("ACCEPTED");
        return bookingRepository.save(booking);
    }

    // Provider reject only own booking
    public Booking providerRejectBooking(Long bookingId, String providerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
               .orElseThrow(() -> new com.trustlink.exception.ResourceNotFoundException("Booking not found"));
        if (!providerEmail.equals(booking.getProviderEmail())) {
            throw new RuntimeException("You are not allowed to reject this booking");
        }

        booking.setStatus("REJECTED");
        return bookingRepository.save(booking);
    }

    // Provider complete only own booking
    public Booking providerCompleteBooking(Long bookingId, String providerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
               .orElseThrow(() -> new com.trustlink.exception.ResourceNotFoundException("Booking not found"));
        if (!providerEmail.equals(booking.getProviderEmail())) {
            throw new RuntimeException("You are not allowed to complete this booking");
        }

        booking.setStatus("COMPLETED");
        return bookingRepository.save(booking);
    }
}
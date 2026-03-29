package com.trustlink.service;

import com.trustlink.model.Booking;
import com.trustlink.model.Payment;
import com.trustlink.repository.BookingRepository;
import com.trustlink.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // 🔥 MAKE PAYMENT
    public Payment makePayment(String email, Long bookingId, double amount, String method) {

        // Check booking exists
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Prevent duplicate payment
        if (paymentRepository.findByBookingId(bookingId).isPresent()) {
            throw new RuntimeException("Payment already done");
        }

        Payment payment = new Payment();
        payment.setBookingId(bookingId);
        payment.setUserEmail(email);
        payment.setAmount(amount);
        payment.setMethod(method);
        payment.setStatus("SUCCESS"); // simulate success
        payment.setPaymentTime(LocalDateTime.now());

        // Update booking status
        booking.setStatus("PAID");
        bookingRepository.save(booking);

        return paymentRepository.save(payment);
    }
}
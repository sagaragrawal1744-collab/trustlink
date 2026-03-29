package com.trustlink.service;

import com.trustlink.model.Booking;
import com.trustlink.model.Payment;
import com.trustlink.model.Provider;
import com.trustlink.model.User;
import com.trustlink.repository.BookingRepository;
import com.trustlink.repository.PaymentRepository;
import com.trustlink.repository.ProviderRepository;
import com.trustlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // Dashboard summary
    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> data = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalProviders = providerRepository.count();
        long totalBookings = bookingRepository.count();
        long totalPayments = paymentRepository.count();

        double totalRevenue = paymentRepository.findAll()
                .stream()
                .mapToDouble(Payment::getAmount)
                .sum();

        data.put("totalUsers", totalUsers);
        data.put("totalProviders", totalProviders);
        data.put("totalBookings", totalBookings);
        data.put("totalPayments", totalPayments);
        data.put("totalRevenue", totalRevenue);

        return data;
    }

    // All users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // All providers
    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    // All bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // All payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
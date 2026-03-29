package com.trustlink.controller;

import com.trustlink.model.Booking;
import com.trustlink.model.Payment;
import com.trustlink.model.Provider;
import com.trustlink.model.User;
import com.trustlink.service.AdminService;
import com.trustlink.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ProviderService providerService;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        return adminService.getDashboardSummary();
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/providers")
    public List<Provider> getAllProviders() {
        return adminService.getAllProviders();
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return adminService.getAllBookings();
    }

    @GetMapping("/payments")
    public List<Payment> getAllPayments() {
        return adminService.getAllPayments();
    }

    @GetMapping("/pending-providers")
    public List<Provider> getPendingProviders() {
        return providerService.getPendingProviders();
    }

    @PostMapping("/approve-provider")
    public Provider approveProvider(@RequestParam Long providerId) {
        return providerService.approveProvider(providerId);
    }

    @PostMapping("/reject-provider")
    public Provider rejectProvider(@RequestParam Long providerId) {
        return providerService.rejectProvider(providerId);
    }
}
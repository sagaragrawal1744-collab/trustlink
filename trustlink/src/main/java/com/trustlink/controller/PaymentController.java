package com.trustlink.controller;

import com.trustlink.model.Payment;
import com.trustlink.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // 🔥 MAKE PAYMENT
    @PostMapping("/pay")
    public Payment pay(@RequestParam Long bookingId,
                       @RequestParam double amount,
                       @RequestParam String method,
                       Authentication auth) {

        String email = auth.getName();

        return paymentService.makePayment(email, bookingId, amount, method);
    }
}
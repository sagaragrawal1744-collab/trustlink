package com.trustlink.service;

import com.trustlink.model.Provider;
import com.trustlink.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderService {

    @Autowired
    private ProviderRepository providerRepository;

    // Provider registration / add
    public Provider saveProvider(Provider provider) {
        provider.setApprovalStatus("PENDING");
        provider.setAvailable(false);
        return providerRepository.save(provider);
    }

    // Pending providers
    public List<Provider> getPendingProviders() {
        return providerRepository.findByApprovalStatus("PENDING");
    }

    // Approved providers by service type only
    public List<Provider> getApprovedProvidersByType(String serviceType) {
        return providerRepository.findByServiceType(serviceType)
                .stream()
                .filter(p -> "APPROVED".equals(p.getApprovalStatus()))
                .toList();
    }

    // NEW: approved providers by service type + location
    public List<Provider> getApprovedProvidersByTypeAndLocation(String serviceType, String location) {
        return providerRepository.findByServiceTypeAndLocationAndApprovalStatus(
                serviceType,
                location,
                "APPROVED"
        );
    }

    // Approve provider
    public Provider approveProvider(Long providerId) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        provider.setApprovalStatus("APPROVED");
        provider.setAvailable(true);

        return providerRepository.save(provider);
    }

    // Reject provider
    public Provider rejectProvider(Long providerId) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        provider.setApprovalStatus("REJECTED");
        provider.setAvailable(false);

        return providerRepository.save(provider);
    }

    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }
}
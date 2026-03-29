package com.trustlink.repository;

import com.trustlink.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    List<Provider> findByServiceType(String serviceType);

    List<Provider> findByApprovalStatus(String approvalStatus);

    List<Provider> findByServiceTypeAndLocationAndApprovalStatus(String serviceType, String location, String approvalStatus);
}
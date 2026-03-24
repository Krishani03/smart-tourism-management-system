package com.example.smarttourism.repository;

import com.example.smarttourism.entity.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourPackageRepository extends JpaRepository<TourPackage, Long> {
    List<TourPackage> findByAssignedGuideUsername(String username);
}
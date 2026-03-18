package com.example.smarttourism.service;

import com.example.smarttourism.entity.TourPackage;
import com.example.smarttourism.repository.TourPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourPackageService {

    private final TourPackageRepository tourPackageRepository;

    // ADMIN: Create a new tour
    public TourPackage save(TourPackage tourPackage) {
        // Initially, the current price is the base price
        if (tourPackage.getCurrentPrice() == null) {
            tourPackage.setCurrentPrice(tourPackage.getBasePrice());
        }
        return tourPackageRepository.save(tourPackage);
    }

    // PUBLIC: Get all tours for the website
    public List<TourPackage> findAll() {
        return tourPackageRepository.findAll();
    }

    // PUBLIC: Get a specific tour by ID
    public TourPackage getTourById(Long id) {
        return tourPackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour Package not found with id: " + id));
    }

    // ADMIN: Update tour details
    public TourPackage updateTour(Long id, TourPackage details) {
        TourPackage existingTour = getTourById(id);

        existingTour.setTitle(details.getTitle());
        existingTour.setDescription(details.getDescription());
        existingTour.setBasePrice(details.getBasePrice());
        existingTour.setMaxCapacity(details.getMaxCapacity());

        return tourPackageRepository.save(existingTour);
    }

    // ADMIN: Delete a tour
    public void deleteTour(Long id) {
        tourPackageRepository.deleteById(id);
    }
}
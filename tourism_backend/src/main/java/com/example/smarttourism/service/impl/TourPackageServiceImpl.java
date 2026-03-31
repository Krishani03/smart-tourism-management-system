package com.example.smarttourism.service.impl;

import com.example.smarttourism.dto.TourRequestDTO;
import com.example.smarttourism.entity.TourPackage;
import com.example.smarttourism.entity.User;
import com.example.smarttourism.repository.CategoryRepository; // Add this
import com.example.smarttourism.repository.LocationRepository; // Add this
import com.example.smarttourism.repository.TourPackageRepository;
import com.example.smarttourism.repository.UserRepository;
import com.example.smarttourism.service.TourPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourPackageServiceImpl implements TourPackageService {

    private final TourPackageRepository tourPackageRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository; // NEW
    private final LocationRepository locationRepository; // NEW

    @Override
    public TourPackage save(TourRequestDTO dto) {
        TourPackage tour = new TourPackage();

        tour.setTitle(dto.getTitle());
        tour.setDescription(dto.getDescription());
        tour.setBasePrice(dto.getBasePrice());
        tour.setCurrentPrice(dto.getBasePrice()); // Initial price = base price
        tour.setMaxCapacity(dto.getMaxCapacity());

        if (dto.getCategoryId() != null) {
            tour.setCategory(categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found")));
        }

        if (dto.getLocationId() != null) {
            tour.setLocation(locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found")));
        }

        if (dto.getGuideUsername() != null) {
            User guide = userRepository.findByUsername(dto.getGuideUsername())
                    .orElseThrow(() -> new RuntimeException("Guide user not found"));
            tour.setAssignedGuide(guide);
        }

        return tourPackageRepository.save(tour);
    }

    @Override
    public List<TourPackage> findAll() {
        return tourPackageRepository.findAll();
    }

    @Override
    public TourPackage getTourById(Long id) {
        return tourPackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour Package not found with id: " + id));
    }

    @Override
    public TourPackage updateTour(Long id, TourPackage details) {
        TourPackage existingTour = getTourById(id);
        existingTour.setTitle(details.getTitle());
        existingTour.setDescription(details.getDescription());
        existingTour.setBasePrice(details.getBasePrice());
        existingTour.setMaxCapacity(details.getMaxCapacity());

        return tourPackageRepository.save(existingTour);
    }

    @Override
    public void deleteTour(Long id) {
        tourPackageRepository.deleteById(id);
    }

    @Override
    public List<TourPackage> getToursByGuide(String username) {
        return tourPackageRepository.findByAssignedGuideUsername(username);
    }
}
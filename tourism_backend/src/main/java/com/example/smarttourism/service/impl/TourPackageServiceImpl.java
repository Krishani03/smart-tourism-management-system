package com.example.smarttourism.service.impl;

import com.example.smarttourism.entity.TourPackage;
import com.example.smarttourism.repository.TourPackageRepository;
import com.example.smarttourism.service.TourPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourPackageServiceImpl implements TourPackageService {
    private final TourPackageRepository tourPackageRepository;

    @Override
    public TourPackage save(TourPackage tourPackage) {
        if (tourPackage.getCurrentPrice() == null) {
            tourPackage.setCurrentPrice(tourPackage.getBasePrice());
        }
        return tourPackageRepository.save(tourPackage);
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
}
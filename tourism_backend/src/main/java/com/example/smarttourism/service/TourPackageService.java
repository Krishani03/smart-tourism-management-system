package com.example.smarttourism.service;

import com.example.smarttourism.dto.TourRequestDTO;
import com.example.smarttourism.entity.TourPackage;
import java.util.List;

public interface TourPackageService {
    TourPackage save(TourRequestDTO dto);
    List<TourPackage> findAll();
    TourPackage getTourById(Long id);
    TourPackage updateTour(Long id, TourPackage details);
    void deleteTour(Long id);
    List<TourPackage> getToursByGuide(String username);
}
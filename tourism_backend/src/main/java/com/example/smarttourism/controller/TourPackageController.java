package com.example.smarttourism.controller;

import com.example.smarttourism.dto.TourRequestDTO;
import com.example.smarttourism.entity.TourPackage;
import com.example.smarttourism.service.TourPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tours")
@RequiredArgsConstructor
public class TourPackageController {

    private final TourPackageService tourPackageService;

    @GetMapping
    public ResponseEntity<List<TourPackage>> getAllTours() {
        return ResponseEntity.ok(tourPackageService.findAll());
    }

    @PostMapping
    public ResponseEntity<TourPackage> createPackage(@RequestBody TourRequestDTO tourRequestDTO) {
        return ResponseEntity.ok(tourPackageService.save(tourRequestDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourPackage> getTourById(@PathVariable Long id) {
        return ResponseEntity.ok(tourPackageService.getTourById(id));
    }

    @GetMapping("/guide/{username}")
    public ResponseEntity<List<TourPackage>> getGuideTours(@PathVariable String username) {
        return ResponseEntity.ok(tourPackageService.getToursByGuide(username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourPackageService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }
}
package com.example.smarttourism.controller;

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
    public ResponseEntity<TourPackage> createPackage(@RequestBody TourPackage tourPackage) {
        return ResponseEntity.ok(tourPackageService.save(tourPackage));
    }
}
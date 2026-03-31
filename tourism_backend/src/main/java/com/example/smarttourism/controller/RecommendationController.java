package com.example.smarttourism.controller;

import com.example.smarttourism.entity.TourPackage;
import com.example.smarttourism.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/{username}")
    public ResponseEntity<List<TourPackage>> getRecommendations(@PathVariable String username) {
        return ResponseEntity.ok(recommendationService.getSuggestionsForUser(username));
    }

    @PostMapping("/search")
    public ResponseEntity<Void> trackSearch(@RequestParam String username, @RequestParam String query) {
        recommendationService.saveSearchHistory(username, query);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trending")
    public ResponseEntity<List<TourPackage>> getTrending() {
        return ResponseEntity.ok(recommendationService.getTrendingTours());
    }
}
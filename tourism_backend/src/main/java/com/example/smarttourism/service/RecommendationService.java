package com.example.smarttourism.service;


import com.example.smarttourism.entity.TourPackage;
import com.example.smarttourism.entity.User;
import java.util.List;

public interface RecommendationService {
    // 1. Get personalized suggestions based on user search history
    List<TourPackage> getSuggestionsForUser(String username);

    // 2. Save a search term when a user looks for a destination
    void saveSearchHistory(String username, String searchTerm);

    // 3. Fallback: Get trending tours if no history exists
    List<TourPackage> getTrendingTours();
}
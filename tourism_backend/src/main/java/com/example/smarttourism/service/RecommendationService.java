package com.example.smarttourism.service;


import com.example.smarttourism.entity.TourPackage;
import com.example.smarttourism.entity.User;
import java.util.List;

public interface RecommendationService {
    List<TourPackage> getSuggestionsForUser(String username);
    void saveSearchHistory(String username, String searchTerm);
    List<TourPackage> getTrendingTours();
}
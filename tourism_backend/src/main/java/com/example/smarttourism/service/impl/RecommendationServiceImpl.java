package com.example.smarttourism.service.impl;

import com.example.smarttourism.entity.SearchHistory;
import com.example.smarttourism.entity.TourPackage;
import com.example.smarttourism.entity.User;
import com.example.smarttourism.repository.SearchHistoryRepository;
import com.example.smarttourism.repository.TourPackageRepository;
import com.example.smarttourism.repository.UserRepository;
import com.example.smarttourism.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final TourPackageRepository tourRepository;
    private final SearchHistoryRepository searchHistoryRepository;
    private final UserRepository userRepository;

    @Override
    public void saveSearchHistory(String username, String searchTerm) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SearchHistory history = new SearchHistory();
        history.setUser(user);
        history.setSearchTerm(searchTerm);
        history.setSearchDate(LocalDateTime.now());

        searchHistoryRepository.save(history);
    }

    @Override
    public List<TourPackage> getSuggestionsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Logic: Find the most recent search term from this user
        return searchHistoryRepository.findFirstByUserOrderBySearchDateDesc(user)
                .map(history -> tourRepository.searchSmart(history.getSearchTerm()))
                .orElse(getTrendingTours()); // If no history, show trending
    }

    @Override
    public List<TourPackage> getTrendingTours() {
        // Returns the top 5 tours based on popularity score
        return tourRepository.findTop5ByOrderByPopularityScoreDesc();
    }
}
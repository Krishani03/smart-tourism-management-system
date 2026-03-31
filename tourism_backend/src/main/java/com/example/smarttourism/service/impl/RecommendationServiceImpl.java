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

    private final SearchHistoryRepository searchHistoryRepository;
    private final TourPackageRepository tourPackageRepository;
    private final UserRepository userRepository;

    @Override
    public List<TourPackage> getSuggestionsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return searchHistoryRepository.findFirstByUserOrderBySearchDateDesc(user)
                .map(history -> tourPackageRepository.searchSmart(history.getSearchTerm()))
                .orElse(getTrendingTours());
    }

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
    public List<TourPackage> getTrendingTours() {
        return tourPackageRepository.findTop5ByOrderByPopularityScoreDesc();
    }
}
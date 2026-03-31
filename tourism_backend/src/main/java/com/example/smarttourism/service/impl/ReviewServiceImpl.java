package com.example.smarttourism.service.impl;


import com.example.smarttourism.dto.ReviewDTO;
import com.example.smarttourism.entity.Review;
import com.example.smarttourism.entity.TourPackage;
import com.example.smarttourism.entity.User;
import com.example.smarttourism.repository.ReviewRepository;
import com.example.smarttourism.repository.TourPackageRepository;
import com.example.smarttourism.repository.UserRepository;
import com.example.smarttourism.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final TourPackageRepository tourRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Review addReview(ReviewDTO dto) {
        TourPackage tour = tourRepository.findById(dto.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setTourPackage(tour);
        review.setUser(user);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);

        double avgRating = tour.getReviews().stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        double score = (avgRating * 2.0) + (tour.getCurrentBookings() * 0.5);
        tour.setPopularityScore(score);

        tourRepository.save(tour);

        return savedReview;
    }
}
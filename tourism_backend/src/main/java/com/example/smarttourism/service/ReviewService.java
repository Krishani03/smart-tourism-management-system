package com.example.smarttourism.service;

import com.example.smarttourism.dto.ReviewDTO;
import com.example.smarttourism.entity.Review;

public interface ReviewService {
    Review addReview(ReviewDTO dto);
}
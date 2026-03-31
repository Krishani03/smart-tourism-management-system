package com.example.smarttourism.repository;

import com.example.smarttourism.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByTourPackageId(Long tourId);
    List<Review> findByUserUsername(String username);
    List<Review> findTop5ByOrderByCreatedAtDesc();
}
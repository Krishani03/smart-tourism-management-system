package com.example.smarttourism.repository;

import com.example.smarttourism.entity.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourPackageRepository extends JpaRepository<TourPackage, Long> {

    // 1. Find by Category (e.g., Show all "Adventure" tours)
    List<TourPackage> findByCategoryName(String name);

    // 2. Smart Search (Searches Title OR City OR Province)
    @Query("SELECT t FROM TourPackage t WHERE " +
            "LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.location.cityName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.location.province) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<TourPackage> searchSmart(@Param("query") String query);

    // 3. Get Top Rated (For the "Trending" section)
    List<TourPackage> findTop5ByOrderByPopularityScoreDesc();
}
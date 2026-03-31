package com.example.smarttourism.repository;

import com.example.smarttourism.entity.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourPackageRepository extends JpaRepository<TourPackage, Long> {

    List<TourPackage> findByAssignedGuideUsername(String username);
    List<TourPackage> findByCategoryName(String name);

    @Query("SELECT t FROM TourPackage t WHERE " +
            "LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.location.cityName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.location.province) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<TourPackage> searchSmart(@Param("query") String query);

    List<TourPackage> findTop5ByOrderByPopularityScoreDesc();
}
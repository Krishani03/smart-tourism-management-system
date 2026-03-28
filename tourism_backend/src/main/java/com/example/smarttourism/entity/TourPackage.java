package com.example.smarttourism.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TourPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private BigDecimal basePrice;
    private BigDecimal currentPrice;

    private Integer maxCapacity;
    private Integer currentBookings = 0;

    private Double popularityScore = 0.0; // Calculated via Smart Logic

    // --- NEW RELATIONAL FIELDS ---

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category; // Entity #6: e.g., Adventure, Beach

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location; // Entity #7: e.g., Ella, Mirissa

    @ManyToOne
    @JoinColumn(name = "guide_id")
    private User assignedGuide; // Entity #1: User (Role: Guide)

    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>(); // Entity #8: Ratings

    // Help for the UI: returns average star rating
    public Double getAverageRating() {
        if (reviews.isEmpty()) return 0.0;
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }
}
package com.example.smarttourism.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

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

    private BigDecimal basePrice; // The original price
    private BigDecimal currentPrice; // Price after Dynamic Pricing logic

    private Integer maxCapacity;
    private Integer currentBookings = 0;

    private Double popularityScore = 0.0;
}

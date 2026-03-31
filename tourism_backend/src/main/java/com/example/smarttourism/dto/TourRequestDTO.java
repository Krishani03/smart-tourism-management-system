package com.example.smarttourism.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TourRequestDTO {
    private String title;
    private String description;
    private BigDecimal basePrice;
    private Integer maxCapacity;
    private Long categoryId;
    private Long locationId;
    private String guideUsername;
}
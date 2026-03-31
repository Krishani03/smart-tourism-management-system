package com.example.smarttourism.dto;

import lombok.Data;

@Data
public class ReviewDTO {
    private Long tourId;
    private String username;
    private Integer rating; // 1-5
    private String comment;
}
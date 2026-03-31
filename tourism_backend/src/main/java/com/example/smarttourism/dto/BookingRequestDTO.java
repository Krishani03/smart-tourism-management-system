package com.example.smarttourism.dto;

import lombok.Data;

@Data
public class BookingRequestDTO {
    private Long tourId;
    private String username;
    private Integer numberOfPeople;
    private String paymentMethod;
}
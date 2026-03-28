package com.example.smarttourism.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class BookingItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type; // e.g., "Standard", "VIP"
    private Double price;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
package com.example.smarttourism.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String transactionId;
    private Double amount;
    private String status; // SUCCESS, FAILED

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
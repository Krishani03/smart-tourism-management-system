package com.example.smarttourism.controller;


import com.example.smarttourism.entity.Booking;
import com.example.smarttourism.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        Long tourId = Long.valueOf(payload.get("tourId").toString());
        Integer people = Integer.valueOf(payload.get("people").toString());

        String username = authentication.getName();

        return ResponseEntity.ok(bookingService.createBooking(tourId, username, people));
    }
}
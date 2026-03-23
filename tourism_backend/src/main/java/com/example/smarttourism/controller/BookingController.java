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

    /**
     * POST /api/v1/bookings
     * Body: { "tourId": 1, "people": 2 }
     */
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Map<String, Object> payload,
            Authentication authentication // This gets the user from the JWT!
    ) {
        Long tourId = Long.valueOf(payload.get("tourId").toString());
        Integer people = Integer.valueOf(payload.get("people").toString());

        // Get the username from the security context (from the token)
        String username = authentication.getName();

        return ResponseEntity.ok(bookingService.createBooking(tourId, username, people));
    }
}
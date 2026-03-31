package com.example.smarttourism.controller;

import com.example.smarttourism.dto.BookingRequestDTO;
import com.example.smarttourism.entity.Booking;
import com.example.smarttourism.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequestDTO dto) {
        return ResponseEntity.ok(bookingService.createBooking(dto));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Booking>> getMyBookings(@PathVariable String username) {
        return ResponseEntity.ok(bookingService.getMyBookings(username));
    }


    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok("Booking status updated based on 24h policy.");
    }
    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<Booking>> getBookingsByTour(@PathVariable Long tourId) {
        return ResponseEntity.ok(bookingService.getBookingsByTour(tourId));
    }
}
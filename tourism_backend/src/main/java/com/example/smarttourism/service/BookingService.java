package com.example.smarttourism.service;

import com.example.smarttourism.entity.Booking;
import com.example.smarttourism.entity.TourPackage;
import com.example.smarttourism.entity.User;
import com.example.smarttourism.repository.BookingRepository;
import com.example.smarttourism.repository.TourPackageRepository;
import com.example.smarttourism.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourPackageRepository tourRepository;
    private final UserRepository userRepository;

    public Booking createBooking(Long tourId, String username, Integer people) {
        // 1. Find the Tour
        TourPackage tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        // 2. Find the User
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Logic: Create Booking
        Booking booking = Booking.builder()
                .user(user)
                .tourPackage(tour)
                .numberOfPeople(people)
                .totalAmount(tour.getCurrentPrice().doubleValue() * people)
                .status("CONFIRMED")
                .bookingDate(LocalDateTime.now())
                .build();

        return bookingRepository.save(booking);
    }
}
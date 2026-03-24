package com.example.smarttourism.service;

import com.example.smarttourism.entity.Booking;

import java.util.List;

public interface BookingService {
    Booking createBooking(Long tourId, String username, Integer people);
    List<Booking> getBookingsByGuide(String guideUsername);
}
package com.example.smarttourism.service;

import com.example.smarttourism.entity.Booking;

public interface BookingService {
    Booking createBooking(Long tourId, String username, Integer people);
}
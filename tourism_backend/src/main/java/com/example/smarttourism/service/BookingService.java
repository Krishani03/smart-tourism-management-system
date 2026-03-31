package com.example.smarttourism.service;

import com.example.smarttourism.dto.BookingRequestDTO;
import com.example.smarttourism.entity.Booking;
import java.util.List;

public interface BookingService {
    Booking createBooking(BookingRequestDTO dto);
    void cancelBooking(Long bookingId);
    List<Booking> getMyBookings(String username);
    List<Booking> getBookingsByTour(Long tourId);
}
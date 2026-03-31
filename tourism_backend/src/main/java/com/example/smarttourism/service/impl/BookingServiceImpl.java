package com.example.smarttourism.service.impl;

import com.example.smarttourism.dto.BookingRequestDTO;
import com.example.smarttourism.entity.*;
import com.example.smarttourism.repository.*;
import com.example.smarttourism.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final TourPackageRepository tourRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final BookingItemRepository itemRepository;

    @Override
    @Transactional
    public Booking createBooking(BookingRequestDTO dto) {
        TourPackage tour = tourRepository.findById(dto.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If capacity is > 80% full, increase price by 20%
        // If capacity is > 50% full, increase price by 10%
        applyDynamicPricing(tour);

        Booking booking = new Booking();
        booking.setTourPackage(tour);
        booking.setUser(user);
        booking.setNumberOfPeople(dto.getNumberOfPeople());
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("CONFIRMED");

        BigDecimal total = tour.getCurrentPrice().multiply(new BigDecimal(dto.getNumberOfPeople()));
        booking.setTotalAmount(total);

        Booking savedBooking = bookingRepository.save(booking);

        BookingItem item = new BookingItem();
        item.setBooking(savedBooking);
        item.setType("Standard Ticket");
        item.setPrice(tour.getCurrentPrice().doubleValue());
        itemRepository.save(item);

        Payment payment = new Payment();
        payment.setBooking(savedBooking);
        payment.setAmount(total.doubleValue());
        payment.setTransactionId("TRX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setStatus("SUCCESS");
        paymentRepository.save(payment);

        tour.setCurrentBookings(tour.getCurrentBookings() + dto.getNumberOfPeople());
        tourRepository.save(tour);

        return savedBooking;
    }

    private void applyDynamicPricing(TourPackage tour) {
        double occupancyRate = (double) tour.getCurrentBookings() / tour.getMaxCapacity();
        BigDecimal newPrice = tour.getBasePrice();

        if (occupancyRate >= 0.8) {
            newPrice = tour.getBasePrice().multiply(new BigDecimal("1.20"));
        } else if (occupancyRate >= 0.5) {
            newPrice = tour.getBasePrice().multiply(new BigDecimal("1.10"));
        }

        tour.setCurrentPrice(newPrice);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(booking.getBookingDate().plusHours(24))) {
            booking.setStatus("CANCELLED_REFUNDED");
        } else {
            booking.setStatus("CANCELLED_NO_REFUND");
        }
        bookingRepository.save(booking);
    }

    @Override
    public java.util.List<Booking> getMyBookings(String username) {
        return bookingRepository.findByUserUsername(username);
    }

    @Override
    public List<Booking> getBookingsByTour(Long tourId) {
        return bookingRepository.findByTourPackageId(tourId);
    }
}
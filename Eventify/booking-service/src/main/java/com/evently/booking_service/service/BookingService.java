package com.evently.booking_service.service;

import com.evently.booking_service.client.EventServiceClient;
import com.evently.booking_service.dto.BookingResponse;
import com.evently.booking_service.dto.CreateBookingRequest;
import com.evently.booking_service.dto.EventResponse;
import com.evently.booking_service.entity.Booking;
import com.evently.booking_service.repository.BookingRepository;
import com.evently.booking_service.strategy.BookingOperation;
import com.evently.booking_service.strategy.BookingOperationRequest;
import com.evently.booking_service.strategy.BookingOperationStrategy;
import com.evently.common.security.AuthenticatedUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventServiceClient eventServiceClient;
    private final Map<BookingOperation, BookingOperationStrategy> strategies;

    public BookingService(BookingRepository bookingRepository,
                          EventServiceClient eventServiceClient,
                          List<BookingOperationStrategy> strategies) {
        this.bookingRepository = bookingRepository;
        this.eventServiceClient = eventServiceClient;
        this.strategies = strategies.stream()
                .collect(Collectors.toMap(
                        BookingOperationStrategy::operation,
                        Function.identity(),
                        (first, second) -> first,
                        () -> new EnumMap<>(BookingOperation.class)
                ));
    }

    public Booking createBooking(CreateBookingRequest request, AuthenticatedUser authenticatedUser) {
        return strategy(BookingOperation.CREATE)
                .execute(BookingOperationRequest.forCreate(request, authenticatedUser));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(AuthenticatedUser authenticatedUser) {
        return bookingRepository.findByUserIdOrderByBookingDateDesc(authenticatedUser.id()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public void cancelBooking(Long bookingId, AuthenticatedUser authenticatedUser) {
        strategy(BookingOperation.CANCEL)
                .execute(BookingOperationRequest.forCancel(bookingId, authenticatedUser));
    }

    private BookingOperationStrategy strategy(BookingOperation operation) {
        BookingOperationStrategy strategy = strategies.get(operation);
        if (strategy == null) {
            throw new IllegalStateException("No booking strategy registered for " + operation);
        }
        return strategy;
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.from(booking, getEventTitle(booking.getEventId()));
    }

    private String getEventTitle(Long eventId) {
        try {
            EventResponse event = eventServiceClient.getEventById(eventId);
            return event.getTitle();
        } catch (Exception exception) {
            return "Event #" + eventId;
        }
    }
}

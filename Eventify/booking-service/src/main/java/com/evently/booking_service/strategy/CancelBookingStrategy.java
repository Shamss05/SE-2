package com.evently.booking_service.strategy;

import com.evently.booking_service.client.EventServiceClient;
import com.evently.booking_service.client.NotificationServiceClient;
import com.evently.booking_service.entity.Booking;
import com.evently.booking_service.entity.BookingStatus;
import com.evently.booking_service.factory.NotificationRequestFactory;
import com.evently.booking_service.repository.BookingRepository;
import com.evently.common.security.AuthenticatedUser;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class CancelBookingStrategy implements BookingOperationStrategy {

    private final BookingRepository bookingRepository;
    private final EventServiceClient eventServiceClient;
    private final NotificationServiceClient notificationServiceClient;
    private final NotificationRequestFactory notificationRequestFactory;

    public CancelBookingStrategy(BookingRepository bookingRepository,
                                 EventServiceClient eventServiceClient,
                                 NotificationServiceClient notificationServiceClient,
                                 NotificationRequestFactory notificationRequestFactory) {
        this.bookingRepository = bookingRepository;
        this.eventServiceClient = eventServiceClient;
        this.notificationServiceClient = notificationServiceClient;
        this.notificationRequestFactory = notificationRequestFactory;
    }

    @Override
    public BookingOperation operation() {
        return BookingOperation.CANCEL;
    }

    @Override
    public Booking execute(BookingOperationRequest request) {
        AuthenticatedUser authenticatedUser = request.getAuthenticatedUser();
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id " + request.getBookingId()));

        if (!authenticatedUser.isAdmin() && !authenticatedUser.id().equals(booking.getUserId())) {
            throw new IllegalArgumentException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            return booking;
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking savedBooking = bookingRepository.save(booking);
        eventServiceClient.releaseSeat(booking.getEventId());
        sendNotification(savedBooking);
        return savedBooking;
    }

    private void sendNotification(Booking booking) {
        try {
            notificationServiceClient.createNotification(
                    notificationRequestFactory.bookingCancelled(booking.getUserId(), booking.getEventId())
            );
        } catch (Exception ignored) {
        }
    }
}

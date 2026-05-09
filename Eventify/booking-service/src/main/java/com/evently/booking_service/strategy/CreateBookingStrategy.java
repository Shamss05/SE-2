package com.evently.booking_service.strategy;

import com.evently.booking_service.client.EventServiceClient;
import com.evently.booking_service.client.NotificationServiceClient;
import com.evently.booking_service.dto.CreateBookingRequest;
import com.evently.booking_service.dto.EventResponse;
import com.evently.booking_service.entity.Booking;
import com.evently.booking_service.entity.BookingStatus;
import com.evently.booking_service.factory.NotificationRequestFactory;
import com.evently.booking_service.repository.BookingRepository;
import com.evently.common.security.AuthenticatedUser;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class CreateBookingStrategy implements BookingOperationStrategy {

    private static final ZoneId APP_ZONE = ZoneId.of("Africa/Cairo");

    private final BookingRepository bookingRepository;
    private final EventServiceClient eventServiceClient;
    private final NotificationServiceClient notificationServiceClient;
    private final NotificationRequestFactory notificationRequestFactory;

    public CreateBookingStrategy(BookingRepository bookingRepository,
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
        return BookingOperation.CREATE;
    }

    @Override
    public Booking execute(BookingOperationRequest operationRequest) {
        CreateBookingRequest request = operationRequest.getCreateBookingRequest();
        AuthenticatedUser authenticatedUser = operationRequest.getAuthenticatedUser();

        EventResponse event = eventServiceClient.getEventById(request.getEventId());
        if (event.getAvailableSeats() == null || event.getAvailableSeats() <= 0) {
            throw new IllegalArgumentException("No available seats remaining for this event");
        }

        try {
            eventServiceClient.reserveSeat(request.getEventId());

            Booking booking = new Booking();
            booking.setUserId(authenticatedUser.id());
            booking.setEventId(request.getEventId());
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setBookingDate(LocalDateTime.now(APP_ZONE));
            Booking savedBooking = bookingRepository.save(booking);

            sendNotification(event, authenticatedUser);

            return savedBooking;
        } catch (RuntimeException exception) {
            try {
                eventServiceClient.releaseSeat(request.getEventId());
            } catch (Exception ignored) {
            }
            throw exception;
        }
    }

    private void sendNotification(EventResponse event, AuthenticatedUser authenticatedUser) {
        try {
            notificationServiceClient.createNotification(
                    notificationRequestFactory.bookingConfirmed(authenticatedUser.id(), event.getTitle())
            );
        } catch (Exception ignored) {
        }
    }
}

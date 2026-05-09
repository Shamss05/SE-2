package com.evently.booking_service.factory;

import com.evently.booking_service.dto.NotificationRequest;
import org.springframework.stereotype.Component;

@Component
public class NotificationRequestFactory {

    public NotificationRequest bookingConfirmed(Long userId, String eventTitle) {
        return create(
                userId,
                "Booking confirmed",
                "Your booking for \"" + eventTitle + "\" has been confirmed."
        );
    }

    public NotificationRequest bookingCancelled(Long userId, Long eventId) {
        return create(
                userId,
                "Booking cancelled",
                "Your booking for event ID " + eventId + " has been cancelled."
        );
    }

    private NotificationRequest create(Long userId, String title, String message) {
        NotificationRequest request = new NotificationRequest();
        request.setUserId(userId);
        request.setTitle(title);
        request.setMessage(message);
        request.setReadStatus(Boolean.FALSE);
        return request;
    }
}

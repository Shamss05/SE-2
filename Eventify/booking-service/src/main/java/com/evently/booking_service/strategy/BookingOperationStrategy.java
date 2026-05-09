package com.evently.booking_service.strategy;

import com.evently.booking_service.entity.Booking;

public interface BookingOperationStrategy {

    BookingOperation operation();

    Booking execute(BookingOperationRequest request);
}

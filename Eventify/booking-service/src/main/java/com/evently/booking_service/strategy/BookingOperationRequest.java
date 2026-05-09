package com.evently.booking_service.strategy;

import com.evently.booking_service.dto.CreateBookingRequest;
import com.evently.common.security.AuthenticatedUser;

public class BookingOperationRequest {

    private final CreateBookingRequest createBookingRequest;
    private final Long bookingId;
    private final AuthenticatedUser authenticatedUser;

    private BookingOperationRequest(CreateBookingRequest createBookingRequest,
                                    Long bookingId,
                                    AuthenticatedUser authenticatedUser) {
        this.createBookingRequest = createBookingRequest;
        this.bookingId = bookingId;
        this.authenticatedUser = authenticatedUser;
    }

    public static BookingOperationRequest forCreate(CreateBookingRequest request, AuthenticatedUser authenticatedUser) {
        return new BookingOperationRequest(request, null, authenticatedUser);
    }

    public static BookingOperationRequest forCancel(Long bookingId, AuthenticatedUser authenticatedUser) {
        return new BookingOperationRequest(null, bookingId, authenticatedUser);
    }

    public CreateBookingRequest getCreateBookingRequest() {
        return createBookingRequest;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public AuthenticatedUser getAuthenticatedUser() {
        return authenticatedUser;
    }
}

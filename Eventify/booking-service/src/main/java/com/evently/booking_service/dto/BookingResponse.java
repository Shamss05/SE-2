package com.evently.booking_service.dto;

import com.evently.booking_service.entity.Booking;
import com.evently.booking_service.entity.BookingStatus;

import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long userId;
    private Long eventId;
    private String eventTitle;
    private BookingStatus status;
    private LocalDateTime bookingDate;

    public static BookingResponse from(Booking booking, String eventTitle) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setUserId(booking.getUserId());
        response.setEventId(booking.getEventId());
        response.setEventTitle(eventTitle);
        response.setStatus(booking.getStatus());
        response.setBookingDate(booking.getBookingDate());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }
}

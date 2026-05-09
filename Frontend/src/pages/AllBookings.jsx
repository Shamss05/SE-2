import { useEffect, useState } from "react";
import { getAllBookings } from "../api/bookingApi.js";
import Loading from "../components/Loading.jsx";
import { formatDateTime, getApiMessage } from "../utils/formatters.js";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllBookings()
      .then(setBookings)
      .catch((err) => setError(getApiMessage(err, "Unable to load bookings.")))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading all bookings" />;

  return (
    <section className="page-section">
      <span className="eyebrow">All bookings</span>
      <h1>Booking monitor</h1>
      {error && <p className="form-error">{error}</p>}
      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Event</th>
              <th>Booking date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.user?.fullName || booking.userName || "User pending"}</td>
                <td>{booking.eventTitle || booking.event?.title || `Event #${booking.eventId}`}</td>
                <td>{formatDateTime(booking.bookingDate)}</td>
                <td><span className={`status ${booking.status?.toLowerCase()}`}>{booking.status || "CONFIRMED"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

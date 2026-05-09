import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cancelBooking, getMyBookings } from "../api/bookingApi.js";
import EmptyState from "../components/EmptyState.jsx";
import Loading from "../components/Loading.jsx";
import { formatDateTime, getApiMessage } from "../utils/formatters.js";

const latestBookingsFirst = (items) =>
  [...items].sort((first, second) => new Date(second.bookingDate || 0) - new Date(first.bookingDate || 0));

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyBookings()
      .then((items) => setBookings(latestBookingsFirst(items)))
      .catch((err) => setError(getApiMessage(err, "Unable to load your bookings.")))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    try {
      await cancelBooking(id);
      setBookings((items) => items.filter((booking) => booking.id !== id));
    } catch (err) {
      setError(getApiMessage(err, "Unable to cancel this booking."));
    }
  };

  if (loading) return <Loading label="Loading your bookings" />;

  return (
    <section className="page-section">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">My bookings</span>
          <h1>Your reserved seats</h1>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      {bookings.length ? (
        <div className="list-stack">
          {bookings.map((booking) => (
            <article className="list-card" key={booking.id}>
              <div>
                <strong>{booking.eventTitle || `Event #${booking.eventId}`}</strong>
                <span>Booked {formatDateTime(booking.bookingDate)}</span>
              </div>
              <span className={`status ${booking.status?.toLowerCase()}`}>{booking.status || "CONFIRMED"}</span>
              <button className="icon-button danger-soft" type="button" onClick={() => cancel(booking.id)} aria-label="Cancel booking">
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="You have not booked any events yet." message="Explore the catalog and reserve a seat when something feels right." />
      )}
    </section>
  );
}

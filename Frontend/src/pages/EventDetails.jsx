import { CalendarClock, MapPin, Pencil, Trash2, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createBooking } from "../api/bookingApi.js";
import { deleteEvent, getEventById } from "../api/eventApi.js";
import Loading from "../components/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDateTime, getApiMessage } from "../utils/formatters.js";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setEvent(await getEventById(id));
      } catch (err) {
        setError(getApiMessage(err, "Unable to load this event."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const book = async () => {
    setError("");
    try {
      await createBooking(event.id);
      setMessage("Booking confirmed. You can find it in My Bookings.");
    } catch (err) {
      setError(getApiMessage(err, "Booking failed. Please try again."));
    }
  };

  const remove = async () => {
    try {
      await deleteEvent(event.id);
      navigate("/admin/events");
    } catch (err) {
      setError(getApiMessage(err, "Unable to delete this event."));
    }
  };

  if (loading) return <Loading label="Opening event details" />;
  if (!event) return <section className="page-section"><p className="form-error">{error || "Event not found."}</p></section>;

  return (
    <section className="details-layout">
      <div className="details-media" style={{ backgroundImage: `url(${event.image || ""})` }}>
        <span className="badge">{event.category}</span>
      </div>
      <div className="details-content">
        <span className="eyebrow">Event details</span>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <div className="details-grid">
          <span><CalendarClock /> Starts {formatDateTime(event.startDateTime)}</span>
          <span><CalendarClock /> Ends {formatDateTime(event.endDateTime)}</span>
          <span><MapPin /> {event.location}</span>
          <span><UsersRound /> {event.availableSeats} of {event.capacity} seats available</span>
        </div>
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}
        <div className="button-row">
          {!isAuthenticated && <Link className="button primary" to="/login">Login to Book</Link>}
          {isAuthenticated && !isAdmin && <button className="button primary" type="button" onClick={book}>Book Event</button>}
          {isAdmin && (
            <>
              <Link className="button secondary" to="/admin/events"><Pencil size={17} /> Edit in Admin</Link>
              <button className="button danger" type="button" onClick={remove}><Trash2 size={17} /> Delete</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

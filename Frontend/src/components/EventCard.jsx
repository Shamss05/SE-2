import { CalendarDays, MapPin, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateRange } from "../utils/formatters.js";

export default function EventCard({ event }) {
  return (
    <article className="event-card">
      <div className="event-image" style={{ backgroundImage: `url(${event.image || ""})` }}>
        <span className="badge">{event.category || "Event"}</span>
      </div>
      <div className="event-card-body">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="meta-list">
          <span>
            <CalendarDays size={16} /> {formatDateRange(event.startDateTime, event.endDateTime)}
          </span>
          <span>
            <MapPin size={16} /> {event.location}
          </span>
          <span>
            <UsersRound size={16} /> {event.availableSeats ?? 0} seats left
          </span>
        </div>
        <Link className="button secondary full" to={`/events/${event.id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}

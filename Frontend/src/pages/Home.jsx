import { ArrowRight, CalendarCheck, ShieldCheck, Sparkles, TicketCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../api/eventApi.js";
import EventCard from "../components/EventCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getApiMessage } from "../utils/formatters.js";

const getEventTime = (event) => new Date(event.startDateTime).getTime();

const byStartDate = (first, second) => getEventTime(first) - getEventTime(second);

export default function Home() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return events
      .filter((event) => Number.isFinite(getEventTime(event)) && getEventTime(event) >= now)
      .sort(byStartDate);
  }, [events]);
  const featuredEvents = useMemo(() => upcomingEvents.slice(0, 3), [upcomingEvents]);
  const categories = useMemo(() => [...new Set(events.map((event) => event.category).filter(Boolean))].slice(0, 6), [events]);
  const heroEvent = upcomingEvents[0];

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch((err) => setError(getApiMessage(err, "Unable to load featured events.")));
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Event discovery with less friction</span>
          <h1>Discover Events Worth Showing Up For</h1>
          <p>Browse upcoming experiences, reserve your spot, and manage your bookings in one place.</p>
          <div className="hero-actions">
            <Link className="button primary" to="/events">
              Explore Events <ArrowRight size={18} />
            </Link>
            <Link className="button light" to="/register">
              Create Account
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Featured event preview">
          {heroEvent?.image ? <img src={heroEvent.image} alt={heroEvent.title} /> : <div className="hero-event-placeholder" />}
          {heroEvent ? (
            <Link className="hero-ticket" to={`/events/${heroEvent.id}`}>
              <span>Next up</span>
              <strong>{heroEvent.title}</strong>
              <small>{heroEvent.availableSeats ?? 0} seats left</small>
            </Link>
          ) : (
            <div className="hero-ticket">
              <span>Next up</span>
              <strong>No events published yet</strong>
              <small>Create the first event from the admin panel</small>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Featured events</span>
          <h2>Handpicked for curious calendars</h2>
          <Link to="/events">View all events</Link>
        </div>
        {error && <p className="form-error">{error}</p>}
        {featuredEvents.length ? (
          <div className="event-grid">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState title="No featured events yet" message="Published events from the backend will appear here." />
        )}
      </section>

      {categories.length > 0 && (
        <section className="section muted-band">
          <div className="section-heading centered">
            <span className="eyebrow">Categories</span>
            <h2>Find the room you want to be in</h2>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <Link key={category} className="category-tile" to={`/events?category=${category}`}>
                <Sparkles size={20} />
                <span>{category}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section split-section">
        <div>
          <span className="eyebrow">How it works</span>
          <h2>From maybe to booked in three calm steps</h2>
        </div>
        <div className="steps">
          <div>
            <CalendarCheck />
            <h3>Browse what is coming</h3>
            <p>Search by title, category, location, or date and spot the events that fit your week.</p>
          </div>
          <div>
            <TicketCheck />
            <h3>Reserve your seat</h3>
            <p>Book from the event details page and keep every reservation in your account.</p>
          </div>
          <div>
            <ShieldCheck />
            <h3>Manage with confidence</h3>
            <p>Admins get clear tools for events, users, bookings, and system activity.</p>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <strong>Built for real event teams.</strong>
        <span>Clean booking flows, clear availability, role-aware navigation, and operational pages that are ready for Spring Boot services.</span>
      </section>
    </>
  );
}

import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEvents } from "../api/eventApi.js";
import EmptyState from "../components/EmptyState.jsx";
import EventCard from "../components/EventCard.jsx";
import Loading from "../components/Loading.jsx";
import { getApiMessage } from "../utils/formatters.js";

export default function Events() {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: searchParams.get("category") || "",
    location: "",
    sort: "date"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setEvents(await getEvents());
      } catch (err) {
        setError(getApiMessage(err, "Unable to load events right now."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = [...new Set(events.map((event) => event.category).filter(Boolean))];
  const locations = [...new Set(events.map((event) => event.location).filter(Boolean))];

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => event.title?.toLowerCase().includes(filters.search.toLowerCase()))
      .filter((event) => !filters.category || event.category === filters.category)
      .filter((event) => !filters.location || event.location === filters.location)
      .sort((a, b) => {
        if (filters.sort === "seats") return (b.availableSeats || 0) - (a.availableSeats || 0);
        return new Date(a.startDateTime) - new Date(b.startDateTime);
      });
  }, [events, filters]);

  if (loading) return <Loading label="Loading event catalog" />;

  return (
    <section className="page-section">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Event catalog</span>
          <h1>Find your next plan</h1>
          <p>Search curated events by mood, place, and availability.</p>
        </div>
      </div>
      <div className="filters-bar">
        <label className="search-field">
          <Search size={18} />
          <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search by event title" />
        </label>
        <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })}>
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}>
          <option value="date">Sort by date</option>
          <option value="seats">Sort by seats</option>
        </select>
        <SlidersHorizontal className="filters-icon" size={20} />
      </div>
      {error && <p className="form-error">{error}</p>}
      {filteredEvents.length ? (
        <div className="event-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState title="No events match your filters" message="Try a different title, category, or location." />
      )}
    </section>
  );
}

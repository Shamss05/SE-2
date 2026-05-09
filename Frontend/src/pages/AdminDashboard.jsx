import { CalendarPlus, UsersRound, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllBookings } from "../api/bookingApi.js";
import { getEvents } from "../api/eventApi.js";
import { getUsers } from "../api/userApi.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, bookings: 0, users: 0 });

  useEffect(() => {
    Promise.all([getEvents(), getAllBookings(), getUsers()]).then(([events, bookings, users]) => {
      setStats({ events: events.length, bookings: bookings.length, users: users.length });
    });
  }, []);

  const cards = [
    { label: "Total events", value: stats.events, icon: <CalendarPlus /> },
    { label: "Total bookings", value: stats.bookings, icon: <WalletCards /> },
    { label: "Total users", value: stats.users, icon: <UsersRound /> }
  ];

  return (
    <section className="page-section">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Admin dashboard</span>
          <h1>Eventify control panel</h1>
          <p>Monitor the platform and jump into the operational work that matters.</p>
        </div>
      </div>
      <div className="stats-grid">
        {cards.map(({ label, value, icon }) => (
          <article className="stat-card" key={label}>
            {icon}
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

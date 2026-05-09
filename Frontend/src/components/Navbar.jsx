import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getUserNotifications } from "../api/notificationApi.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const guestLinks = [
    ["Home", "/"],
    ["Events", "/events"],
    ["Login", "/login"],
    ["Register", "/register"]
  ];
  const userLinks = [
    ["Home", "/"],
    ["Events", "/events"],
    ["My Bookings", "/my-bookings"],
    ["Notifications", "/notifications"],
    ["Profile", "/profile"]
  ];
  const adminLinks = [
    ["Admin Dashboard", "/admin"],
    ["Manage Events", "/admin/events"],
    ["Manage Users", "/admin/users"],
    ["All Bookings", "/admin/bookings"]
  ];
  const links = isAdmin ? adminLinks : isAuthenticated ? userLinks : guestLinks;

  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated || isAdmin || !user?.id) {
      setUnreadCount(0);
      return;
    }

    try {
      const notifications = await getUserNotifications(user.id);
      setUnreadCount(notifications.filter((notification) => !notification.readStatus).length);
    } catch {
      setUnreadCount(0);
    }
  }, [isAuthenticated, isAdmin, user?.id]);

  useEffect(() => {
    loadUnreadCount();
    const intervalId = window.setInterval(loadUnreadCount, 30000);
    window.addEventListener("focus", loadUnreadCount);
    window.addEventListener("eventify:notifications-read", loadUnreadCount);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", loadUnreadCount);
      window.removeEventListener("eventify:notifications-read", loadUnreadCount);
    };
  }, [loadUnreadCount]);

  return (
    <header className="navbar">
      <Link className="brand" to="/" onClick={() => setOpen(false)}>
        <span className="brand-mark">E</span>
        <span>Eventify</span>
      </Link>
      <button className="icon-button nav-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav className={open ? "nav-links open" : "nav-links"}>
        {links.map(([label, to]) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) => [
              isActive ? "active" : "",
              to === "/notifications" && unreadCount ? "has-notification" : ""
            ].filter(Boolean).join(" ")}
          >
            {label}
            {to === "/notifications" && unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
          </NavLink>
        ))}
        {isAuthenticated && (
          <button className="button logout-button small" type="button" onClick={logout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

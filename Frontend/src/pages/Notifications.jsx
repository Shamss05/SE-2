import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserNotifications, markUserNotificationsRead } from "../api/notificationApi.js";
import EmptyState from "../components/EmptyState.jsx";
import Loading from "../components/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDateTime, getApiMessage } from "../utils/formatters.js";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    getUserNotifications(user.id)
      .then(async (items) => {
        if (!active) return;
        setNotifications(items);
        if (items.some((notification) => !notification.readStatus)) {
          const updated = await markUserNotificationsRead(user.id);
          if (!active) return;
          setNotifications(updated);
          window.dispatchEvent(new Event("eventify:notifications-read"));
        }
      })
      .catch((err) => setError(getApiMessage(err, "Unable to load notifications.")))
      .finally(() => setLoading(false));

    return () => {
      active = false;
    };
  }, [user?.id]);

  if (loading) return <Loading label="Loading notifications" />;

  return (
    <section className="page-section narrow">
      <span className="eyebrow">Notifications</span>
      <h1>Updates that matter</h1>
      {error && <p className="form-error">{error}</p>}
      {notifications.length ? (
        <div className="list-stack">
          {notifications.map((notification) => (
            <article className={`notification-card ${notification.readStatus ? "read" : "unread"}`} key={notification.id}>
              <Bell size={20} />
              <div>
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
                <span>{formatDateTime(notification.createdAt)}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No notifications yet" message="Booking confirmations and event updates will appear here." />
      )}
    </section>
  );
}

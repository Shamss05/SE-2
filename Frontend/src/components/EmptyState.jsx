import { CalendarX } from "lucide-react";

export default function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <CalendarX size={34} />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}

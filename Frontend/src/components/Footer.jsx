import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link className="brand compact" to="/">
          <span>Eventify</span>
        </Link>
        <p>Curated discovery, simple booking, and clear event operations.</p>
      </div>
      <div className="footer-links">
        <Link to="/events">Events</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </footer>
  );
}

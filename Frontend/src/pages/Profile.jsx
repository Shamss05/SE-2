import { Mail, Shield, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <section className="page-section narrow">
      <span className="eyebrow">Profile</span>
      <h1>Your account</h1>
      <div className="profile-panel">
        <div className="avatar">{user?.fullName?.charAt(0) || "E"}</div>
        <div className="profile-row"><UserRound /> <span>{user?.fullName || "Eventify User"}</span></div>
        <div className="profile-row"><Mail /> <span>{user?.email}</span></div>
        <div className="profile-row"><Shield /> <span>{user?.role || "USER"}</span></div>
        <button className="button secondary" type="button" onClick={logout}>Logout</button>
      </div>
    </section>
  );
}

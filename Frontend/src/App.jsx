import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManageEvents from "./pages/ManageEvents.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import AllBookings from "./pages/AllBookings.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<ManageEvents />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/bookings" element={<AllBookings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

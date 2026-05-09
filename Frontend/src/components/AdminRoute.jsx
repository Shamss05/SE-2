import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "./Loading.jsx";

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, authReady } = useAuth();

  if (!authReady) return <Loading label="Checking admin access" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/events" replace />;
  return <Outlet />;
}

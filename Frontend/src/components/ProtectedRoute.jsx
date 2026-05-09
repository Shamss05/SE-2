import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "./Loading.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) return <Loading label="Checking your session" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

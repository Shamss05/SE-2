import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiMessage } from "../utils/formatters.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    try {
      setLoading(true);
      const user = await login(form);
      if (user.role === "ADMIN") navigate("/admin");
      else navigate(location.state?.from?.pathname || "/events");
    } catch (err) {
      setError(getApiMessage(err, "Login failed. Check your email and password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Log in to Eventify</h1>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
        </label>
        <label>
          Password
          <span className="password-field">
            <input type={showPassword ? "text" : "password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="button primary full" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="form-note">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

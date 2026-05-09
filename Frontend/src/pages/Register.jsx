import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiMessage } from "../utils/formatters.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [visiblePasswords, setVisiblePasswords] = useState({ password: false, confirmPassword: false });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePassword = (field) => {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  };

  const validate = () => {
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) return "All fields are required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setLoading(true);
      await register({ fullName: form.fullName, email: form.email, password: form.password });
      setMessage("Account created. You can log in now.");
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      setError(getApiMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">Join Eventify</span>
        <h1>Create your account</h1>
        <label>
          Full name
          <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} placeholder="Your full name" />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
        </label>
        <label>
          Password
          <span className="password-field">
            <input type={visiblePasswords.password ? "text" : "password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePassword("password")}
              aria-label={visiblePasswords.password ? "Hide password" : "Show password"}
              aria-pressed={visiblePasswords.password}
            >
              {visiblePasswords.password ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        <label>
          Confirm password
          <span className="password-field">
            <input type={visiblePasswords.confirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Repeat your password" />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePassword("confirmPassword")}
              aria-label={visiblePasswords.confirmPassword ? "Hide confirm password" : "Show confirm password"}
              aria-pressed={visiblePasswords.confirmPassword}
            >
              {visiblePasswords.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
        <button className="button primary full" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
        <p className="form-note">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

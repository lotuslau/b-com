import { useState } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff
} from "react-icons/hi";
import { loginCustomer } from "../services/api";

export default function LoginPage({ setPage, setCustomer, showNotification }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await loginCustomer({
        email: form.email,
        password: form.password
      });

      if (data.success) {
        localStorage.setItem("bcom_token", data.token);
        localStorage.setItem("bcom_customer", JSON.stringify(data.customer));
        setCustomer(data.customer);
        showNotification(`Welcome back, ${data.customer.name}! 👋`);
        setPage("account");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      background: "#f9f9f9"
    }}>
      <div style={{
        background: "white",
        borderRadius: 20,
        padding: "2.5rem",
        width: "100%",
        maxWidth: 440,
        border: "1px solid var(--border)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)"
      }}>

        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src="/images/logo.png"
            alt="B-Com Belize"
            style={{ height: 50, objectFit: "contain", margin: "0 auto 1rem" }}
          />
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.8rem",
            fontWeight: 900,
            marginBottom: "0.25rem"
          }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Sign in to your B-Com account
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{
            background: "#fff0f2",
            border: "1px solid #e05c6a",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#e05c6a",
            fontSize: "0.85rem",
            marginBottom: "1.25rem"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div style={{ position: "relative" }}>
            <HiOutlineMail
              size={18}
              color="var(--muted)"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none"
              }}
            />
            <input
              className="form-input"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ paddingLeft: 38 }}
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: "relative" }}>
            <HiOutlineLockClosed
              size={18}
              color="var(--muted)"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none"
              }}
            />
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ paddingLeft: 38, paddingRight: 38 }}
            />
            <button
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center"
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ? <HiOutlineEyeOff size={18} />
                : <HiOutlineEye size={18} />
              }
            </button>
          </div>
        </div>

        {/* FORGOT PASSWORD */}
        <div style={{
          textAlign: "right",
          marginBottom: "1.25rem",
          marginTop: "-0.5rem"
        }}>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#2563EB",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif"
            }}
            onClick={() => showNotification("Password reset — contact us via WhatsApp", "info")}
          >
            Forgot password?
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          className="btn-primary"
          style={{
            width: "100%",
            opacity: loading ? 0.7 : 1,
            fontSize: "1rem",
            padding: "14px"
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        {/* DIVIDER */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "1.5rem 0"
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
            New to B-Com?
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* REGISTER BUTTON */}
        <button
          className="btn-secondary"
          style={{ width: "100%", fontSize: "1rem", padding: "14px" }}
          onClick={() => setPage("register")}
        >
          Create an Account
        </button>

        {/* GUEST CHECKOUT */}
        <p style={{
          textAlign: "center",
          color: "var(--muted)",
          fontSize: "0.8rem",
          marginTop: "1rem"
        }}>
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.8rem",
              fontFamily: "'DM Sans', sans-serif"
            }}
            onClick={() => setPage("featured")}
          >
            Continue as Guest
          </button>
        </p>
      </div>
    </div>
  );
}
import { useState } from "react";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineLocationMarker
} from "react-icons/hi";
import { registerCustomer } from "../services/api";
import { DELIVERY_TO } from "../data/constants";

export default function RegisterPage({ setPage, setCustomer, showNotification }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    district: "Belize City"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await registerCustomer({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: form.address,
        district: form.district
      });

      if (data.success) {
        localStorage.setItem("bcom_token", data.token);
        localStorage.setItem("bcom_customer", JSON.stringify(data.customer));
        setCustomer(data.customer);
        showNotification(`Welcome to B-Com, ${data.customer.name}! 🎉`);
        setPage("account");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (p.length === 0) return { strength: 0, label: "", color: "" };
    if (p.length < 6) return { strength: 1, label: "Weak", color: "#e05c6a" };
    if (p.length < 8) return { strength: 2, label: "Fair", color: "#f59e0b" };
    if (p.match(/[A-Z]/) && p.match(/[0-9]/)) return { strength: 4, label: "Strong", color: "#22c55e" };
    return { strength: 3, label: "Good", color: "#2563EB" };
  };

  const pwStrength = getPasswordStrength();

  const FIELDS = [
    { label: "Full Name *", field: "name", type: "text", icon: <HiOutlineUser size={18} color="var(--muted)" />, placeholder: "John Smith" },
    { label: "Email Address *", field: "email", type: "email", icon: <HiOutlineMail size={18} color="var(--muted)" />, placeholder: "your@email.com" },
    { label: "Phone / WhatsApp", field: "phone", type: "tel", icon: <HiOutlinePhone size={18} color="var(--muted)" />, placeholder: "+501-XXX-XXXX" },
    { label: "Delivery Address", field: "address", type: "text", icon: <HiOutlineLocationMarker size={18} color="var(--muted)" />, placeholder: "Street address" },
  ];

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
        maxWidth: 500,
        border: "1px solid var(--border)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)"
      }}>

        {/* HEADER */}
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
            Create Account
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Join B-Com Belize today
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

        {/* FIELDS */}
        {FIELDS.map(({ label, field, type, icon, placeholder }) => (
          <div key={field} className="form-group">
            <label className="form-label">{label}</label>
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none"
              }}>
                {icon}
              </div>
              <input
                className="form-input"
                type={type}
                placeholder={placeholder}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>
        ))}

        {/* DISTRICT */}
        <div className="form-group">
          <label className="form-label">Delivery Area</label>
          <select
            className="form-input"
            value={form.district}
            onChange={e => setForm({ ...form, district: e.target.value })}
          >
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label className="form-label">Password *</label>
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
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
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

          {/* PASSWORD STRENGTH */}
          {form.password.length > 0 && (
            <div style={{ marginTop: 6 }}>
              <div style={{
                display: "flex",
                gap: 4,
                marginBottom: 4
              }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: i <= pwStrength.strength
                      ? pwStrength.color
                      : "var(--border)",
                    transition: "all 0.3s"
                  }} />
                ))}
              </div>
              <span style={{
                fontSize: "0.75rem",
                color: pwStrength.color,
                fontWeight: 600
              }}>
                {pwStrength.label}
              </span>
            </div>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="form-group">
          <label className="form-label">Confirm Password *</label>
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
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              style={{
                paddingLeft: 38,
                paddingRight: 38,
                borderColor: form.confirmPassword && form.password !== form.confirmPassword
                  ? "#e05c6a"
                  : form.confirmPassword && form.password === form.confirmPassword
                    ? "#22c55e"
                    : "var(--border)"
              }}
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
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm
                ? <HiOutlineEyeOff size={18} />
                : <HiOutlineEye size={18} />
              }
            </button>
          </div>
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p style={{ color: "#e05c6a", fontSize: "0.75rem", marginTop: 4 }}>
              Passwords do not match
            </p>
          )}
        </div>

        {/* TERMS CHECKBOX */}
        <div style={{
          background: "#f0f7ff",
          border: "1px solid #dbeafe",
          borderRadius: 10,
          padding: "1rem",
          marginBottom: "1.25rem"
        }}>
          <label style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            cursor: "pointer",
            fontSize: "0.85rem",
            lineHeight: 1.6,
            color: "var(--dark)"
          }}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={e => setAgreedToTerms(e.target.checked)}
              style={{ marginTop: 3, accentColor: "#2563EB" }}
            />
            <span>
              I agree to B-Com's{" "}
              <span
                style={{ color: "#2563EB", textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setPage("terms")}
              >
                Terms & Conditions
              </span>
              {" "}and{" "}
              <span
                style={{ color: "#2563EB", textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setPage("privacy")}
              >
                Privacy Policy
              </span>
            </span>
          </label>
        </div>

        {/* REGISTER BUTTON */}
        <button
          className="btn-primary"
          style={{
            width: "100%",
            opacity: loading ? 0.7 : 1,
            fontSize: "1rem",
            padding: "14px"
          }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account →"}
        </button>

        {/* LOGIN LINK */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "1.5rem 0 0"
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
            Already have an account?
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <button
          className="btn-secondary"
          style={{ width: "100%", marginTop: "1rem", fontSize: "1rem", padding: "14px" }}
          onClick={() => setPage("login")}
        >
          Sign In Instead
        </button>
      </div>
    </div>
  );
}
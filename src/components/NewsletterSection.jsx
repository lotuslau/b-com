import { useState } from "react";
import { HiOutlineMail, HiOutlineCheckCircle } from "react-icons/hi";
import { getApiUrl } from "../services/apiConfig";

export default function NewsletterSection({ showNotification }) {
  const [form, setForm] = useState({ email: "", name: "" });
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!form.email) {
      showNotification("Please enter your email address", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        getApiUrl('/newsletter/subscribe'),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );
      const data = await res.json();

      if (data.success) {
        setSubscribed(true);
        showNotification("Successfully subscribed! 🎉");
      } else {
        showNotification(data.error || "Subscription failed", "error");
      }
    } catch (err) {
      showNotification("Could not subscribe. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "#102538",
      padding: "4rem 2rem"
    }}>
      <div style={{
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center"
      }}>

        <div style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem"
        }}>
          <HiOutlineMail size={26} color="white" />
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2rem",
          fontWeight: 900,
          color: "white",
          marginBottom: "0.75rem"
        }}>
          Stay in the Loop
        </h2>

        <p style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: "0.95rem",
          lineHeight: 1.7,
          marginBottom: "2rem"
        }}>
          Subscribe to receive updates on new arrivals, exclusive deals
          and promotions. Be the first to know!
        </p>

        {subscribed ? (
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem"
          }}>
            <HiOutlineCheckCircle size={48} color="#22c55e" />
            <h3 style={{ color: "white", fontWeight: 700 }}>
              You're subscribed!
            </h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
              Thank you for subscribing to B-Com Belize updates.
            </p>
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            maxWidth: 480,
            margin: "0 auto"
          }}>
            <input
              type="text"
              placeholder="Your name (optional)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{
                border: "1.5px solid rgba(255,255,255,0.2)",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: "0.9rem",
                fontFamily: "'DM Sans', sans-serif",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                outline: "none",
                width: "100%"
              }}
            />
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <input
                type="email"
                placeholder="Your email address *"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                style={{
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: "0.9rem",
                  fontFamily: "'DM Sans', sans-serif",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  outline: "none",
                  flex: 1
                }}
              />
              <button
                style={{
                  background: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 24px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                  opacity: loading ? 0.7 : 1
                }}
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </div>
            <p style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.75rem"
            }}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
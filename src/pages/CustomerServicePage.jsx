import {
  HiOutlineChatAlt2,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineQuestionMarkCircle
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

export default function CustomerServicePage({ showNotification }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      showNotification("Please fill in all required fields", "error");
      return;
    }
    setSubmitted(true);
    showNotification("Message sent! We'll reply within 24 hours ✅");
  };

  const FAQS = [
    {
      Q: "How long does delivery take?",
      A: "Delivery within Belize City takes 1-2 business days. Other districts take 3-5 business days."
    },
    {
      Q: "What payment methods do you accept?",
      A: "We accept Belize Bank cards, Atlantic Bank cards, online bank transfers, PayPal and cash on delivery."
    },
    {
      Q: "Can I return or exchange an item?",
      A: "Yes! We offer a 30-day return and exchange policy. Items must be unused and in original condition."
    },
    {
      Q: "How do I order from Amazon, Shein or Temu?",
      A: "Find the item on the store, copy the product link, then paste it in our Orders page and we'll handle the rest."
    },
    {
      Q: "Do you deliver to all districts?",
      A: "Yes! We deliver to all 6 districts — Belize, Cayo, Corozal, Orange Walk, Stann Creek and Toledo."
    },
    {
      Q: "How can I track my order?",
      A: "Once your order is placed you'll receive a reference number. Contact us via WhatsApp with your reference to get an update."
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="about-hero">
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(2rem,5vw,3.5rem)",
          fontWeight: 900,
          marginBottom: "1rem"
        }}>
          Customer Service
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: "1.1rem",
          maxWidth: 480,
          margin: "0 auto",
          lineHeight: 1.7
        }}>
          We're here to help! Reach out to us through any of the channels below.
        </p>
      </div>

      {/* CONTACT METHODS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem",
        maxWidth: 1280,
        margin: "0 auto",
        padding: "3rem 2rem 0"
      }}>
        {[
          {
            emoji: <FaWhatsapp size={32} color="#25D366" />,
            title: "WhatsApp",
            desc: "Chat with us directly",
            action: "Message Us",
            color: "#25D366",
            href: "https://wa.me/501XXXXXXXX"
          },
          {
            emoji: <HiOutlineMail size={32} color="#2563EB" />,
            title: "Email",
            desc: "hello@b-com.bz",
            action: "Send Email",
            color: "var(--teal)",
            href: "mailto:hello@b-com.bz"
          },
          {
            emoji: <HiOutlinePhone size={32} color="var(--dark)" />,
            title: "Phone",
            desc: "+501-XXX-XXXX",
            action: "Call Now",
            color: "var(--dark)",
            href: "tel:+5016221234"
          },
          {
            emoji: <HiOutlineClock size={32} color="var(--muted)" />,
            title: "Hours",
            desc: "Mon-Sat: 8am-6pm",
            action: null,
            color: "var(--muted)",
            href: null
          },
        ].map(c => (
          <div key={c.title} style={{
            background: "white",
            borderRadius: 16,
            padding: "1.5rem",
            border: "1px solid var(--border)",
            textAlign: "center"
          }}>
            <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>{c.emoji}</div>
            <h3 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{c.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>{c.desc}</p>
            {c.action && (
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  background: c.color,
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: 600
                }}
              >
                {c.action}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* CONTACT FORM + FAQ */}
      <div className="cs-grid" style={{ marginTop: "2rem" }}>

        {/* CONTACT FORM */}
        <div className="cs-card">
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.5rem",
            marginBottom: "1.5rem"
          }}>
            Send us a Message
          </h2>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ marginBottom: "0.5rem" }}>Message Sent!</h3>
              <p style={{ color: "var(--muted)" }}>
                Thank you {form.name}! We'll reply to {form.email} within 24 hours.
              </p>
            </div>
          ) : (
            <>
              {[
                ["Full Name *", "name", "text"],
                ["Email Address *", "email", "email"],
                ["Phone Number", "phone", "tel"],
                ["Subject", "subject", "text"],
              ].map(([label, field, type]) => (
                <div key={field} className="form-group">
                  <label className="form-label">{label}</label>
                  <input
                    className="form-input"
                    type={type}
                    placeholder={label.replace(" *", "")}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-input"
                  style={{ height: 120, resize: "vertical" }}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={handleSubmit}
              >
                Send Message →
              </button>
            </>
          )}
        </div>

        {/* FAQ */}
        <div className="cs-card">
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.5rem",
            marginBottom: "1.5rem"
          }}>
            Frequently Asked Questions
          </h2>
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item">
              <p className="faq-question"><span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <HiOutlineQuestionMarkCircle size={16} color="#2563EB" /> {faq.q}
              </span></p>
              <p className="faq-answer">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
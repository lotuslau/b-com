import {
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
  const [openFAQ, setOpenFAQ] = useState(null); // 👈 accordion state

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setSubmitted(true);
    showNotification("Message sent! We'll reply within 24 hours ✅");

    // optional reset
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const FAQS = [
     {
      q: "How long does shipping take?",
      a: "Orders within Belize City typically take 1-2 business days. Deliveries to other districts may take 3-5 business days depending on the location and availability of the item. We strive to process and ship all orders as quickly as possible, but please allow for potential delays during peak seasons or due to unforeseen circumstances."
    },
    {
      q: "How can I make payment for my order?",
      a: "We accept several payment methods for your convenience. You can pay using Belize Bank cards, Atlantic Bank cards, online bank transfers, and PayPal. When you place an order, you'll be prompted to choose your preferred payment method and follow the instructions to complete the transaction securely."
    },
    {
      q: "How can I track my order?",
      a: "Once your order is placed, you'll receive a reference number. You can contact us via WhatsApp with your reference number to get an update on the status of your delivery. We will provide you with the latest information regarding your order and estimated delivery time."
    },
    {
      q: "Does B-Com deliver countrywide?",
      a: "Currently, B-Com delivers to Belize City, Ladyville, Sandhill and surrounding areas ONLY. We are working on expanding our delivery coverage in the future, so stay tuned for updates on new delivery locations!"
    }, 
  ];

  const CONTACTS = [
    {
      emoji: <FaWhatsapp size={32} color="#25D366" />,
      title: "WhatsApp",
      desc: "Chat with us directly",
      action: "Message Us",
      color: "#25D366",
      href: `https://wa.me/501XXXXXXXX?text=${encodeURIComponent(
        `Hi B-Com! My name is ${form.name || "there"} and I need help with an order 😊`
      )}`
    },
    {
      emoji: <HiOutlineMail size={32} color="#2563EB" />,
      title: "Email",
      desc: "hello@b-com.bz",
      action: "Send Email",
      color: "#2563EB",
      href: "mailto:hello@b-com.bz"
    },
    {
      emoji: <HiOutlinePhone size={32} color="var(--dark)" />,
      title: "Phone",
      desc: "+501-XXX-XXXX",
      action: "Call Now",
      color: "var(--dark)",
      href: "tel:+501XXXXXXXX"
    },
    {
      emoji: <HiOutlineClock size={32} color="var(--muted)" />,
      title: "Business Hours",
      desc: "Mon-Sat: 8am-6pm",
      action: null,
      color: "var(--muted)",
      href: null
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
          We are here to help! Reach out to us through any of the channels below.
        </p>
      </div>

      {/* CONTACT CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem",
        maxWidth: 1280,
        margin: "0 auto",
        padding: "3rem 2rem 0"
      }}>
        {CONTACTS.map(c => (
          <div key={c.title} style={{
            background: "white",
            borderRadius: 16,
            padding: "1.5rem",
            border: "1px solid var(--border)",
            textAlign: "center"
          }}>
            <div style={{
              marginBottom: "0.75rem",
              display: "flex",
              justifyContent: "center"
            }}>
              {c.emoji}
            </div>

            <h3 style={{ fontWeight: 700 }}>{c.title}</h3>

            <p style={{
              color: "var(--muted)",
              fontSize: "0.9rem",
              marginBottom: "1rem"
            }}>
              {c.desc}
            </p>

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
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                {c.action}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* FORM + FAQ */}
      <div className="cs-grid" style={{ marginTop: "2rem" }}>

        {/* FORM */}
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
              <div style={{ fontSize: "4rem" }}>✅</div>
              <h3>Message Sent!</h3>
              <p style={{ color: "var(--muted)" }}>
                Thank you {form.name}! We will reply within 24 hours.
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
                    value={form[field] || ""}
                    onChange={e =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-input"
                  style={{ height: 120 }}
                  value={form.message}
                  onChange={e =>
                    setForm({ ...form, message: e.target.value })
                  }
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

          {FAQS.map((faq, i) => {
            const isOpen = openFAQ === i;

            return (
              <div key={i} style={{ marginBottom: "1rem" }}>
                <button
                  onClick={() => setOpenFAQ(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  <p style={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}>
                    <span style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center"
                    }}>
                      <HiOutlineQuestionMarkCircle size={16} color="#2563EB" />
                      {faq.q}
                    </span>
                    <span>{isOpen ? "−" : "+"}</span>
                  </p>
                </button>

                {isOpen && (
                  <p style={{ marginTop: "0.5rem" }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
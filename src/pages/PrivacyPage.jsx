import { PRIVACY_POLICY, COMPANY_INFO } from "../data/policies";
import {
  HiOutlineLockClosed,
  HiOutlineClock,
  HiOutlineShieldCheck
} from "react-icons/hi";

export default function PrivacyPage({ setPage }) {
  return (
    <div>
      {/* HEADER */}
      <div className="about-hero">
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem"
        }}>
          <HiOutlineLockClosed size={48} color="rgba(255,255,255,0.8)" />
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(2rem,5vw,3rem)",
          fontWeight: 900,
          marginBottom: "0.75rem"
        }}>
          Privacy Policy
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: "0.95rem",
          maxWidth: 480,
          margin: "0 auto 1rem",
          lineHeight: 1.7
        }}>
          Your privacy is important to us. Learn how we collect,
          use and protect your data.
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.82rem"
        }}>
          <HiOutlineClock size={14} />
          Last updated: {PRIVACY_POLICY.lastUpdated}
        </div>
      </div>

      {/* KEY POINTS */}
      <div style={{
        background: "#f0f7ff",
        borderBottom: "1px solid #dbeafe",
        padding: "1.5rem 2rem"
      }}>
        <div style={{
          maxWidth: 860,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem"
        }}>
          {[
            { icon: <HiOutlineShieldCheck size={20} color="#2563EB" />, text: "We never sell your data" },
            { icon: <HiOutlineLockClosed size={20} color="#2563EB" />, text: "PCI DSS compliant payments" },
            { icon: <HiOutlineShieldCheck size={20} color="#2563EB" />, text: "We never store card details" },
            { icon: <HiOutlineShieldCheck size={20} color="#2563EB" />, text: "HTTPS encryption throughout" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#2563EB"
            }}>
              {item.icon} {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "3rem 2rem"
      }}>
        {PRIVACY_POLICY.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: "2rem" }}>
            <h2 style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--dark)",
              marginBottom: "0.75rem",
              paddingBottom: "0.5rem",
              borderBottom: "2px solid #dbeafe"
            }}>
              {section.title}
            </h2>
            <p style={{
              color: "var(--muted)",
              lineHeight: 1.8,
              fontSize: "0.92rem"
            }}>
              {section.content}
            </p>
          </div>
        ))}

        {/* CONTACT BOX */}
        <div style={{
          background: "#f0f7ff",
          border: "1px solid #dbeafe",
          borderRadius: 12,
          padding: "1.25rem 1.5rem",
          marginTop: "2rem"
        }}>
          <p style={{
            fontSize: "0.85rem",
            color: "#1e40af",
            lineHeight: 1.6
          }}>
            <strong>Questions about your data?</strong> Contact our
            privacy team at {COMPANY_INFO.email} or via
            WhatsApp at {COMPANY_INFO.whatsapp}
          </p>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div style={{
        background: "#f9f9f9",
        borderTop: "1px solid var(--border)",
        padding: "2rem",
        textAlign: "center"
      }}>
        <button
          className="btn-primary"
          onClick={() => setPage("customer-service")}
        >
          Contact Us →
        </button>
      </div>
    </div>
  );
}
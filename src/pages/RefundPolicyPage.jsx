import { REFUND_POLICY, COMPANY_INFO } from "../data/policies";
import {
  HiOutlineRefresh,
  HiOutlineClock,
  HiOutlineCheckCircle
} from "react-icons/hi";

export default function RefundPolicyPage({ setPage }) {
  return (
    <div>
      {/* HEADER */}
      <div className="about-hero">
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem"
        }}>
          <HiOutlineRefresh size={48} color="rgba(255,255,255,0.8)" />
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(2rem,5vw,3rem)",
          fontWeight: 900,
          marginBottom: "0.75rem"
        }}>
          Return & Refund Policy
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: "0.95rem",
          maxWidth: 480,
          margin: "0 auto 1rem",
          lineHeight: 1.7
        }}>
          We want you to love your purchase. If something isn't right,
          we'll make it right.
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
          Last updated: {REFUND_POLICY.lastUpdated}
        </div>
      </div>

      {/* KEY STATS */}
      <div style={{
        background: "#f0f7ff",
        borderBottom: "1px solid #dbeafe",
        padding: "1.5rem 2rem"
      }}>
        <div style={{
          maxWidth: 860,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          textAlign: "center"
        }}>
          {[
            { value: "30 Days", label: "Return Window" },
            { value: "5-10 Days", label: "Refund Processing" },
            { value: "Free", label: "Exchange Service" },
            { value: "Original", label: "Payment Method Refund" },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#2563EB",
                marginBottom: 4
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: "0.82rem",
                color: "var(--muted)"
              }}>
                {stat.label}
              </div>
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
        {REFUND_POLICY.sections.map((section, i) => (
          <div key={i} style={{
            marginBottom: "2rem",
            background: "white",
            borderRadius: 12,
            padding: "1.5rem",
            border: "1px solid var(--border)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "0.75rem"
            }}>
              <HiOutlineCheckCircle size={20} color="#2563EB" />
              <h2 style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--dark)"
              }}>
                {section.title}
              </h2>
            </div>
            <p style={{
              color: "var(--muted)",
              lineHeight: 1.8,
              fontSize: "0.92rem"
            }}>
              {section.content}
            </p>
          </div>
        ))}

        {/* IMPORTANT NOTE */}
        <div style={{
          background: "#fff8e1",
          border: "1px solid #f59e0b",
          borderRadius: 12,
          padding: "1.25rem 1.5rem"
        }}>
          <p style={{
            fontSize: "0.85rem",
            color: "#92400e",
            lineHeight: 1.6
          }}>
            <strong>Important — Belize Bank & Atlantic Bank Policy:</strong> As required by our banking partners, refunds for card transactions must be returned to the original card used for purchase. We cannot issue cash refunds for card transactions or process refunds via wire transfer. This protects both our customers and our business from fraud.
          </p>
        </div>

        {/* CONTACT */}
        <div style={{
          textAlign: "center",
          marginTop: "2rem"
        }}>
          <p style={{
            color: "var(--muted)",
            marginBottom: "1rem",
            fontSize: "0.9rem"
          }}>
            Need to start a return? Contact us directly.
          </p>
          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button
              className="btn-primary"
              onClick={() => setPage("customer-service")}
            >
              Contact Customer Service →
            </button>
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#25D366",
                color: "white",
                padding: "12px 28px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: "0.9rem"
              }}
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
import { TERMS_AND_CONDITIONS, COMPANY_INFO } from "../data/policies";
import {
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineClock
} from "react-icons/hi";

export default function TermsPage({ setPage }) {
  return (
    <div>
      {/* HEADER */}
      <div className="about-hero">
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem"
        }}>
          <HiOutlineDocumentText size={48} color="rgba(255,255,255,0.8)" />
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(2rem,5vw,3rem)",
          fontWeight: 900,
          marginBottom: "0.75rem"
        }}>
          Terms & Conditions
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: "0.95rem",
          maxWidth: 480,
          margin: "0 auto 1rem",
          lineHeight: 1.7
        }}>
          Please read these terms carefully before using B-Com Belize.
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
          Last updated: {TERMS_AND_CONDITIONS.lastUpdated}
        </div>
      </div>

      {/* COMPLIANCE BADGES */}
      <div style={{
        background: "#f0f7ff",
        borderBottom: "1px solid #dbeafe",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        flexWrap: "wrap"
      }}>
        {[
          "🇧🇿 Governed by Belize Law",
          "🔒 PCI DSS Compliant Payments",
          "🏦 Belize Bank & Atlantic Bank Approved",
          "🛡️ 3D Secure Authentication"
        ].map(b => (
          <span key={b} style={{
            fontSize: "0.82rem",
            color: "#2563EB",
            fontWeight: 600
          }}>
            {b}
          </span>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "3rem 2rem"
      }}>
        {/* COMPANY INFO BOX */}
        <div style={{
          background: "#f0f7ff",
          border: "1px solid #dbeafe",
          borderRadius: 12,
          padding: "1.25rem 1.5rem",
          marginBottom: "2.5rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: "0.5rem"
          }}>
            <HiOutlineShieldCheck size={18} color="#2563EB" />
            <strong style={{ color: "#2563EB" }}>
              {COMPANY_INFO.name}
            </strong>
          </div>
          <p style={{
            fontSize: "0.85rem",
            color: "var(--muted)",
            lineHeight: 1.6
          }}>
            {COMPANY_INFO.address} · {COMPANY_INFO.email} · {COMPANY_INFO.phone}
          </p>
        </div>

        {/* SECTIONS */}
        {TERMS_AND_CONDITIONS.sections.map((section, i) => (
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

        {/* ACCEPTANCE NOTE */}
        <div style={{
          background: "#fff8e1",
          border: "1px solid #f59e0b",
          borderRadius: 12,
          padding: "1.25rem 1.5rem",
          marginTop: "2rem"
        }}>
          <p style={{
            fontSize: "0.85rem",
            color: "#92400e",
            lineHeight: 1.6
          }}>
            <strong>Important:</strong> By placing an order on B-Com Belize you confirm that you have read, understood and agreed to these Terms and Conditions. The date and time of your agreement is recorded with each order for compliance purposes as required by our banking partners.
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
        <p style={{
          color: "var(--muted)",
          marginBottom: "1rem",
          fontSize: "0.9rem"
        }}>
          Questions about our terms? We're here to help.
        </p>
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
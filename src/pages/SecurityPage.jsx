import {
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineServer,
  HiOutlineRefresh,
  HiOutlineDocumentText
} from "react-icons/hi";

export default function SecurityPage({ setPage }) {
  const SECURITY_FEATURES = [
    {
      icon: <HiOutlineLockClosed size={28} color="#2563EB" />,
      title: "SSL/TLS Encryption",
      desc: "All data transmitted between your browser and our website is encrypted using industry-standard SSL/TLS technology. Look for the padlock icon in your browser address bar."
    },
    {
      icon: <HiOutlineShieldCheck size={28} color="#2563EB" />,
      title: "PCI DSS Compliant Payments",
      desc: "All card payments are processed through Belize Bank Limited and Atlantic Bank Limited's PCI DSS compliant hosted payment gateways. We never store, process or transmit your card details on our servers."
    },
    {
      icon: <HiOutlineEye size={28} color="#2563EB" />,
      title: "3D Secure Authentication",
      desc: "Card payments are protected by Verified by Visa and Mastercard SecureCode (3D Secure). This adds an extra layer of authentication to ensure transactions are initiated by the rightful cardholder."
    },
    {
      icon: <HiOutlineServer size={28} color="#2563EB" />,
      title: "Secure Data Storage",
      desc: "Your personal information is stored securely in encrypted databases. We collect only the minimum data necessary to fulfill your order. We never store sensitive payment card information."
    },
    {
      icon: <HiOutlineRefresh size={28} color="#2563EB" />,
      title: "Regular Security Updates",
      desc: "Our systems are regularly updated and monitored for security vulnerabilities. We follow industry best practices to protect your data at all times."
    },
    {
      icon: <HiOutlineDocumentText size={28} color="#2563EB" />,
      title: "Privacy Protection",
      desc: "Your personal data is handled in accordance with our Privacy Policy. We never sell your information to third parties. Data is only shared as necessary to fulfill your order."
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="about-hero">
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem"
        }}>
          <HiOutlineShieldCheck size={52} color="rgba(255,255,255,0.9)" />
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(2rem,5vw,3rem)",
          fontWeight: 900,
          marginBottom: "0.75rem"
        }}>
          Security Statement
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.8)",
          fontSize: "1rem",
          maxWidth: 520,
          margin: "0 auto",
          lineHeight: 1.7
        }}>
          B-Com Belize is committed to protecting your personal
          information and ensuring all transactions are secure.
        </p>
      </div>

      {/* COMPLIANCE BADGES */}
      <div style={{
        background: "#f0f7ff",
        borderBottom: "1px solid #dbeafe",
        padding: "1.25rem 2rem",
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        flexWrap: "wrap"
      }}>
        {[
          "🔒 SSL Encrypted",
          "🏦 Belize Bank Approved",
          "🏦 Atlantic Bank Approved",
          "✅ PCI DSS Compliant",
          "🛡️ 3D Secure Enabled",
          "🇧🇿 Governed by Belize Law"
        ].map(badge => (
          <span key={badge} style={{
            fontSize: "0.82rem",
            color: "#2563EB",
            fontWeight: 600
          }}>
            {badge}
          </span>
        ))}
      </div>

      {/* INTRO */}
      <div style={{
        maxWidth: 800,
        margin: "3rem auto",
        padding: "0 2rem",
        textAlign: "center"
      }}>
        <p style={{
          color: "#6b7280",
          fontSize: "1rem",
          lineHeight: 1.8
        }}>
          At B-Com Belize, the security of your personal and financial
          information is our top priority. We use industry-leading security
          measures to ensure that your data is protected at every step of
          your shopping experience.
        </p>
      </div>

      {/* SECURITY FEATURES */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 2rem 3rem"
      }}>
        {SECURITY_FEATURES.map(feature => (
          <div key={feature.title} style={{
            background: "white",
            borderRadius: 16,
            padding: "1.75rem",
            border: "1px solid var(--border)",
            transition: "all 0.2s"
          }}>
            <div style={{ marginBottom: "1rem" }}>
              {feature.icon}
            </div>
            <h3 style={{
              fontWeight: 700,
              fontSize: "1rem",
              marginBottom: "0.75rem",
              color: "var(--dark)"
            }}>
              {feature.title}
            </h3>
            <p style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              lineHeight: 1.7,
              margin: 0
            }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* PAYMENT SECURITY SECTION */}
      <div style={{
        background: "#f0f7ff",
        padding: "3rem 2rem"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.8rem",
            fontWeight: 900,
            marginBottom: "1.5rem",
            textAlign: "center"
          }}>
            Payment Security
          </h2>

          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "2rem",
            border: "1px solid #dbeafe",
            marginBottom: "1.5rem"
          }}>
            <h3 style={{
              fontWeight: 700,
              marginBottom: "1rem",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <HiOutlineShieldCheck size={20} />
              How Your Card Payment is Protected
            </h3>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}>
              {[
                "When you choose to pay by card, you are redirected to the secure hosted payment page of Belize Bank Limited or Atlantic Bank Limited.",
                "Your card details are entered directly on the bank's secure page — never on B-Com's website.",
                "B-Com never sees, stores or has access to your card number, CVV or expiry date at any time.",
                "All card transactions are protected by 3D Secure (Verified by Visa / Mastercard SecureCode).",
                "The bank processes your payment and notifies us only of the success or failure — never your card details.",
                "You are then automatically returned to B-Com with your order confirmation."
              ].map((point, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start"
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "#2563EB",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 2
                  }}>
                    {i + 1}
                  </div>
                  <p style={{
                    color: "#374151",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CARD BRANDS */}
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "1.5rem",
            border: "1px solid #dbeafe",
            textAlign: "center"
          }}>
            <p style={{
              color: "#6b7280",
              fontSize: "0.85rem",
              marginBottom: "1rem"
            }}>
              We accept the following cards through our secure banking partners
            </p>
            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              {[
                { name: "VISA", bg: "#1a1f71", color: "white" },
                { name: "MASTERCARD", bg: "#eb001b", color: "white" },
                { name: "INTERNATIONAL CARDS", bg: "#f0f7ff", color: "#2563EB" },
              ].map(card => (
                <div key={card.name} style={{
                  background: card.bg,
                  color: card.color,
                  padding: "8px 20px",
                  borderRadius: 8,
                  fontWeight: 900,
                  fontSize: "0.82rem",
                  letterSpacing: 1
                }}>
                  {card.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REPORTING */}
      <div style={{
        maxWidth: 800,
        margin: "3rem auto",
        padding: "0 2rem"
      }}>
        <div style={{
          background: "#fff8e1",
          border: "1px solid #f59e0b",
          borderRadius: 16,
          padding: "1.5rem 2rem"
        }}>
          <h3 style={{
            fontWeight: 700,
            marginBottom: "0.75rem",
            color: "#92400e",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            ⚠️ Report a Security Concern
          </h3>
          <p style={{
            color: "#92400e",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            marginBottom: "1rem"
          }}>
            If you suspect any unauthorized activity on your account or
            notice anything suspicious while shopping on B-Com Belize,
            please contact us immediately.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="mailto:hello@b-com.bz"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#f59e0b",
                color: "white",
                padding: "8px 18px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "0.85rem",
                textDecoration: "none"
              }}
            >
              📧 hello@b-com.bz
            </a>
            <a
              href="https://wa.me/501XXXXXXXX"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#25D366",
                color: "white",
                padding: "8px 18px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "0.85rem",
                textDecoration: "none",
            }}
            >
                WhatsApp
            </a>
          </div>
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
          Have questions about our security practices?
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
import {
  HiOutlineFlag,
  HiOutlineTruck,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineGlobe,
  HiOutlineRefresh
} from "react-icons/hi";
export default function AboutPage({ setPage }) {
  return (
    <div>

      {/* HERO */}
      <div className="about-hero">
        <h1 style={{
        fontFamily: "'Playfair Display',serif",
        fontSize: "clamp(1.8rem,4vw,2.8rem)", // slightly smaller
        fontWeight: 900,
      marginBottom: "0.5rem"
}}>
          About B-Com Belize
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: "1rem",
          maxWidth: 600,
          margin: "0 auto",
          lineHeight: 1.6
        }}>
          Belize's premier online fashion destination — connecting customers
          with the best local and global fashion brands.
        </p>
      </div>

      {/* STORY */}
      <div style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "4rem 2rem",
        textAlign: "center"
      }}>
        <h2 className="section-title" style={{ textAlign: "center" }}>Our Story</h2>
        <p style={{
          color: "var(--muted)",
          fontSize: "1.05rem",
          lineHeight: 1.8,
          marginBottom: "1.5rem"
        }}>
          B-Com was founded with a simple mission — to make fashion accessible
          to every Belizean, no matter which district they call home. We saw
          a gap in the market: Belizeans wanted access to quality clothing,
          shoes and accessories from both local makers and global brands like
          Amazon, Shein, Temu and Alibaba — but the process was complicated
          and unreliable.
        </p>
        <p style={{
          color: "var(--muted)",
          fontSize: "1.05rem",
          lineHeight: 1.8
        }}>
          B-Com bridges that gap. We curate the best products, handle the
          ordering process, and deliver nationwide — so you can shop with
          confidence from the comfort of your home.
        </p>
      </div>

      {/* VALUES */}
      <div className="about-grid">
        {[
            {
            emoji: <HiOutlineFlag size={32} color="#2563EB" />,
            title: "Proudly Belizean",
            desc: "Born and built in Belize. We understand what our customers need and we deliver."
          },
          {
            emoji: <HiOutlineTruck size={32} color="#2563EB" />,
            title: "Nationwide Delivery",
            desc: "We deliver to all 6 districts — Belize, Cayo, Corozal, Orange Walk, Stann Creek and Toledo."
          },
          {
            emoji: <HiOutlineLockClosed size={32} color="#2563EB" />,
            title: "Secure Payments",
            desc: "Pay safely with Belize Bank, Atlantic Bank, PayPal or cash on delivery."
          },
          {
            emoji: <HiOutlinePhone size={32} color="#2563EB" />,
            title: "Customer First",
            desc: "Our support team is always available via WhatsApp, email or our contact form."
          },
          {
            emoji: <HiOutlineGlobe size={32} color="#2563EB" />,
            title: "Global Access",
            desc: "We connect you with Amazon, Shein, Temu and Alibaba — all through one platform."
          },
          {
            emoji: <HiOutlineRefresh size={32} color="#2563EB" />,
            title: "Easy Returns",
            desc: "Not satisfied? We make returns and exchanges simple and stress-free."
          },
        ].map(v => (
          <div key={v.title} className="about-card">
            <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>{v.emoji}</div>
            <h3 style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              marginBottom: "0.5rem",
              color: "var(--dark)"
            }}>
              {v.title}
            </h3>
            <p style={{
              color: "var(--muted)",
              fontSize: "0.9rem",
              lineHeight: 1.6
            }}>
              {v.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        background: "var(--teal)",
        padding: "4rem 2rem",
        textAlign: "center"
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "2rem",
          color: "white",
          marginBottom: "1rem"
        }}>
          Ready to shop?
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.85)",
          marginBottom: "2rem",
          fontSize: "1rem"
        }}>
          Browse our featured collection or explore global stores.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            style={{
              background: "white",
              color: "var(--teal)",
              padding: "14px 32px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              border: "none"
            }}
            onClick={() => setPage("featured")}
          >
            Shop Now →
          </button>
          <button
            style={{
              background: "transparent",
              color: "white",
              padding: "14px 32px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              border: "1.5px solid rgba(255,255,255,0.5)"
            }}
            onClick={() => setPage("customer-service")}
          >
            Contact Us
          </button>
        </div>
      </div>

    </div>
  );
}
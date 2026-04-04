import {
  HiOutlineSearch,
  HiOutlineLink,
  HiOutlineClipboardList,
  HiOutlineTruck
} from "react-icons/hi";
import { EXTERNAL_STORES } from "../data/constants";

export default function OnlineStoresPage({ setPage }) {
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
          Online Stores
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: "1.1rem",
          maxWidth: 560,
          margin: "0 auto",
          lineHeight: 1.7
        }}>
          Browse these global stores, find what you want, then bring
          the product link to our Orders page and we'll handle the rest.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "3rem 2rem"
      }}>
        <h2 className="section-title" style={{ textAlign: "center" }}>
          How it Works
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem"
        }}>
          {[
            { step: "1", title: "Browse a Store", desc: "Visit any of the global stores below and find items you love", emoji: <HiOutlineSearch size={28} color="white" /> },
            { step: "2", title: "Copy the Link", desc: "Copy the product page URL from your browser", emoji: <HiOutlineLink size={28} color="white" /> },
            { step: "3", title: "Place Your Order", desc: "Go to our Orders page and paste the link with your details", emoji: <HiOutlineClipboardList size={28} color="white" /> },
            { step: "4", title: "We Deliver", desc: "We order for you and deliver nationwide across Belize", emoji: <HiOutlineTruck size={28} color="white" /> },
          ].map(s => (
            <div key={s.step} style={{
              textAlign: "center",
              padding: "1.5rem",
              background: "white",
              borderRadius: 16,
              border: "1px solid var(--border)"
            }}>
              <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem"
            }}>
              {s.emoji}
            </div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.95rem" }}>{s.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STORE CARDS */}
      <div className="stores-grid">
        {EXTERNAL_STORES.map(store => (
          <div key={store.name} className="store-card" style={{ borderTop: `4px solid ${store.color}` }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{store.emoji}</div>
            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.5rem",
              marginBottom: "0.5rem",
              color: store.color
            }}>
              {store.name}
            </h2>
            <p style={{
              color: "var(--muted)",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              marginBottom: "1rem"
            }}>
              {store.desc}
            </p>

            {/* TAGS */}
            <div style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "1.5rem"
            }}>
              {store.tags.map(tag => (
                <span key={tag} style={{
                  background: `${store.color}15`,
                  color: store.color,
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: "0.75rem",
                  fontWeight: 600
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href={store.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: store.color,
                  color: "white",
                  padding: "10px 24px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.9rem"
                }}
              >
                Browse {store.name} →
              </a>
              <button
                style={{
                  background: "transparent",
                  color: "var(--dark)",
                  padding: "10px 24px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  border: "1.5px solid var(--border)",
                  cursor: "pointer"
                }}
                onClick={() => setPage("orders")}
              >
                Place Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        background: "var(--dark)",
        padding: "3rem 2rem",
        textAlign: "center",
        marginTop: "3rem"
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "1.8rem",
          color: "white",
          marginBottom: "1rem"
        }}>
          Found something you like?
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.7)",
          marginBottom: "2rem",
          fontSize: "0.95rem"
        }}>
          Copy the product link and head to our Orders page to place your order.
        </p>
        <button
          style={{
            background: "var(--teal)",
            color: "white",
            padding: "14px 32px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            border: "none"
          }}
          onClick={() => setPage("orders")}
        >
          Go to Orders →
        </button>
      </div>

    </div>
  );
}
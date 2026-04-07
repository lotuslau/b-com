import { DELIVERY_POLICY, COMPANY_INFO } from "../data/policies";
import {
  HiOutlineTruck,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineCheckCircle
} from "react-icons/hi";

export default function DeliveryPolicyPage({ setPage }) {
  const DELIVER_TO = [
    { name: "Belize City", time: "1-2 business days", note: "Main delivery area" },
    { name: "Ladyville", time: "1-2 business days", note: "Adjacent to Belize City" },
    { name: "Sandhill", time: "1-2 business days", note: "Nearby residential area" },
    
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
          <HiOutlineTruck size={48} color="rgba(255,255,255,0.8)" />
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(2rem,5vw,3rem)",
          fontWeight: 900,
          marginBottom: "0.75rem"
        }}>
          Delivery Policy
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: "0.95rem",
          maxWidth: 480,
          margin: "0 auto 1rem",
          lineHeight: 1.7
        }}>
          We currently deliver to Belize City, Ladyville, Sandhill and surrounding areas ONLY.
        </p>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,0.15)",
          padding: "6px 16px",
          borderRadius: 20,
          color: "white",
          fontSize: "0.85rem",
          fontWeight: 600
        }}>
          <HiOutlineLocationMarker size={16} />
          Merchant Location: Belize City, Belize, Central America
        </div>
      </div>

      {/* DELIVERY FEES STRIP */}
      <div style={{
        background: "#f0f7ff",
        borderBottom: "1px solid #dbeafe",
        padding: "1.5rem 2rem"
      }}>
        <div style={{
          maxWidth: 860,
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          gap: "3rem",
          flexWrap: "wrap",
          textAlign: "center"
        }}>
          <div>
            <div style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#2563EB"
            }}>
              FREE
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              Orders over BZ$ XXX
            </div>
          </div>
          <div style={{
            width: 1,
            background: "#dbeafe"
          }} />
          <div>
            <div style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--dark)"
            }}>
              BZ$ XXX
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              Orders under BZ$ XXX
            </div>
          </div>
          <div style={{
            width: 1,
            background: "#dbeafe"
          }} />
          <div>
            <div style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--dark)"
            }}>
              1-5 Days
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              Nationwide delivery
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "3rem 2rem"
      }}>

        {/* DELIVER_TO TABLE */}
        <h2 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "1.5rem",
          marginBottom: "1.5rem"
        }}>
          Delivery Locations
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          marginBottom: "3rem"
        }}>
          {DELIVER_TO.map(d => (
            <div key={d.name} style={{
              background: "white",
              borderRadius: 12,
              padding: "1.25rem",
              border: "1px solid var(--border)",
              display: "flex",
              gap: 12,
              alignItems: "flex-start"
            }}>
              <HiOutlineLocationMarker
                size={20}
                color="#2563EB"
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>
                  {d.name}
                </div>
                <div style={{
                  color: "#2563EB",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: 2
                }}>
                  <HiOutlineClock
                    size={12}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  {d.time}
                </div>
                <div style={{
                  color: "var(--muted)",
                  fontSize: "0.78rem"
                }}>
                  {d.note}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* POLICY SECTIONS */}
        {DELIVERY_POLICY.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: "1.5rem" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "0.5rem"
            }}>
              <HiOutlineCheckCircle size={18} color="#2563EB" />
              <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>
                {section.title}
              </h3>
            </div>
            <p style={{
              color: "var(--muted)",
              lineHeight: 1.8,
              fontSize: "0.92rem",
              paddingLeft: 26
            }}>
              {section.content}
            </p>
          </div>
        ))}

        {/* ORDER TRACKING */}
        <div style={{
          background: "#f0f7ff",
          border: "1px solid #dbeafe",
          borderRadius: 12,
          padding: "1.5rem",
          marginTop: "2rem",
          textAlign: "center"
        }}>
          <HiOutlineTruck size={32} color="#2563EB" style={{ margin: "0 auto 0.75rem" }} />
          <h3 style={{ marginBottom: "0.5rem" }}>Track Your Order</h3>
          <p style={{
            color: "var(--muted)",
            fontSize: "0.85rem",
            marginBottom: "1rem"
          }}>
            Have your order reference number ready and contact us via WhatsApp for real-time updates.
          </p>
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
              padding: "10px 24px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "0.9rem"
            }}
          >
            Track via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
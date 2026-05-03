import { useState, useEffect } from "react";
import {
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker
} from "react-icons/hi";
import { getAdminCustomers } from "../../services/adminApi";

export default function AdminCustomers({ showNotification }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAdminCustomers();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c =>
    !searchQuery ||
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery)
  );

  return (
    <div>
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.5rem"
        }}>
          Manage Customers
          <span style={{
            marginLeft: 10,
            background: "#f0f7ff",
            color: "#2563EB",
            padding: "2px 12px",
            borderRadius: 20,
            fontSize: "0.8rem",
            fontWeight: 600
          }}>
            {customers.length} total
          </span>
        </h2>
        <div style={{ position: "relative" }}>
          <HiOutlineSearch
            size={16}
            color="var(--muted)"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)"
            }}
          />
          <input
            style={{
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "8px 12px 8px 32px",
              fontSize: "0.85rem",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              width: 240
            }}
            placeholder="Search customers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading customers...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
          <HiOutlineUser size={48} color="var(--border)" style={{ margin: "0 auto 1rem" }} />
          <p>No customers found</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem"
        }}>
          {filtered.map(customer => (
            <div key={customer.id} style={{
              background: "white",
              borderRadius: 16,
              padding: "1.25rem",
              border: "1px solid var(--border)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: "1rem"
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#f0f7ff",
                  color: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "1rem",
                  flexShrink: 0
                }}>
                  {customer.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    {customer.name || "No name"}
                  </div>
                  <div style={{
                    color: "var(--muted)",
                    fontSize: "0.75rem"
                  }}>
                    Joined {new Date(customer.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 6
              }}>
                {[
                  { icon: <HiOutlineMail size={14} />, value: customer.email },
                  { icon: <HiOutlinePhone size={14} />, value: customer.phone || "No phone" },
                  { icon: <HiOutlineLocationMarker size={14} />, value: customer.district || "No district" },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.82rem",
                    color: "var(--muted)"
                  }}>
                    {item.icon}
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: "1rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{
                  fontSize: "0.78rem",
                  color: "var(--muted)"
                }}>
                  {customer.address || "No address saved"}
                </span>
                
                  href={`https://wa.me/${customer.phone?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#25D366",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: 8,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                <a>
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
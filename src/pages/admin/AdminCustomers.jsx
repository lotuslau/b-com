import { useState, useEffect } from "react";
import {
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineRefresh
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { getAdminCustomers } from "../../services/adminApi";

export default function AdminCustomers({ showNotification }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [activeSection, setActiveSection] = useState("customers");
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);

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

  const fetchSubscribers = async () => {
    try {
      setLoadingSubscribers(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/newsletter/subscribers`,
        {
          headers: {
            "x-admin-key": import.meta.env.VITE_ADMIN_KEY
          }
        }
      );
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const handleUnsubscribe = async (id) => {
    if (!window.confirm("Remove this subscriber?")) return;
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/newsletter/unsubscribe/${id}`,
        {
          method: "PUT",
          headers: {
            "x-admin-key": import.meta.env.VITE_ADMIN_KEY
          }
        }
      );
      fetchSubscribers();
      showNotification("Subscriber removed");
    } catch (err) {
      showNotification("Error removing subscriber", "error");
    }
  };

  const copyAllEmails = () => {
    const emails = subscribers
      .filter(s => s.subscribed)
      .map(s => s.email)
      .join(", ");
    navigator.clipboard.writeText(emails);
    showNotification("✅ Email list copied to clipboard!");
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
          {activeSection === "customers" ? "Customers" : "Newsletter Subscribers"}
        </h2>

        {activeSection === "customers" && (
          <div style={{ display: "flex", gap: 8 }}>
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
            <button
              style={{
                background: "#f9f9f9",
                border: "1.5px solid var(--border)",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: "0.85rem",
                fontFamily: "'DM Sans', sans-serif"
              }}
              onClick={fetchCustomers}
            >
              <HiOutlineRefresh size={16} />
            </button>
          </div>
        )}

        {activeSection === "newsletter" && (
          <button
            style={{
              background: "#f0f7ff",
              border: "1px solid #dbeafe",
              borderRadius: 8,
              padding: "8px 16px",
              color: "#2563EB",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif"
            }}
            onClick={copyAllEmails}
          >
            📋 Copy All Emails ({subscribers.filter(s => s.subscribed).length})
          </button>
        )}
      </div>

      {/* SECTION TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {[
          { id: "customers", label: `👥 Customers (${customers.length})` },
          { id: "newsletter", label: `📧 Newsletter (${subscribers.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "1.5px solid",
              borderColor: activeSection === tab.id ? "#2563EB" : "var(--border)",
              background: activeSection === tab.id ? "#f0f7ff" : "white",
              color: activeSection === tab.id ? "#2563EB" : "var(--muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s"
            }}
            onClick={() => {
              setActiveSection(tab.id);
              if (tab.id === "newsletter" && subscribers.length === 0) {
                fetchSubscribers();
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── CUSTOMERS SECTION ── */}
      {activeSection === "customers" && (
        <>
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
              Loading customers...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
              <HiOutlineUser size={48} color="var(--border)" style={{ margin: "0 auto 1rem" }} />
              <p>{searchQuery ? "No customers match your search" : "No customers yet"}</p>
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
                  {/* CUSTOMER AVATAR + NAME */}
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
                      <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                        Joined {new Date(customer.created_at).toLocaleDateString("en-BZ", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </div>
                    </div>
                  </div>

                  {/* CUSTOMER DETAILS */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginBottom: "1rem"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.82rem",
                      color: "var(--muted)"
                    }}>
                      <HiOutlineMail size={14} color="#2563EB" />
                      <span>{customer.email || "No email"}</span>
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.82rem",
                      color: "var(--muted)"
                    }}>
                      <HiOutlinePhone size={14} color="#2563EB" />
                      <span>{customer.phone || "No phone"}</span>
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.82rem",
                      color: "var(--muted)"
                    }}>
                      <HiOutlineLocationMarker size={14} color="#2563EB" />
                      <span>{customer.district || "No district"}</span>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  {customer.address && (
                    <div style={{
                      fontSize: "0.78rem",
                      color: "var(--muted)",
                      background: "#f9f9f9",
                      borderRadius: 8,
                      padding: "6px 10px",
                      marginBottom: "0.75rem"
                    }}>
                      📍 {customer.address}
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div style={{
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    gap: 6
                  }}>
                    <a
                      href={`mailto:${customer.email}`}
                      style={{
                        flex: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        background: "#f0f7ff",
                        color: "#2563EB",
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        textDecoration: "none"
                      }}
                    >
                      <HiOutlineMail size={13} />
                      Email
                    </a>
                    {customer.phone && (
                      <a
                        href={`https://wa.me/501${customer.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          flex: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          background: "#f0fdf4",
                          color: "#16a34a",
                          padding: "6px 12px",
                          borderRadius: 8,
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          textDecoration: "none"
                        }}
                      >
                        <FaWhatsapp size={13} />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── NEWSLETTER SECTION ── */}
      {activeSection === "newsletter" && (
        <div>
          {loadingSubscribers ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
              Loading subscribers...
            </div>
          ) : subscribers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
              <HiOutlineMail size={48} color="var(--border)" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ marginBottom: "0.5rem" }}>No subscribers yet</h3>
              <p style={{ fontSize: "0.9rem" }}>
                Subscribers will appear here when customers sign up on the homepage
              </p>
            </div>
          ) : (
            <>
              {/* STATS */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem"
              }}>
                {[
                  {
                    label: "Total Subscribers",
                    value: subscribers.length,
                    color: "#2563EB",
                    bg: "#f0f7ff"
                  },
                  {
                    label: "Active",
                    value: subscribers.filter(s => s.subscribed).length,
                    color: "#22c55e",
                    bg: "#f0fdf4"
                  },
                  {
                    label: "Unsubscribed",
                    value: subscribers.filter(s => !s.subscribed).length,
                    color: "#e05c6a",
                    bg: "#fff0f2"
                  },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: stat.bg,
                    borderRadius: 12,
                    padding: "1rem",
                    border: "1px solid var(--border)",
                    textAlign: "center"
                  }}>
                    <div style={{
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      color: stat.color
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: "0.78rem",
                      color: "var(--muted)",
                      fontWeight: 600
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* TABLE */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Name", "Email", "Status", "Date Subscribed", "Action"].map(h => (
                        <th key={h} style={{
                          textAlign: "left",
                          padding: "8px 12px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          color: "var(--muted)",
                          borderBottom: "2px solid var(--border)"
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map(sub => (
                      <tr key={sub.id} style={{
                        borderBottom: "1px solid var(--border)",
                        opacity: sub.subscribed ? 1 : 0.5
                      }}>
                        <td style={{ padding: "10px 12px", fontSize: "0.85rem" }}>
                          {sub.name || "—"}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <a
                            href={`mailto:${sub.email}`}
                            style={{
                              color: "#2563EB",
                              fontSize: "0.85rem",
                              textDecoration: "none"
                            }}>
                            {sub.email}
                          </a>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{
                            background: sub.subscribed ? "#f0fdf4" : "#fff0f2",
                            color: sub.subscribed ? "#22c55e" : "#e05c6a",
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: "0.72rem",
                            fontWeight: 700
                          }}>
                            {sub.subscribed ? "✅ Active" : "❌ Unsubscribed"}
                          </span>
                        </td>
                        <td style={{
                          padding: "10px 12px",
                          fontSize: "0.78rem",
                          color: "var(--muted)"
                        }}>
                          {new Date(sub.created_at).toLocaleDateString("en-BZ", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <a
                              href={`mailto:${sub.email}`}
                              style={{
                                background: "#f0f7ff",
                                color: "#2563EB",
                                border: "none",
                                borderRadius: 6,
                                padding: "5px 10px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4
                              }}>
                              <HiOutlineMail size={12} />
                              Email
                            </a>
                            {sub.subscribed && (
                              <button
                                style={{
                                  background: "#fff0f2",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "5px 10px",
                                  color: "#e05c6a",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontWeight: 600
                                }}
                                onClick={() => handleUnsubscribe(sub.id)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
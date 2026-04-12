import { useState, useEffect } from "react";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineLocationMarker,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronRight,
  HiOutlinePhone,
  HiOutlineMail
} from "react-icons/hi";

export default function AccountPage({ customer, setCustomer, setPage, wishlist, cart, showNotification }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    district: customer?.district || "Belize City"
  });

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const token = localStorage.getItem("bcom_token");
      const res = await fetch(`http://localhost:3001/api/orders/customer`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bcom_token");
    localStorage.removeItem("bcom_customer");
    setCustomer(null);
    showNotification("Logged out successfully");
    setPage("home");
  };

  const STATUS_COLORS = {
    pending: "#f59e0b",
    paid: "#2563EB",
    processing: "#8b5cf6",
    shipped: "#06b6d4",
    delivered: "#22c55e",
    cancelled: "#e05c6a",
    refunded: "#6b7280"
  };

  const TABS = [
    { id: "profile", label: "Profile", icon: <HiOutlineUser size={18} /> },
    { id: "orders", label: "My Orders", icon: <HiOutlineShoppingBag size={18} /> },
    { id: "wishlist", label: "Wishlist", icon: <HiOutlineHeart size={18} /> },
    { id: "settings", label: "Settings", icon: <HiOutlineCog size={18} /> },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #2563EB 0%, #1a4fa0 100%)",
        borderRadius: 20,
        padding: "2rem",
        marginBottom: "2rem",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            fontWeight: 700,
            border: "2px solid rgba(255,255,255,0.4)"
          }}>
            {customer?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.6rem",
              marginBottom: "0.25rem"
            }}>
              {customer?.name}
            </h1>
            <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
              {customer?.email}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 10,
            padding: "8px 16px",
            textAlign: "center"
          }}>
            <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{orders.length}</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Orders</div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 10,
            padding: "8px 16px",
            textAlign: "center"
          }}>
            <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{wishlist.length}</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Wishlist</div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 10,
            padding: "8px 16px",
            textAlign: "center"
          }}>
            <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{cart.length}</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Cart</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem" }}>

        {/* SIDEBAR */}
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: "1rem",
          border: "1px solid var(--border)",
          height: "fit-content",
          position: "sticky",
          top: 80
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: activeTab === tab.id ? "#f0f7ff" : "transparent",
                color: activeTab === tab.id ? "#2563EB" : "var(--dark)",
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: "0.9rem",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: 4,
                transition: "all 0.2s"
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {tab.icon} {tab.label}
              </span>
              <HiOutlineChevronRight size={16} />
            </button>
          ))}

          <div style={{
            borderTop: "1px solid var(--border)",
            marginTop: "0.75rem",
            paddingTop: "0.75rem"
          }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "transparent",
                color: "#e05c6a",
                fontWeight: 500,
                fontSize: "0.9rem",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              <HiOutlineLogout size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div>

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "1.5rem",
              border: "1px solid var(--border)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.3rem"
                }}>
                  My Profile
                </h2>
                <button
                  style={{
                    background: editMode ? "var(--dark)" : "#f0f7ff",
                    color: editMode ? "white" : "#2563EB",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 16px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem"
              }}>
                {[
                  { label: "Full Name", value: customer?.name, icon: <HiOutlineUser size={16} /> },
                  { label: "Email", value: customer?.email, icon: <HiOutlineMail size={16} /> },
                  { label: "Phone", value: customer?.phone || "Not set", icon: <HiOutlinePhone size={16} /> },
                  { label: "District", value: customer?.district || "Not set", icon: <HiOutlineLocationMarker size={16} /> },
                ].map(item => (
                  <div key={item.label} style={{
                    background: "#f9f9f9",
                    borderRadius: 10,
                    padding: "1rem"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "var(--muted)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      marginBottom: 6
                    }}>
                      {item.icon} {item.label}
                    </div>
                    <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: "1rem",
                background: "#f9f9f9",
                borderRadius: 10,
                padding: "1rem"
              }}>
                <div style={{
                  color: "var(--muted)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <HiOutlineLocationMarker size={16} /> Delivery Address
                </div>
                <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>
                  {customer?.address || "Not set"}
                </div>
              </div>

              {editMode && (
                <div style={{ marginTop: "1.5rem" }}>
                  <h3 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.95rem" }}>
                    Update Profile
                  </h3>
                  {[
                    ["Full Name", "name", "text"],
                    ["Phone", "phone", "tel"],
                    ["Address", "address", "text"],
                  ].map(([label, field, type]) => (
                    <div key={field} className="form-group">
                      <label className="form-label">{label}</label>
                      <input
                        className="form-input"
                        type={type}
                        value={form[field]}
                        onChange={e => setForm({ ...form, [field]: e.target.value })}
                      />
                    </div>
                  ))}
                  <button
                    className="btn-primary"
                    onClick={() => {
                      showNotification("Profile updated! ✅");
                      setEditMode(false);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "1.5rem",
              border: "1px solid var(--border)"
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.3rem",
                marginBottom: "1.5rem"
              }}>
                My Orders
              </h2>

              {loadingOrders ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <HiOutlineShoppingBag size={48} color="var(--border)" style={{ margin: "0 auto 1rem" }} />
                  <h3 style={{ marginBottom: "0.5rem" }}>No orders yet</h3>
                  <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                    Start shopping and your orders will appear here
                  </p>
                  <button className="btn-primary" onClick={() => setPage("featured")}>
                    Browse Products →
                  </button>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} style={{
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "1rem",
                    marginBottom: "1rem"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 8
                    }}>
                      <div>
                        <div style={{
                          fontWeight: 700,
                          fontFamily: "monospace",
                          color: "#2563EB",
                          marginBottom: 4
                        }}>
                          {order.payment_ref}
                        </div>
                        <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                          {new Date(order.created_at).toLocaleDateString("en-BZ", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 4 }}>
                          BZ$ {parseFloat(order.total_bzd || 0).toFixed(2)}
                        </div>
                        <span style={{
                          background: STATUS_COLORS[order.status] + "22",
                          color: STATUS_COLORS[order.status],
                          padding: "3px 12px",
                          borderRadius: 20,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "capitalize"
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      marginTop: "0.75rem",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.82rem",
                      color: "var(--muted)"
                    }}>
                      <span>Payment: {order.payment_method?.replace(/_/g, " ")}</span>
                      <button
                        style={{
                          background: "#f0f7ff",
                          border: "none",
                          borderRadius: 8,
                          padding: "4px 12px",
                          color: "#2563EB",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600
                        }}
                        onClick={() => showNotification(`Contact us via WhatsApp with reference ${order.payment_ref} for order details`)}
                      >
                        Track Order →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "1.5rem",
              border: "1px solid var(--border)"
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.3rem",
                marginBottom: "1rem"
              }}>
                My Wishlist
              </h2>
              <p style={{ color: "var(--muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
              </p>
              <button
                className="btn-primary"
                onClick={() => setPage("wishlist")}
              >
                View Full Wishlist →
              </button>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "1.5rem",
              border: "1px solid var(--border)"
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.3rem",
                marginBottom: "1.5rem"
              }}>
                Account Settings
              </h2>

              {[
                { title: "Email Notifications", desc: "Receive order updates via email", enabled: true },
                { title: "WhatsApp Updates", desc: "Receive order updates via WhatsApp", enabled: true },
                { title: "Promotional Emails", desc: "Receive deals and new arrivals", enabled: false },
              ].map(setting => (
                <div key={setting.title} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 0",
                  borderBottom: "1px solid var(--border)"
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{setting.title}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{setting.desc}</div>
                  </div>
                  <div style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: setting.enabled ? "#2563EB" : "#ddd",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}>
                    <div style={{
                      position: "absolute",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "white",
                      top: 2,
                      left: setting.enabled ? 22 : 2,
                      transition: "all 0.2s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
                    }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: "1.5rem" }}>
                <button
                  style={{
                    background: "#fff0f2",
                    color: "#e05c6a",
                    border: "1.5px solid #e05c6a",
                    borderRadius: 10,
                    padding: "10px 20px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                  onClick={() => showNotification("Contact us via WhatsApp to delete your account", "info")}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
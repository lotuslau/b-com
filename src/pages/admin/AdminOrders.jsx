import { useState, useEffect } from "react";
import { HiOutlineSearch, HiOutlineRefresh } from "react-icons/hi";
import { getAdminOrders, updateOrderStatus } from "../../services/adminApi";

export default function AdminOrders({ showNotification }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const STATUS_COLORS = {
    pending: "#f59e0b",
    confirmed: "#2563EB",
    preparing: "#8b5cf6",
    out_for_delivery: "#06b6d4",
    delivered: "#22c55e",
    cancelled: "#e05c6a",
  };

  const STATUSES = ["all", "pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
      showNotification(`Order status updated to ${newStatus}`);
    } catch (err) {
      showNotification("Error updating order", "error");
    }
  };

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch = !searchQuery ||
      o.payment_ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

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
          Manage Orders
        </h2>
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
                width: 220
              }}
              placeholder="Search by ref or customer..."
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
            onClick={fetchOrders}
          >
            <HiOutlineRefresh size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* STATUS FILTER */}
      <div style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: "1.5rem"
      }}>
        {STATUSES.map(s => (
          <button
            key={s}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              border: "1.5px solid",
              borderColor: filterStatus === s
                ? (STATUS_COLORS[s] || "#2563EB")
                : "var(--border)",
              background: filterStatus === s
                ? ((STATUS_COLORS[s] || "#2563EB") + "22")
                : "white",
              color: filterStatus === s
                ? (STATUS_COLORS[s] || "#2563EB")
                : "var(--muted)",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "capitalize"
            }}
            onClick={() => setFilterStatus(s)}
          >
            {s === "all" ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* ORDERS TABLE */}
      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading orders...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
          <p>No orders found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map(order => (
            <div key={order.id} style={{
              background: "white",
              borderRadius: 12,
              padding: "1.25rem",
              border: "1px solid var(--border)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: "0.75rem"
              }}>
                <div>
                  <div style={{
                    fontFamily: "monospace",
                    color: "#2563EB",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    marginBottom: 4
                  }}>
                    {order.payment_ref}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                    {order.customer_name || "Guest"} · {order.email} · {order.phone}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 2 }}>
                    {order.shipping_address}, {order.district}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    marginBottom: 4
                  }}>
                    BZ$ {parseFloat(order.total_bzd || 0).toFixed(2)}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--border)",
                flexWrap: "wrap",
                gap: 8
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                    {order.payment_method?.replace(/_/g, " ")}
                  </span>
                  <span style={{
                    background: (STATUS_COLORS[order.status] || "#gray") + "22",
                    color: STATUS_COLORS[order.status] || "var(--muted)",
                    padding: "3px 12px",
                    borderRadius: 20,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "capitalize"
                  }}>
                    {order.status}
                  </span>
                </div>

                {/* STATUS UPDATE */}
                
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    whiteSpace: "nowrap"
                  }}>
                    Update Status:
                  </span>
                  <select
                    style={{
                      border: `2px solid ${STATUS_COLORS[order.status] || "#ddd"}`,
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontSize: "0.82rem",
                      fontFamily: "'DM Sans', sans-serif",
                      background: "white",
                      cursor: "pointer",
                      outline: "none",
                      fontWeight: 600,
                      color: STATUS_COLORS[order.status] || "var(--dark)"
                    }}
                    value={order.status}
                    onChange={e => handleStatusUpdate(order.id, e.target.value)}
                  >
                    {[
                      { value: "pending", label: "⏳ Pending" },
                      { value: "confirmed", label: "✅ Confirmed" },
                      { value: "preparing", label: "📦 Preparing" },
                      { value: "out_for_delivery", label: "🚚 Out for Delivery" },
                      { value: "delivered", label: "🏠 Delivered" },
                      { value: "cancelled", label: "❌ Cancelled" },
                    ].map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

             <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "0.75rem",
                flexWrap: "wrap",
                gap: 8
              }}>
                {order.notes && (
                  <div style={{
                    background: "#f9f9f9",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: "0.82rem",
                    color: "var(--muted)",
                    flex: 1
                  }}>
                    📝 {order.notes}
                  </div>
                )}

                {/* TRACKING PREVIEW */}
                <div style={{
                  display: "flex",
                  gap: 6,
                  marginLeft: "auto"
                }}>
                  <a
                    href={`https://wa.me/?text=Hi! Your B-Com order ${order.payment_ref} status has been updated to: ${order.status?.replace(/_/g, ' ').toUpperCase()}. Track your order at b-com.bz`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      background: "#25D366",
                      color: "white",
                      padding: "5px 12px",
                      borderRadius: 8,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textDecoration: "none"
                    }}
                  >
                    💬 Notify Customer
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
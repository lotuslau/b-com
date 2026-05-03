import { useState, useEffect } from "react";
import {
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineTrendingUp,
  HiOutlineExclamationCircle
} from "react-icons/hi";
import { getAdminStats, getAdminOrders } from "../../services/adminApi";

export default function AdminOverview({ showNotification }) {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getAdminStats();
    setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const data = await getAdminOrders();
    setRecentOrders(data.orders?.slice(0, 5) || []);
    } catch (err) {
      console.error(err);
    }
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

  const STAT_CARDS = [
    {
      label: "Total Revenue",
      value: loading ? "..." : `BZ$ ${parseFloat(stats?.total_revenue || 0).toFixed(2)}`,
      icon: <HiOutlineCurrencyDollar size={24} color="#2563EB" />,
      bg: "#f0f7ff",
      trend: "+12% this month"
    },
    {
      label: "Total Orders",
      value: loading ? "..." : stats?.total_orders || 0,
      icon: <HiOutlineClipboardList size={24} color="#8b5cf6" />,
      bg: "#f5f3ff",
      trend: "All time"
    },
    {
      label: "Customers",
      value: loading ? "..." : stats?.total_customers || 0,
      icon: <HiOutlineUsers size={24} color="#22c55e" />,
      bg: "#f0fdf4",
      trend: "Registered"
    },
    {
      label: "Products",
      value: loading ? "..." : stats?.total_products || 0,
      icon: <HiOutlineShoppingBag size={24} color="#f59e0b" />,
      bg: "#fffbeb",
      trend: "Active listings"
    },
  ];

  return (
    <div>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.5rem",
        marginBottom: "1.5rem"
      }}>
        Dashboard Overview
      </h2>

      {/* STAT CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        {STAT_CARDS.map(card => (
          <div key={card.label} style={{
            background: card.bg,
            borderRadius: 16,
            padding: "1.25rem",
            border: "1px solid var(--border)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "0.75rem"
            }}>
              <div style={{
                background: "white",
                borderRadius: 10,
                padding: 8
              }}>
                {card.icon}
              </div>
              <HiOutlineTrendingUp size={16} color="var(--muted)" />
            </div>
            <div style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "var(--dark)",
              marginBottom: 4
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: "0.82rem",
              color: "var(--muted)",
              fontWeight: 600
            }}>
              {card.label}
            </div>
            <div style={{
              fontSize: "0.75rem",
              color: "var(--muted)",
              marginTop: 4
            }}>
              {card.trend}
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "1.5rem",
        border: "1px solid var(--border)",
        marginBottom: "1.5rem"
      }}>
        <h3 style={{
          fontWeight: 700,
          marginBottom: "1rem",
          fontSize: "1rem"
        }}>
          Recent Orders
        </h3>
        {recentOrders.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            No orders yet
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Reference", "Customer", "Total", "Payment", "Status", "Date"].map(h => (
                    <th key={h} style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: "var(--muted)",
                      borderBottom: "1px solid var(--border)"
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "#2563EB", fontSize: "0.85rem" }}>
                      {order.payment_ref}
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: "0.85rem" }}>
                      {order.customer_name || "Guest"}
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 700, fontSize: "0.85rem" }}>
                      BZ$ {parseFloat(order.total_bzd || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "var(--muted)" }}>
                      {order.payment_method?.replace(/_/g, " ")}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        background: (STATUS_COLORS[order.status] || "#gray") + "22",
                        color: STATUS_COLORS[order.status] || "var(--muted)",
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "capitalize"
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "var(--muted)" }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAYMENT BREAKDOWN */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "1.5rem",
        border: "1px solid var(--border)"
      }}>
        <h3 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "1rem" }}>
          Payment Methods Breakdown
        </h3>
        {[
          { method: "Belize Bank Card", pct: 42, color: "#2563EB" },
          { method: "Atlantic Bank Card", pct: 28, color: "#8b5cf6" },
          { method: "Online Transfer", pct: 18, color: "#06b6d4" },
          { method: "PayPal", pct: 8, color: "#f59e0b" },
          { method: "Cash on Delivery", pct: 4, color: "var(--muted)" },
        ].map(p => (
          <div key={p.method} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: "0.75rem"
          }}>
            <span style={{
              width: 160,
              fontSize: "0.82rem",
              color: "var(--muted)",
              flexShrink: 0
            }}>
              {p.method}
            </span>
            <div style={{
              flex: 1,
              height: 8,
              background: "var(--border)",
              borderRadius: 4,
              overflow: "hidden"
            }}>
              <div style={{
                width: `${p.pct}%`,
                height: "100%",
                background: p.color,
                borderRadius: 4,
                transition: "width 0.5s"
              }} />
            </div>
            <span style={{
              width: 35,
              fontSize: "0.82rem",
              fontWeight: 600,
              textAlign: "right"
            }}>
              {p.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
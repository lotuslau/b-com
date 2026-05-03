import { useState, useEffect } from "react";
import { HiOutlineSearch, HiOutlineRefresh } from "react-icons/hi";
import { getAdminPayments } from "../../services/adminApi";

export default function AdminPayments({ showNotification }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const STATUS_COLORS = {
    pending: "#f59e0b",
    success: "#22c55e",
    failed: "#e05c6a",
    refunded: "#6b7280"
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getAdminPayments();
      setPayments(data.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter(p => {
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchSearch = !searchQuery ||
      p.transaction_ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.gateway?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = payments
    .filter(p => p.status === "success")
    .reduce((sum, p) => sum + parseFloat(p.amount_bzd || 0), 0);

  const pendingRevenue = payments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + parseFloat(p.amount_bzd || 0), 0);

  return (
    <div>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.5rem",
        marginBottom: "1.5rem"
      }}>
        Payment Records
      </h2>

      {/* SUMMARY CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        marginBottom: "1.5rem"
      }}>
        {[
          { label: "Total Collected", value: `BZ$ ${totalRevenue.toFixed(2)}`, color: "#22c55e", bg: "#f0fdf4" },
          { label: "Pending Payments", value: `BZ$ ${pendingRevenue.toFixed(2)}`, color: "#f59e0b", bg: "#fffbeb" },
          { label: "Total Transactions", value: payments.length, color: "#2563EB", bg: "#f0f7ff" },
          { label: "Success Rate", value: payments.length > 0 ? `${Math.round((payments.filter(p => p.status === "success").length / payments.length) * 100)}%` : "0%", color: "#8b5cf6", bg: "#f5f3ff" },
        ].map(card => (
          <div key={card.label} style={{
            background: card.bg,
            borderRadius: 12,
            padding: "1rem",
            border: "1px solid var(--border)"
          }}>
            <div style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: card.color,
              marginBottom: 4
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: "0.78rem",
              color: "var(--muted)",
              fontWeight: 600
            }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.25rem",
        flexWrap: "wrap",
        gap: 8
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "pending", "success", "failed", "refunded"].map(s => (
            <button
              key={s}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: "1.5px solid",
                borderColor: filterStatus === s ? (STATUS_COLORS[s] || "#2563EB") : "var(--border)",
                background: filterStatus === s ? ((STATUS_COLORS[s] || "#2563EB") + "22") : "white",
                color: filterStatus === s ? (STATUS_COLORS[s] || "#2563EB") : "var(--muted)",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "capitalize"
              }}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
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
                padding: "7px 12px 7px 32px",
                fontSize: "0.82rem",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                width: 200
              }}
              placeholder="Search reference..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            style={{
              background: "#f9f9f9",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "7px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.82rem",
              fontFamily: "'DM Sans', sans-serif"
            }}
            onClick={fetchPayments}
          >
            <HiOutlineRefresh size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading payments...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
          <p>No payments found</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Reference", "Gateway", "Amount", "Currency", "Status", "Date"].map(h => (
                  <th key={h} style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "var(--muted)",
                    borderBottom: "2px solid var(--border)",
                    whiteSpace: "nowrap"
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(payment => (
                <tr key={payment.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{
                    padding: "10px 12px",
                    fontFamily: "monospace",
                    color: "#2563EB",
                    fontSize: "0.85rem"
                  }}>
                    {payment.transaction_ref}
                  </td>
                  <td style={{
                    padding: "10px 12px",
                    fontSize: "0.85rem",
                    textTransform: "capitalize"
                  }}>
                    {payment.gateway?.replace(/_/g, " ")}
                  </td>
                  <td style={{
                    padding: "10px 12px",
                    fontWeight: 700,
                    fontSize: "0.9rem"
                  }}>
                    BZ$ {parseFloat(payment.amount_bzd || 0).toFixed(2)}
                  </td>
                  <td style={{
                    padding: "10px 12px",
                    fontSize: "0.85rem",
                    color: "var(--muted)"
                  }}>
                    {payment.currency || "BZD"}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      background: (STATUS_COLORS[payment.status] || "#gray") + "22",
                      color: STATUS_COLORS[payment.status] || "var(--muted)",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "capitalize"
                    }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={{
                    padding: "10px 12px",
                    fontSize: "0.82rem",
                    color: "var(--muted)"
                  }}>
                    {new Date(payment.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
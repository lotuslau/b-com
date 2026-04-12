import { useState } from "react";
import {
  HiOutlineChartBar,
  HiOutlineShoppingBag,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineStar,
  HiOutlineCreditCard,
  HiOutlineLockClosed,
  HiOutlineChevronRight
} from "react-icons/hi";
import AdminOverview from "./admin/AdminOverview";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminCustomers from "./admin/AdminCustomers";
import AdminReviews from "./admin/AdminReviews";
import AdminPayments from "./admin/AdminPayments";

const ADMIN_PASSWORD = "bcom-admin-2025";

export default function AdminPage({ showNotification }) {
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("bcom_admin") === "true"
  );
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("bcom_admin", "true");
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const TABS = [
    { id: "overview", label: "Overview", icon: <HiOutlineChartBar size={18} /> },
    { id: "orders", label: "Orders", icon: <HiOutlineClipboardList size={18} /> },
    { id: "products", label: "Products", icon: <HiOutlineShoppingBag size={18} /> },
    { id: "customers", label: "Customers", icon: <HiOutlineUsers size={18} /> },
    { id: "reviews", label: "Reviews", icon: <HiOutlineStar size={18} /> },
    { id: "payments", label: "Payments", icon: <HiOutlineCreditCard size={18} /> },
  ];

  if (!authenticated) {
    return (
      <div style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#f9f9f9"
      }}>
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "2.5rem",
          width: "100%",
          maxWidth: 400,
          border: "1px solid var(--border)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}>
          <div style={{
            width: 64,
            height: 64,
            background: "#f0f7ff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem"
          }}>
            <HiOutlineLockClosed size={28} color="#2563EB" />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.8rem",
            marginBottom: "0.5rem"
          }}>
            Admin Access
          </h1>
          <p style={{
            color: "var(--muted)",
            fontSize: "0.9rem",
            marginBottom: "1.5rem"
          }}>
            Enter your admin password to continue
          </p>

          {error && (
            <div style={{
              background: "#fff0f2",
              border: "1px solid #e05c6a",
              borderRadius: 8,
              padding: "8px 14px",
              color: "#e05c6a",
              fontSize: "0.85rem",
              marginBottom: "1rem"
            }}>
              ⚠️ {error}
            </div>
          )}

          <input
            className="form-input"
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ marginBottom: "1rem", textAlign: "center" }}
          />
          <button
            className="btn-primary"
            style={{ width: "100%" }}
            onClick={handleLogin}
          >
            Access Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            fontWeight: 900,
            marginBottom: "0.25rem"
          }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            B-Com Belize — Store Management
          </p>
        </div>
        <button
          style={{
            background: "#fff0f2",
            color: "#e05c6a",
            border: "1px solid #e05c6a",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif"
          }}
          onClick={() => {
            sessionStorage.removeItem("bcom_admin");
            setAuthenticated(false);
          }}
        >
          Sign Out
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: "1.5rem"
      }}>

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
        </div>

        {/* CONTENT */}
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: "1.5rem",
          border: "1px solid var(--border)"
        }}>
          {activeTab === "overview" && <AdminOverview showNotification={showNotification} />}
          {activeTab === "products" && <AdminProducts showNotification={showNotification} />}
          {activeTab === "orders" && <AdminOrders showNotification={showNotification} />}
          {activeTab === "customers" && <AdminCustomers showNotification={showNotification} />}
          {activeTab === "reviews" && <AdminReviews showNotification={showNotification} />}
          {activeTab === "payments" && <AdminPayments showNotification={showNotification} />}
        </div>
      </div>
    </div>
  );
}
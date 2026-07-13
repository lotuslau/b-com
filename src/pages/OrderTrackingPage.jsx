import { useState } from "react";
import { getApiUrl } from "../services/apiConfig";
import {
  HiOutlineSearch,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineHome,
  HiOutlineXCircle,
  HiOutlineShoppingBag,
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiOutlinePhone
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

const ORDER_STATUSES = [
  {
    key: "pending",
    label: "Order Placed",
    desc: "Your order has been received",
    icon: <HiOutlineShoppingBag size={20} />,
    color: "#f59e0b",
    bg: "#fffbeb"
  },
  {
    key: "confirmed",
    label: "Confirmed",
    desc: "Your order has been confirmed",
    icon: <HiOutlineCheckCircle size={20} />,
    color: "#2563EB",
    bg: "#f0f7ff"
  },
  {
    key: "preparing",
    label: "Preparing",
    desc: "Your order is being prepared",
    icon: <HiOutlineClock size={20} />,
    color: "#8b5cf6",
    bg: "#f5f3ff"
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    desc: "Your order is on its way",
    icon: <HiOutlineTruck size={20} />,
    color: "#06b6d4",
    bg: "#ecfeff"
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Your order has been delivered",
    icon: <HiOutlineHome size={20} />,
    color: "#22c55e",
    bg: "#f0fdf4"
  },
];

const CANCELLED_STATUS = {
  key: "cancelled",
  label: "Cancelled",
  desc: "This order has been cancelled",
  icon: <HiOutlineXCircle size={20} />,
  color: "#e05c6a",
  bg: "#fff0f2"
};

const normalizePhone = (p) => p.replace(/\D/g, '').replace(/^501/, '');

export default function OrderTrackingPage({ showNotification }) {
  const [form, setForm] = useState({ reference: "", contact: "" });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleTrack = async () => {
    if (!form.reference || !form.contact) {
      setError("Please enter your order reference and phone number or email");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(
        getApiUrl('/orders/track'),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: form.reference.trim().toUpperCase(),
            contact: form.contact.trim()
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found. Please check your details.");
        setSearched(true);
        return;
      }

      setOrder(data.order);
      setSearched(true);

    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) =>
    ORDER_STATUSES.findIndex(s => s.key === status);

  const getEstimatedDelivery = (status, district, createdAt) => {
    if (status === "delivered") return "Delivered";
    if (status === "cancelled") return "Cancelled";
    const created = new Date(createdAt);
    const days = district === "Belize City" ? 2 : 3;
    const estimated = new Date(created);
    estimated.setDate(estimated.getDate() + days);
    return estimated.toLocaleDateString("en-BZ", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  };

  const currentStatusData = order
    ? order.status === "cancelled"
      ? CANCELLED_STATUS
      : ORDER_STATUSES[getStatusIndex(order.status)] || ORDER_STATUSES[0]
    : null;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem" }}>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{
          width: 64,
          height: 64,
          background: "#f0f7ff",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem"
        }}>
          <HiOutlineTruck size={28} color="#2563EB" />
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2rem",
          fontWeight: 900,
          marginBottom: "0.5rem"
        }}>
          Track Your Order
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
          Enter your order reference number and 7-digit phone number or email
        </p>
      </div>

      {/* SEARCH FORM */}
      <div style={{
        background: "white",
        borderRadius: 20,
        padding: "2rem",
        border: "1px solid var(--border)",
        marginBottom: "2rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
      }}>

        <div className="form-group">
          <label className="form-label">Order Reference *</label>
          <div style={{ position: "relative" }}>
            <HiOutlineSearch
              size={18}
              color="var(--muted)"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none"
              }}
            />
            <input
              className="form-input"
              type="text"
              placeholder="e.g. BCM-12345"
              value={form.reference}
              onChange={e => setForm({
                ...form,
                reference: e.target.value.toUpperCase()
              })}
              onKeyDown={e => e.key === "Enter" && handleTrack()}
              style={{
                paddingLeft: 38,
                fontFamily: "monospace",
                fontSize: "1rem",
                letterSpacing: 1
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Phone Number or Email *
          </label>
          <div style={{ position: "relative" }}>
            <HiOutlinePhone
              size={18}
              color="var(--muted)"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none"
              }}
            />
            <input
              className="form-input"
              type="text"
              placeholder="7-digit phone (e.g. 6221234) or email"
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleTrack()}
              style={{ paddingLeft: 38 }}
            />
          </div>
          <p style={{
            fontSize: "0.75rem",
            color: "var(--muted)",
            marginTop: 4
          }}>
            Enter the phone number or email used when placing your order
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fff0f2",
            border: "1px solid #e05c6a",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#e05c6a",
            fontSize: "0.85rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            ⚠️ {error}
          </div>
        )}

        <button
          className="btn-primary"
          style={{
            width: "100%",
            fontSize: "1rem",
            padding: "14px",
            opacity: loading ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
          onClick={handleTrack}
          disabled={loading}
        >
          <HiOutlineSearch size={18} />
          {loading ? "Searching..." : "Track My Order"}
        </button>
      </div>

      {/* ORDER RESULT */}
      {order && (
        <div>

          {/* STATUS BANNER */}
          <div style={{
            background: currentStatusData?.bg || "#f9f9f9",
            border: `2px solid ${currentStatusData?.color || "var(--border)"}`,
            borderRadius: 16,
            padding: "1.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap"
          }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: currentStatusData?.color,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {currentStatusData?.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 800,
                fontSize: "1.2rem",
                color: currentStatusData?.color,
                marginBottom: 2
              }}>
                {currentStatusData?.label}
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                {currentStatusData?.desc}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontFamily: "monospace",
                fontWeight: 700,
                color: "#2563EB",
                fontSize: "1rem"
              }}>
                {order.payment_ref}
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                {new Date(order.created_at).toLocaleDateString("en-BZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </div>
            </div>
          </div>

          {/* PROGRESS TRACKER */}
          {order.status !== "cancelled" && (
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "1.5rem",
              border: "1px solid var(--border)",
              marginBottom: "1.5rem"
            }}>
              <h3 style={{
                fontWeight: 700,
                marginBottom: "1.5rem",
                fontSize: "0.95rem"
              }}>
                Order Progress
              </h3>

              <div style={{ position: "relative" }}>
                {/* PROGRESS LINE */}
                <div style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  right: 20,
                  height: 3,
                  background: "#e5e7eb",
                  zIndex: 0
                }}>
                  <div style={{
                    height: "100%",
                    background: "#2563EB",
                    width: `${(getStatusIndex(order.status) /
                      (ORDER_STATUSES.length - 1)) * 100}%`,
                    transition: "width 0.5s ease",
                    borderRadius: 2
                  }} />
                </div>

                {/* STEPS */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 1
                }}>
                  {ORDER_STATUSES.map((status, index) => {
                    const currentIndex = getStatusIndex(order.status);
                    const isDone = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div key={status.key} style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        flex: 1
                      }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: isDone ? "#2563EB" : "white",
                          border: `3px solid ${isDone ? "#2563EB" : "#e5e7eb"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isDone ? "white" : "#9ca3af",
                          transition: "all 0.3s",
                          boxShadow: isCurrent
                            ? "0 0 0 4px rgba(37,99,235,0.2)"
                            : "none"
                        }}>
                          {status.icon}
                        </div>
                        <div style={{
                          fontSize: "0.68rem",
                          fontWeight: isCurrent ? 700 : 500,
                          color: isDone ? "#2563EB" : "#9ca3af",
                          textAlign: "center",
                          lineHeight: 1.3
                        }}>
                          {status.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ESTIMATED DELIVERY */}
              <div style={{
                marginTop: "1.5rem",
                paddingTop: "1rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.85rem"
              }}>
                <HiOutlineClock size={16} color="#2563EB" />
                <span>
                  <strong style={{ color: "var(--dark)" }}>
                    Estimated Delivery:
                  </strong>{" "}
                  <span style={{ color: "var(--muted)" }}>
                    {getEstimatedDelivery(
                      order.status,
                      order.district,
                      order.created_at
                    )}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* ORDER DETAILS */}
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "1.5rem",
            border: "1px solid var(--border)",
            marginBottom: "1.5rem"
          }}>
            <h3 style={{
              fontWeight: 700,
              marginBottom: "1.25rem",
              fontSize: "0.95rem"
            }}>
              Order Details
            </h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem"
            }}>
              {[
                {
                  icon: <HiOutlineLocationMarker size={16} color="#2563EB" />,
                  label: "Delivery Address",
                  value: `${order.shipping_address || ""}, ${order.district || ""}`
                },
                {
                  icon: <HiOutlineCreditCard size={16} color="#2563EB" />,
                  label: "Payment Method",
                  value: order.payment_method
                    ?.replace(/_/g, " ")
                    .replace(/\b\w/g, l => l.toUpperCase())
                },
                {
                  icon: <HiOutlineShoppingBag size={16} color="#2563EB" />,
                  label: "Order Total",
                  value: `BZ$ ${parseFloat(order.total_bzd || 0).toFixed(2)}`
                },
                {
                  icon: <HiOutlineCheckCircle size={16} color="#2563EB" />,
                  label: "Payment Status",
                  value: order.status === "delivered" ? "✅ Paid" : "⏳ Pending"
                },
              ].map(item => (
                <div key={item.label} style={{
                  background: "#f9f9f9",
                  borderRadius: 10,
                  padding: "0.75rem 1rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--muted)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 4
                  }}>
                    {item.icon} {item.label}
                  </div>
                  <div style={{
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    color: "var(--dark)"
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHATSAPP SUPPORT */}
          <div style={{
            background: "#f0f7ff",
            border: "1px solid #dbeafe",
            borderRadius: 16,
            padding: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div>
              <p style={{
                fontWeight: 700,
                marginBottom: 4,
                fontSize: "0.9rem"
              }}>
                Need help with your order?
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                Contact us with your reference: <strong>{order.payment_ref}</strong>
              </p>
            </div>
            <a
              href={`https://wa.me/501XXXXXXX?text=Hi! I need help with my order ${order.payment_ref}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#25D366",
                color: "white",
                padding: "10px 20px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.85rem",
                textDecoration: "none"
              }}>
              <FaWhatsapp size={16} />
              WhatsApp Us
            </a>
          </div>

        </div>
      )}

      {/* NOT FOUND */}
      {searched && !order && !loading && (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          background: "white",
          borderRadius: 16,
          border: "1px solid var(--border)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <h3 style={{ marginBottom: "0.5rem" }}>Order not found</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Please check your reference number and contact details
          </p>
          <a
            href="https://wa.me/5016206637"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#25D366",
              color: "white",
              padding: "10px 20px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none"
            }}
          >
            <FaWhatsapp size={16} />
            Contact Support
          </a>
        </div>
      )}

    </div>
  );
}
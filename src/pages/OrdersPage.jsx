import {
  HiOutlineCreditCard,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineLink,
  HiOutlineShieldCheck
} from "react-icons/hi";

import { useState } from "react";
import { PAYMENT_METHODS, DISTRICTS, EXTERNAL_STORES } from "../data/constants";

export default function OrdersPage({ cart, cartTotal, removeFromCart, showNotification }) {
  const [step, setStep] = useState(1);
  const [orderRef] = useState(() => "BCM-" + String(Date.now()).slice(-5));
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [externalLink, setExternalLink] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "Belize",
    notes: ""
  });

  const tax = cartTotal * 0.125;
  const shipping = cartTotal > 200 ? 0 : 15;
  const total = cartTotal + tax + shipping;

  const handlePlaceOrder = () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      showNotification("Please fill in all required fields", "error");
      return;
    }
    if (!paymentMethod) {
      showNotification("Please select a payment method", "error");
      return;
    }
    setOrderPlaced(true);
    showNotification("🎉 Order placed successfully!");
  };

  if (orderPlaced) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🎉</div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "2.5rem",
          marginBottom: "1rem"
        }}>
          Order Confirmed!
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 1.5rem" }}>
          Thank you {form.name}! Your order has been received and is being processed.
          We'll contact you at {form.phone} with updates.
        </p>
        <div style={{
          background: "var(--teal)",
          color: "white",
          display: "inline-block",
          padding: "10px 28px",
          borderRadius: 12,
          fontWeight: 700,
          letterSpacing: 1,
          fontSize: "1.1rem",
          marginBottom: "1rem"
        }}>
          {orderRef}
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          Save this reference number to track your order via WhatsApp
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{
        fontFamily: "'Playfair Display',serif",
        fontSize: "2.2rem",
        fontWeight: 900,
        marginBottom: "0.5rem"
      }}>
        Place Your Order
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        Fill in your details and we'll deliver to your door anywhere in Belize.
      </p>

      {/* STEPS */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", alignItems: "center" }}>
        {["Your Details", "Payment", "Review"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: step > i ? "var(--teal)" : step === i + 1 ? "var(--dark)" : "#ddd",
              color: step >= i + 1 ? "white" : "#999",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 700
            }}>
              {i + 1}
            </div>
            <span style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              color: step === i + 1 ? "var(--dark)" : "var(--muted)"
            }}>
              {s}
            </span>
          </div>
        ))}
      </div>

      <div className="orders-layout">

        {/* MAIN */}
        <div>

          {/* STEP 1 — Details */}
          {step === 1 && (
            <div className="order-card">
              <h2 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.4rem",
                marginBottom: "1.5rem"
              }}>
                Your Details
              </h2>

              {/* External Link Option */}
              <div style={{
                background: "#f0faf8",
                border: "1px solid var(--teal)",
                borderRadius: 10,
                padding: "1rem",
                marginBottom: "1.5rem"
              }}>
                <p style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <HiOutlineLink size={16} color="#2563EB" /> Ordering from Amazon, Shein, Temu or Alibaba?
                </span>
                </p>
                <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
                  Paste the product link below and we'll order it for you.
                </p>
                <input
                  className="form-input"
                  type="url"
                  placeholder="https://www.amazon.com/product/..."
                  value={externalLink}
                  onChange={e => setExternalLink(e.target.value)}
                />
              </div>

              {[
                ["Full Name *", "name", "text"],
                ["Email Address *", "email", "email"],
                ["Phone / WhatsApp *", "phone", "tel"],
                ["Delivery Address *", "address", "text"],
              ].map(([label, field, type]) => (
                <div key={field} className="form-group">
                  <label className="form-label">{label}</label>
                  <input
                    className="form-input"
                    type={type}
                    placeholder={label.replace(" *", "")}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">District *</label>
                <select
                  className="form-input"
                  value={form.district}
                  onChange={e => setForm({ ...form, district: e.target.value })}
                >
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  className="form-input"
                  style={{ height: 80 }}
                  placeholder="Any special instructions for your order..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <button
                className="btn-primary"
                onClick={() => {
                  if (!form.name || !form.email || !form.phone || !form.address) {
                    showNotification("Please fill in all required fields", "error");
                    return;
                  }
                  setStep(2);
                }}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* STEP 2 — Payment */}
          {step === 2 && (
            <div className="order-card">
              <h2 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.4rem",
                marginBottom: "1rem"
              }}>
                Payment Method
              </h2>

              <div style={{
                background: "#e8f0fd",
                border: "1px solid var(--teal)",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
                lineHeight: 1.6
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <HiOutlineShieldCheck size={16} color="#2563EB" /> All Belizean bank integrations
                </span>
              </div>

              {PAYMENT_METHODS.map(pm => (
                <div
                  key={pm.id}
                  style={{
                    border: `2px solid ${paymentMethod === pm.id ? "var(--bright blue)" : "#e0d9cc"}`,
                    background: paymentMethod === pm.id ? "#e8f0fd" : "white",
                    borderRadius: 12,
                    padding: "1rem",
                    marginBottom: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onClick={() => setPaymentMethod(pm.id)}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1rem", marginTop: 2 }}>
                      {paymentMethod === pm.id ? "🔵" : "⚪"}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 2 }}>
                        {pm.icon} {pm.label}
                        {pm.badge && (
                          <span style={{
                            background: "var(--teal)",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: 10,
                            fontSize: "0.68rem",
                            marginLeft: 6,
                            fontWeight: 600
                          }}>
                            {pm.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                        {pm.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  style={{ opacity: paymentMethod ? 1 : 0.5 }}
                  disabled={!paymentMethod}
                  onClick={() => setStep(3)}
                >
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === 3 && (
            <div className="order-card">
              <h2 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.4rem",
                marginBottom: "1.5rem"
              }}>
                Review Your Order
              </h2>

              {/* Cart Items */}
              {cart.length > 0 && (
                <div style={{
                  background: "#f9f9f9",
                  borderRadius: 12,
                  padding: "1rem",
                  marginBottom: "1rem"
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Cart Items
                  </h3>
                  {cart.map((item, i) => (
                    <div key={i} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      fontSize: "0.9rem"
                    }}>
                      <span>{item.name} ({item.size}) ×{item.qty}</span>
                      <span>BZ$ {parseFloat(item.price_bzd || item.price || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* External Link */}
              {externalLink && (
                <div style={{
                  background: "#f9f9f9",
                  borderRadius: 12,
                  padding: "1rem",
                  marginBottom: "1rem"
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    External Product Link
                  </h3>
                  <a href={externalLink} target="_blank" rel="noreferrer" style={{ color: "var(--teal)", fontSize: "0.85rem", wordBreak: "break-all" }}>
                    {externalLink}
                  </a>
                </div>
              )}

              {/* Delivery */}
              <div style={{
                background: "#f9f9f9",
                borderRadius: 12,
                padding: "1rem",
                marginBottom: "1rem"
              }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Delivery Details
                </h3>
                <p style={{ fontSize: "0.9rem" }}>{form.name} · {form.phone}</p>
                <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{form.address}, {form.district}</p>
              </div>

              {/* Payment */}
              <div style={{
                background: "#f9f9f9",
                borderRadius: 12,
                padding: "1rem",
                marginBottom: "1.5rem"
              }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Payment
                </h3>
                <p style={{ fontSize: "0.9rem" }}>
                  {PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}
                </p>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary" onClick={handlePlaceOrder}>
                  Place Order ✓
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "1.5rem",
          border: "1px solid var(--border)",
          height: "fit-content",
          position: "sticky",
          top: 80
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.2rem",
            marginBottom: "1.25rem"
          }}>
            Order Summary
          </h3>

          {cart.length === 0 && !externalLink ? (
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", textAlign: "center", padding: "1rem 0" }}>
              No items in cart yet
            </p>
          ) : (
            <>
              {cart.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--muted)" }}>{item.name.slice(0, 18)}... ×{item.qty}</span>
                  <span>BZ$ {parseFloat(item.price_bzd || item.price || 0).toFixed(2)}</span>
                </div>
              ))}

              {externalLink && (
                <div style={{ padding: "6px 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                  + External product link
                </div>
              )}
            </>
          )}

          <div style={{ height: 1, background: "var(--border)", margin: "0.75rem 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "0.85rem" }}>
            <span>Subtotal</span>
            <span>BZ$ {cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "0.85rem" }}>
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `BZ$ ${shipping.toFixed(2)}`}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "0.85rem" }}>
            <span>GST (12.5%)</span>
            <span>BZ$ {tax.toFixed(2)}</span>
          </div>

          <div style={{ height: 1, background: "var(--border)", margin: "0.75rem 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "var(--teal)", fontSize: "1.1rem" }}>
            <span>Total</span>
            <span>BZ$ {total.toFixed(2)}</span>
          </div>

          <div style={{
            background: "#f0faf8",
            borderRadius: 8,
            padding: "0.75rem",
            marginTop: "1rem",
            fontSize: "0.78rem",
            color: "var(--muted)",
            lineHeight: 1.5
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <HiOutlineTruck size={14} color="#2563EB" /> Free shipping on orders over BZ$ 200
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <HiOutlineShieldCheck size={14} color="#2563EB" /> Secure payment processing
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <HiOutlineCreditCard size={14} color="#2563EB" /> WhatsApp support available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
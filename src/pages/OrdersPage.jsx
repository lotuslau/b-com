import { useState } from "react";
import { PAYMENT_METHODS, DELIVERY_TO } from "../data/constants";
import {TERMS_AND_CONDITIONS, PRIVACY_POLICY, REFUND_POLICY} from "../data/policies";
import { createOrder, initiatePayment } from "../services/api";
import {
  HiOutlineCreditCard,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineLink
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { BiCheckbox } from "react-icons/bi";

export default function OrdersPage({ cart, cartTotal, removeFromCart, showNotification, setCart, setPage, customer }) {
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsTimestamp, setTermsTimestamp] = useState(null);
  const [orderRef] = useState(() => "BCM-" + String(Date.now()).slice(-5));
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    district: customer?.district || "Belize City",
    notes: ""
  });

  const tax = cartTotal * 0.125;

  const shipping = cartTotal > 200 ? 0 : 15;
  const total = cartTotal + tax + shipping;

  const handlePlaceOrder = async () => {
    if (!form.name?.trim() || !form.email?.trim() || !form.phone?.trim() || !form.address?.trim()) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    if (cart.length === 0) {
      showNotification("Your cart is empty", "error");
      return;
    }

    if (!paymentMethod) {
      showNotification("Please select a payment method", "error");
      return;
    }

    if (!agreedToTerms) {
      showNotification("Please agree to the Terms & Conditions", "error");
      return;
    }

    try {
        //Build order items from cart
      const items = cart.map(item => ({
        product_id: item.id,
        qty: item.qty,
        unit_price: parseFloat(item.price_bzd || item.price || 0),
        size: item.size,
        color: item.color
      }));

      //Create order in database
      const orderData = {
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: form.address,
        district: form.district,
        notes: form.notes,
        payment_method: paymentMethod,
        terms_agreed: agreedToTerms,
        terms_agreed_at: termsTimestamp,
        items
      };

      const token = sessionStorage.getItem("bcom_token");
      const response = await createOrder(orderData, token);

      if (response.success) {
        await initiatePayment({
          order_id: response.order.id,
          payment_method: paymentMethod,
          amount: response.order.total
        });

        setOrderPlaced(true);
        setCart([]);
        showNotification("Order placed successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Order error:", err);
      showNotification(err.message || "Something went wrong. Please try again.", "error");
    }
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
        <p style={{
          color: "var(--muted)",
          fontSize: "1rem",
          lineHeight: 1.7,
          maxWidth: 500,
          margin: "0 auto 1.5rem"
        }}>
          Thank you <strong>{form.name}</strong>! Your order has been received.
        </p>

        {/* PAYMENT PENDING NOTICE */}
        <div style={{
          background: "#fff8e1",
          border: "1px solid #f59e0b",
          borderRadius: 12,
          padding: "1.25rem",
          maxWidth: 500,
          margin: "0 auto 1.5rem",
          textAlign: "left"
        }}>
          <div style={{
            fontWeight: 700,
            marginBottom: 8,
            color: "#92400e",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            💳 Payment Instructions
          </div>
          <p style={{ color: "#92400e", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>
            Our team will contact you at <strong>{form.phone}</strong> within
            24 hours with payment instructions for your{" "}
            <strong>
              {paymentMethod === "belize_bank_card"
                ? "Belize Bank"
                : "Atlantic Bank"} card payment.
            </strong>
          </p>
        </div>

        <div style={{
          background: "#2563EB",
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

        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Save this reference number to track your order
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={`https://wa.me/5016206637?text=Hi! I need help with my order ${orderRef}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#25D366",
              color: "white",
              padding: "12px 28px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none"
            }}
          >
            <FaWhatsapp size={18} />
            Complete Payment via WhatsApp
          </a>
          <button
            className="btn-primary"
            onClick={() => setPage("tracking")}
          >
            Track Your Order →
          </button>
        </div>
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
        Fill in your details and we'll deliver to your door.
      </p>

      {/* STEPS */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", alignItems: "center" }}>
        {["Your Details", "Payment", "Review"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: step > i ? "#2563EB" : step === i + 1 ? "var(--dark)" : "#ddd",
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

              {[
                ["Full Name *", "name", "text", "John Smith"],
                ["Email Address *", "email", "email", "your@email.com"],
                ["Phone / WhatsApp *", "phone", "tel", "e.g. 6206637"],
                ["Delivery Address *", "address", "text", "Street address"],
              ].map(([label, field, type, placeholder]) => (
                <div key={field} className="form-group">
                  <label className="form-label">{label}</label>
                  <input
                    className="form-input"
                    type={type}
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Delivery Area *</label>
                <select
                  className="form-input"
                  value={form.district}
                  onChange={e => setForm({ ...form, district: e.target.value })}
                >
                  {DELIVERY_TO.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  className="form-input"
                  style={{ height: 80 }}
                  placeholder="Any special instructions..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <button
                className="btn-primary"
                onClick={() => {
                  if (!form.name?.trim() || !form.email?.trim() ||
                      !form.phone?.trim() || !form.address?.trim()) {
                    showNotification("Please fill in all required fields", "error");
                    return;
                  }
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
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
                background: "#f0f7ff",
                border: "1px solid #dbeafe",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
                lineHeight: 1.6
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                  fontWeight: 700,
                  color: "#1e40af"
                }}>
                  <HiOutlineShieldCheck size={16} />
                  Secure Payment Processing
                </div>
                <p style={{ color: "#374151", marginBottom: 4, fontSize: "0.82rem" }}>
                  All payments are processed securely through Belize Bank Limited
                  and Atlantic Bank Limited's hosted payment gateways.
                </p>
                <p style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                  ✅ Visa & Mastercard &nbsp;·&nbsp;
                  ✅ International cards &nbsp;·&nbsp;
                  ✅ 3D Secure &nbsp;·&nbsp;
                  ✅ PCI DSS compliant
                </p>
              </div>

              {PAYMENT_METHODS.map(pm => (
                <div
                  key={pm.id}
                  style={{
                    border: `2px solid ${paymentMethod === pm.id ? "#2563EB" : "#e5e7eb"}`,
                    background: paymentMethod === pm.id ? "#f0f7ff" : "white",
                    borderRadius: 12,
                    padding: "1.25rem",
                    marginBottom: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: paymentMethod === pm.id
                      ? "0 0 0 4px rgba(37,99,235,0.1)"
                      : "none"
                  }}
                  onClick={() => setPaymentMethod(pm.id)}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${paymentMethod === pm.id ? "#2563EB" : "#d1d5db"}`,
                      background: paymentMethod === pm.id ? "#2563EB" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                      transition: "all 0.2s"
                    }}>
                      {paymentMethod === pm.id && (
                        <div style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "white"
                        }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        marginBottom: 4,
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                      }}>
                        {pm.icon} {pm.label}
                        {pm.badge && (
                          <span style={{
                            background: "#2563EB",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: 10,
                            fontSize: "0.68rem",
                            fontWeight: 600
                          }}>
                            {pm.badge}
                          </span>
                        )}
                      </div>
                      <div style={{
                        color: "#6b7280",
                        fontSize: "0.82rem",
                        marginBottom: 8
                      }}>
                        {pm.desc}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <div style={{
                          background: "#1a1f71",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: "0.65rem",
                          fontWeight: 900
                        }}>
                          VISA
                        </div>
                        <div style={{
                          background: "#eb001b",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: "0.65rem",
                          fontWeight: 900
                        }}>
                          MC
                        </div>
                        <div style={{
                          background: "#f0f0f0",
                          color: "#374151",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: "0.65rem",
                          fontWeight: 600
                        }}>
                          International ✓
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setStep(1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  style={{ opacity: paymentMethod ? 1 : 0.5 }}
                  disabled={!paymentMethod}
                  onClick={() => {
                    setStep(3);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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

              {/* CART ITEMS */}
              {cart.length > 0 && (
                <div style={{
                  background: "#f9f9f9",
                  borderRadius: 12,
                  padding: "1rem",
                  marginBottom: "1rem"
                }}>
                  <h3 style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5
                  }}>
                    Cart Items ({cart.length})
                  </h3>
                  {cart.map((item, i) => (
                    <div key={i} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      fontSize: "0.9rem",
                      borderBottom: i < cart.length - 1 ? "1px solid var(--border)" : "none"
                    }}>
                      <span>{item.name} ({item.size}) ×{item.qty}</span>
                      <span>BZ$ {parseFloat(item.price_bzd || item.price || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* DELIVERY */}
              <div style={{
                background: "#f9f9f9",
                borderRadius: 12,
                padding: "1rem",
                marginBottom: "1rem"
              }}>
                <h3 style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5
                }}>
                  Delivery Details
                </h3>
                <p style={{ fontSize: "0.9rem" }}>
                  {form.name} · {form.phone}
                </p>
                <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                  {form.address}, {form.district}
                </p>
              </div>

              {/* PAYMENT */}
              <div style={{
                background: "#f9f9f9",
                borderRadius: 12,
                padding: "1rem",
                marginBottom: "1.5rem"
              }}>
                <h3 style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginBottom: "0.25rem",
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5
                }}>
                  Payment Method
                </h3>
                <p style={{ fontSize: "0.9rem" }}>
                  {PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}
                </p>
              </div>


              {/* T&C CHECKBOX */}
              <div style={{
                background: "#f0f7ff",
                border: "1px solid #dbeafe",
                borderRadius: 10,
                padding: "1rem",
                marginBottom: "1rem"
              }}>
                <label style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "var(--dark)"
                }}>
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={e => {
                      setAgreedToTerms(e.target.checked);
                      if (e.target.checked) {
                        setTermsTimestamp(new Date().toISOString());
                      } else {
                        setTermsTimestamp(null);
                      }
                    }}
                    style={{ marginTop: 3, accentColor: "#2563EB" }}
                  />
                  <span>
                    I have read and agree to the{" "}
                    <span
                      style={{ color: "#2563EB", textDecoration: "underline", cursor: "pointer" }}
                      onClick={() => setPage("terms")}
                    >
                      Terms & Conditions
                    </span>
                    ,{" "}
                    <span
                      style={{ color: "#2563EB", textDecoration: "underline", cursor: "pointer" }}
                      onClick={() => setPage("privacy")}
                    >
                      Privacy Policy
                    </span>
                    {" "}and{" "}
                    <span
                      style={{ color: "#2563EB", textDecoration: "underline", cursor: "pointer" }}
                      onClick={() => setPage("refund-policy")}
                    >
                      Return Policy
                    </span>

                  </span>

                </label>
                {termsTimestamp && (
                  <p style={{
                    fontSize: "0.72rem",
                    color: "var(--muted)",
                    marginTop: "0.5rem",
                    marginLeft: 26
                  }}>
                    ✓ Agreed at {new Date(termsTimestamp).toLocaleString()}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  onClick={handlePlaceOrder}
                  disabled={!agreedToTerms}
                  style={{ opacity: agreedToTerms ? 1 : 0.5 }}
                >
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

          {cart.length === 0 ? (
            <p style={{
              color: "var(--muted)",
              fontSize: "0.85rem",
              textAlign: "center",
              padding: "1rem 0"
            }}>
              No items in cart yet
            </p>
          ) : (
            cart.map((item, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: "0.85rem"
              }}>
                <span style={{ color: "var(--muted)" }}>
                  {item.name.slice(0, 18)}... ×{item.qty}
                </span>
                <span>
                  BZ$ {parseFloat(item.price_bzd || item.price || 0).toFixed(2)}
                </span>
              </div>
            ))
          )}

          <div style={{ height: 1, background: "var(--border)", margin: "0.75rem 0" }} />

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 0",
            fontSize: "0.85rem"
          }}>
            <span>Subtotal</span>
            <span>BZ$ {cartTotal.toFixed(2)}</span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 0",
            fontSize: "0.85rem"
          }}>
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `BZ$ ${shipping.toFixed(2)}`}</span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 0",
            fontSize: "0.85rem"
          }}>
            <span>GST (12.5%)</span>
            <span>BZ$ {tax.toFixed(2)}</span>
          </div>

          <div style={{ height: 1, background: "var(--border)", margin: "0.75rem 0" }} />

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            color: "#2563EB",
            fontSize: "1.1rem"
          }}>
            <span>Total</span>
            <span>BZ$ {total.toFixed(2)}</span>
          </div>

          <div style={{
            background: "#f0f7ff",
            borderRadius: 8,
            padding: "0.75rem",
            marginTop: "1rem",
            fontSize: "0.78rem",
            color: "var(--muted)",
            lineHeight: 1.6
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <HiOutlineTruck size={14} color="#2563EB" />
              Free shipping on orders over BZ$ 200
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <HiOutlineShieldCheck size={14} color="#2563EB" />
              Secure payment processing
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <HiOutlineCheckCircle size={14} color="#2563EB" />
              Order confirmation via email
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

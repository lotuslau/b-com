import {
  HiOutlineX,
  HiOutlineShoppingBag,
  HiOutlineTrash
} from "react-icons/hi";
export default function CartDrawer({
  cart,
  cartTotal,
  removeFromCart,
  setCartOpen,
  setPage,
  setCart,
  showNotification,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 200,
        backdropFilter: "blur(4px)"
      }}
      onClick={() => setCartOpen(false)}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 400,
          background: "white",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.5rem"
          }}>
            Your Cart 🛍️
          </h2>
          <button
            style={{ background: "none", color: "var(--muted)", display: "flex", alignItems: "center" }}
            onClick={() => setCartOpen(false)}
          >
            <HiOutlineX size={22} />
          </button>
        </div>

        {/* EMPTY STATE */}
        {cart.length === 0 ? (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted)",
            gap: "1rem"
          }}>
            <HiOutlineShoppingBag size={64} color="var(--border)" />
            <p>Your cart is empty</p>
            <button
              className="btn-primary"
              onClick={() => { setCartOpen(false); setPage("featured"); }}
            >
              Start Shopping →
            </button>
          </div>
        ) : (
          <>
            {/* ITEMS */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}>
              {cart.map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "1rem",
                  background: "#f9f9f9",
                  borderRadius: 12,
                  padding: "0.75rem"
                }}>
                  {/* IMAGE */}
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "#eee"
                  }}>
                    {item.images
                      ? <img
                          src={item.images}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      : <div style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem"
                        }}>
                        </div>
                    }
                  </div>

                  {/* INFO */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {item.name}
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: "0.78rem", margin: "2px 0" }}>
                      {item.size} · {item.color} · ×{item.qty}
                    </div>
                    <div style={{ fontWeight: 700, color: "var(--teal)", fontSize: "0.9rem" }}>
                      BZ$ {parseFloat(item.price_bzd || item.price || 0).toFixed(2)}
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    style={{ background: "none", color: "var(--muted)", alignSelf: "flex-start", display: "flex", alignItems: "center" }}
            onClick={() => removeFromCart(item.id, item.size, item.color)}
          >
            <HiOutlineTrash size={16} />                    
                  </button>
                </div>
              ))}
            </div>

            {/* FOOTER */}
           <div style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "1.25rem",
              marginTop: "1rem"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: "1.1rem",
                marginBottom: "1rem"
              }}>
                <span>Total</span>
                <span>BZ$ {cartTotal.toFixed(2)}</span>
              </div>

              <button
                className="btn-primary"
                style={{ width: "100%", marginBottom: "0.75rem" }}
                onClick={() => { setCartOpen(false); setPage("orders"); }}
              >
                Proceed to Order →
              </button>

              <button
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "var(--dark)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 12,
                  padding: "12px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "all 0.2s"
                }}
                onClick={() => { setCartOpen(false); setPage("featured"); }}
              >
                ← Continue Shopping
              </button>

              <button
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "var(--rose)",
                  border: "none",
                  padding: "8px",
                  fontWeight: 500,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  marginTop: "0.25rem"
                }}
                onClick={() => {
                if (window.confirm("Clear your entire cart?")) {
                setCart([]);
                setCart([]);
                showNotification("Cart cleared successfully");
                }
                }}
              >
                🗑️ Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
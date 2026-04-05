import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import DeliveryPolicyPage from "./pages/DeliveryPolicyPage";
import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import HomePage from "./pages/HomePage";
import FeaturedPage from "./pages/FeaturedPage";
import OrdersPage from "./pages/OrdersPage";
import AboutPage from "./pages/AboutPage";
import CustomerServicePage from "./pages/CustomerServicePage";
import OnlineStoresPage from "./pages/OnlineStoresPage";
import { getProducts } from "./services/api";

export default function BComStore() {
  // ── Navigation ──
  const [page, setPageState] = useState("home");

  const setPage = (newPage) => {
    setPageState(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Products ──
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Cart ──
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // ── Wishlist ──
  const [wishlist, setWishlist] = useState([]);

  // ── Selected Product ──
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Notification ──
  const [notification, setNotification] = useState(null);

  // ── Fetch Products ──
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.products);
      } catch (err) {
        console.error("API fetch failed:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // ── Notification Helper ──
  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ── Cart Actions ──
  const addToCart = (product, size, color) => {
    const existing = cart.find(
      i => i.id === product.id && i.size === size && i.color === color
    );
    if (existing) {
      setCart(cart.map(i =>
        i.id === existing.id && i.size === size && i.color === color
          ? { ...i, qty: i.qty + 1 }
          : i
      ));
    } else {
      setCart([...cart, { ...product, qty: 1, size, color }]);
    }
    showNotification(`${product.name} added to cart! 🛍️`);
  };

  const removeFromCart = (id, size, color) => {
    setCart(cart.filter(i => !(i.id === id && i.size === size && i.color === color)));
  };

  const cartTotal = cart.reduce(
    (s, i) => s + parseFloat(i.price_bzd || i.price || 0) * i.qty, 0
  );
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ── Wishlist Actions ──
  const toggleWishlist = (id) => {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  };

  // ── Shared Props ──
  const productProps = {
    products,
    loading,
    addToCart,
    wishlist,
    toggleWishlist,
    setSelectedProduct,
    setPage,
    searchQuery,
    setSearchQuery,
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#ffffff", color: "var(--dark)", minHeight: "100vh" }}>

      {/* NOTIFICATION */}
      {notification && (
        <div
          className="notification"
          style={{
            background: notification.type === "success"
              ? "var(--teal)"
              : "var(--rose)"
          }}
        >
          {notification.msg}
        </div>
      )}

      {/* NAV */}
      <Nav
        page={page}
        setPage={setPage}
        cartCount={cartCount}
        setCartOpen={setCartOpen}
        wishlist={wishlist}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* CART DRAWER */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          cartTotal={cartTotal}
          removeFromCart={removeFromCart}
          setCartOpen={setCartOpen}
          setPage={setPage}
        />
      )}

      {/* PAGES */}
      {page === "terms" && <TermsPage setPage={setPage} />}
      {page === "privacy" && <PrivacyPage setPage={setPage} />}
      {page === "refund-policy" && <RefundPolicyPage setPage={setPage} />}
      {page === "delivery-policy" && <DeliveryPolicyPage setPage={setPage} />}
      {page === "home" && <HomePage {...productProps} />}
      {page === "featured" && <FeaturedPage {...productProps} />}
      {page === "orders" && (
        <OrdersPage
          cart={cart}
          cartTotal={cartTotal}
          removeFromCart={removeFromCart}
          showNotification={showNotification}
        />
      )}
      {page === "about" && <AboutPage setPage={setPage} />}
      {page === "customer-service" && (
        <CustomerServicePage showNotification={showNotification} />
      )}
      {page === "online-stores" && <OnlineStoresPage setPage={setPage} />}
      {page === "product" && selectedProduct && (
  <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem" }}>
    <button
      onClick={() => setPage("featured")}
      style={{
        background: "none",
        border: "none",
        color: "#2563EB",
        fontWeight: 600,
        fontSize: "0.95rem",
        cursor: "pointer",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      ← Back to Featured
    </button>

    <div style={{
      background: "white",
      borderRadius: 20,
      border: "1px solid var(--border)",
      overflow: "hidden"
    }}>
      {selectedProduct.images && (
        <img
          src={selectedProduct.images}
          alt={selectedProduct.name}
          style={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover"
          }}
        />
      )}
      <div style={{ padding: "2rem" }}>
        <div style={{
          fontSize: "0.75rem",
          color: "#2563EB",
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: 600,
          marginBottom: "0.5rem"
        }}>
          {selectedProduct.brand}
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2rem",
          marginBottom: "1rem"
        }}>
          {selectedProduct.name}
        </h1>
        <div style={{
          fontSize: "1.8rem",
          fontWeight: 800,
          color: "#2563EB",
          marginBottom: "1rem"
        }}>
          BZ$ {parseFloat(selectedProduct.price_bzd || selectedProduct.price || 0).toFixed(2)}
        </div>
        <p style={{
          color: "var(--muted)",
          lineHeight: 1.7,
          marginBottom: "1.5rem"
        }}>
          {selectedProduct.description}
        </p>

        {selectedProduct.sizes && (
          <div style={{ marginBottom: "1rem" }}>
            <p style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "var(--muted)",
              marginBottom: "0.5rem"
            }}>
              Available Sizes
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {JSON.parse(selectedProduct.sizes).map(s => (
                <span key={s} style={{
                  padding: "6px 14px",
                  border: "1.5px solid var(--border)",
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: 500
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedProduct.colors && (
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "var(--muted)",
              marginBottom: "0.5rem"
            }}>
              Available Colors
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {JSON.parse(selectedProduct.colors).map(c => (
                <span key={c} style={{
                  padding: "6px 14px",
                  border: "1.5px solid var(--border)",
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: 500
                }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={() => {
              addToCart(
                selectedProduct,
                selectedProduct.sizes ? JSON.parse(selectedProduct.sizes)[0] : "One Size",
                selectedProduct.colors ? JSON.parse(selectedProduct.colors)[0] : "Default"
              );
            }}
          >
            Add to Cart
          </button>
          <button
            style={{
              flex: 1,
              background: "var(--dark)",
              color: "white",
              padding: "12px 28px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              border: "none"
            }}
            onClick={() => {
              addToCart(
                selectedProduct,
                selectedProduct.sizes ? JSON.parse(selectedProduct.sizes)[0] : "One Size",
                selectedProduct.colors ? JSON.parse(selectedProduct.colors)[0] : "Default"
              );
              setPage("orders");
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {/* FOOTER */}
      <Footer setPage={setPage} />

    </div>
  );
}
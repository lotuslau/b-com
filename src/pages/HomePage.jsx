import {
  HiOutlineTruck,
  HiOutlineLockClosed,
  HiOutlineRefresh,
  HiOutlineChatAlt2
} from "react-icons/hi";
import ProductCard from "../components/ProductCard";
import { STORE_LINKS, EXTERNAL_STORES } from "../data/constants";

export default function HomePage({
  products,
  setPage,
  addToCart,
  wishlist,
  toggleWishlist,
  setSelectedProduct,
  loading
}) {
  const featured = products.filter(p => p.featured);

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>

      {/* HERO SECTION */}
      <div className="hero">
        {/* LEFT — Text */}
        <div className="hero-text">
          <h1 className="hero-title">
            Trend Starts Here
          </h1>
          <p className="hero-subtitle">
            "Shop the latest fashion in Belize.<br />
            Delivered nationwide."
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              style={{
                background: "var(--dark)",
                color: "#ffffff",
                padding: "14px 32px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                border: "none"
              }}
              onClick={() => setPage("featured")}
            >
              Shop Now →
            </button>
            <button
              style={{
                background: "transparent",
                color: "var(--dark)",
                padding: "14px 32px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "0.95rem",
                border: "1.5px solid var(--border)",
                cursor: "pointer"
              }}
              onClick={() => setPage("online-stores")}
            >
              Browse Stores
            </button>
          </div>
        </div>

        {/* RIGHT — Hero Image */}
        <div className="hero-image">
          <img
            src="/images/apparel.jpg"
            alt="B-Com Fashion"
          />
        </div>
      </div>

      {/* TRUST BADGES */}
      <div className="trust-strip">
        {[
          { icon: <HiOutlineTruck size={20} color="#2563EB" />, text: "Nationwide Delivery" },
          { icon: <HiOutlineLockClosed size={20} color="#2563EB" />, text: "Secure Checkout" },
          { icon: <HiOutlineRefresh size={20} color="#2563EB" />, text: "Easy Exchanges" },
          { icon: <HiOutlineChatAlt2 size={20} color="#2563EB" />, text: "Online Support" },
        ].map(b => (
          <div key={b.text} className="trust-badge">
            <span style={{ fontSize: "1.1rem" }}>{b.icon}</span>
            {b.text}
          </div>
        ))}
      </div>

      {/* NEW COLLECTION BANNER */}
      <div className="collection-banner">
        <p>
          New Collection Just Dropped &nbsp;
          <span onClick={() => setPage("featured")}>
            [Explore Now]
          </span>
        </p>
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "4rem 2rem"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Featured Products
          </h2>
          <button
            style={{
              background: "transparent",
              color: "var(--teal)",
              border: "1.5px solid var(--teal)",
              padding: "8px 20px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
            onClick={() => setPage("featured")}
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌴</div>
            <p>Loading products...</p>
          </div>
        ) : featured.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</div>
            <p>No featured products yet</p>
          </div>
        ) : (
          <div className="product-grid">
            {featured.slice(0, 4).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                setSelectedProduct={setSelectedProduct}
                setPage={setPage}
              />
            ))}
          </div>
        )}
      </div>

      {/* EXTERNAL STORES STRIP */}
      <div style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        flexWrap: "wrap",
        background: "#f9f9f9"
      }}>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          Also shop from →
        </p>
        {EXTERNAL_STORES.map(s => (
  <a
    key={s.name}
    href={s.url}
    target="_blank"
    rel="noreferrer"
    style={{
      padding: "6px 18px",
      borderRadius: 20,
      border: `1.5px solid ${s.color}`,
      color: s.color,
      fontSize: "0.85rem",
      fontWeight: 600,
      transition: "all 0.2s"
    }}
  >
    {s.name}
  </a>
))}
      </div>
      {/* MARKETPLACE CTA - Coming Soon
      <div style={{
        background: "var(--teal)",
        padding: "4rem 2rem",
        textAlign: "center"
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "2rem",
          color: "#ffffff",
          marginBottom: "1rem"
        }}>
          Sell on B-Com Marketplace
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: "1rem",
          maxWidth: 480,
          margin: "0 auto 2rem",
          lineHeight: 1.7
        }}>
          Join Belize's fastest growing fashion marketplace.
          Set up your store in minutes.
        </p>
        <button
          style={{
            background: "#ffffff",
            color: "var(--teal)",
            padding: "14px 32px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            border: "none"
          }}
          onClick={() => setPage("customer-service")}
        >
          Contact Us to Get Started →
        </button>
      </div>
      */}
    </div>
  );
}
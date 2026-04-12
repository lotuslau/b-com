import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, EXTERNAL_STORES } from "../data/constants";

export default function FeaturedPage({
  products,
  addToCart,
  wishlist,
  toggleWishlist,
  setSelectedProduct,
  setPage,
  loading,
  searchQuery,
  setSearchQuery,
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStore, setSelectedStore] = useState("all");

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === "all" ||
      (selectedCategory === "clothing" && p.category_id === 1) ||
      (selectedCategory === "shoes" && p.category_id === 2) ||
      (selectedCategory === "accessories" && p.category_id === 3) ||
      (selectedCategory === "lifestyle" && p.category_id === 4);

    const matchStore = selectedStore === "all" ||
      (p.external_store || p.store) === selectedStore;

    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCat && matchStore && matchSearch;
  });

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem" }}>

      

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem" }}>

        {/* SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Category Filter */}
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "1.25rem",
            border: "1px solid var(--border)"
          }}>
            <h3 style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "var(--muted)",
              marginBottom: "0.75rem"
            }}>
              Category
            </h3>
            {["all", ...CATEGORIES.map(c => c.key)].map(c => (
              <button
                key={c}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  marginBottom: 4,
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  background: selectedCategory === c ? "var(--teal)" : "transparent",
                  color: selectedCategory === c ? "white" : "var(--dark)",
                  border: "none",
                  cursor: "pointer"
                }}
                onClick={() => setSelectedCategory(c)}
              >
                <span>
                  {c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}
                </span>
                <span style={{ opacity: 0.7, fontSize: "0.75rem" }}>
                  ({c === "all"
                    ? products.length
                    : products.filter(p => {
                        const cat = CATEGORIES.find(cat => cat.key === c);
                        return cat && p.category_id === cat.id;
                      }).length
                  })
                </span>
              </button>
            ))}
          </div>

          {/* Browse Global Stores */}
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "1.25rem",
            border: "1px solid var(--border)"
          }}>
            <h3 style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "var(--muted)",
              marginBottom: "0.5rem"
            }}>
              Browse Global Stores
            </h3>
            <p style={{
              fontSize: "0.78rem",
              color: "var(--muted)",
              marginBottom: "0.75rem",
              lineHeight: 1.5
            }}>
              Find items on these stores and bring the link to our Orders page
            </p>
            {EXTERNAL_STORES.map(s => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1.5px solid ${s.color}`,
                  marginBottom: 6,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: s.color,
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.target.style.background = s.color}
                onMouseLeave={e => e.target.style.background = "transparent"}
              >
                <span>{s.emoji} {s.name}</span>
                <span>→</span>
              </a>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        <div>
          <p style={{
            color: "var(--muted)",
            fontSize: "0.85rem",
            marginBottom: "1rem"
          }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>

          {loading ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌴</div>
              <p>Loading products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map(p => (
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
      </div>
    </div>
  );
}
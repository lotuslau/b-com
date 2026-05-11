import { useState } from "react";
import { CATEGORIES } from "../data/constants";
import { HiOutlineX, HiOutlineZoomIn } from "react-icons/hi";
import ProductCard from "../components/ProductCard";

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
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxProduct, setLightboxProduct] = useState(null);

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === "all" ||
      (selectedCategory === "clothing" && p.category_id === 1) ||
      (selectedCategory === "shoes" && p.category_id === 2) ||
      (selectedCategory === "accessories" && p.category_id === 3) ||
      (selectedCategory === "lifestyle" && p.category_id === 4);

    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCat && matchSearch;
  });

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2rem",
          fontWeight: 900,
          color: "var(--dark)"
        }}>
          Featured Collection
        </h1>
        <input
          style={{
            border: "2px solid var(--border)",
            borderRadius: 12,
            padding: "10px 20px",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            background: "white",
            minWidth: 280,
            outline: "none"
          }}
          placeholder="🔍 Search products, brands..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* MAIN LAYOUT */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: "2rem"
      }}>

        {/* SIDEBAR */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}>

          {/* CATEGORY FILTER */}
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
                  background: selectedCategory === c ? "#2563EB" : "transparent",
                  color: selectedCategory === c ? "white" : "var(--dark)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={() => setSelectedCategory(c)}
              >
                <span>
                  {c === "all"
                    ? "All Categories"
                    : c.charAt(0).toUpperCase() + c.slice(1)}
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

        </div>

        {/* PRODUCTS SECTION */}
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
                  onImageClick={(img, product) => {
                    setLightboxImage(img);
                    setLightboxProduct(product);
                  }}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* IMAGE LIGHTBOX */}
      {lightboxImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
          }}
          onClick={() => {
            setLightboxImage(null);
            setLightboxProduct(null);
          }}
        >
          {/* CLOSE BUTTON */}
          <button
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              width: 44,
              height: 44,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)"
            }}
            onClick={() => {
              setLightboxImage(null);
              setLightboxProduct(null);
            }}
          >
            <HiOutlineX size={20} />
          </button>

          {/* IMAGE CONTAINER */}
          <div
            style={{
              position: "relative",
              maxWidth: "80vw",
              maxHeight: "85vh"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* MAIN IMAGE */}
            <img
              src={lightboxImage}
              alt={lightboxProduct?.name}
              style={{
                maxWidth: "80vw",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: 16,
                display: "block"
              }}
            />

            {/* THUMBNAIL STRIP */}
            {lightboxProduct?.additional_images?.length > 0 && (
              <div style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                marginTop: "1rem",
                flexWrap: "wrap"
              }}>
                {/* MAIN IMAGE THUMBNAIL */}
                <img
                  src={lightboxProduct.images}
                  alt="Main view"
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: lightboxImage === lightboxProduct.images
                      ? "2px solid white"
                      : "2px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    opacity: lightboxImage === lightboxProduct.images ? 1 : 0.7,
                    transition: "all 0.2s"
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setLightboxImage(lightboxProduct.images);
                  }}
                />
                {/* ADDITIONAL IMAGE THUMBNAILS */}
                {lightboxProduct.additional_images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`View ${i + 2}`}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: lightboxImage === img
                        ? "2px solid white"
                        : "2px solid rgba(255,255,255,0.3)",
                      cursor: "pointer",
                      opacity: lightboxImage === img ? 1 : 0.7,
                      transition: "all 0.2s"
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      setLightboxImage(img);
                    }}
                  />
                ))}
              </div>
            )}

            {/* PRODUCT INFO */}
            {lightboxProduct && (
              <div style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: 12,
                padding: "1rem 1.5rem",
                marginTop: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div>
                  <div style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.75rem",
                    marginBottom: 4
                  }}>
                    {lightboxProduct.brand}
                  </div>
                  <div style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1rem"
                  }}>
                    {lightboxProduct.name}
                  </div>
                </div>
                <div style={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1.3rem"
                }}>
                  BZ$ {parseFloat(
                    lightboxProduct.price_bzd ||
                    lightboxProduct.price || 0
                  ).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
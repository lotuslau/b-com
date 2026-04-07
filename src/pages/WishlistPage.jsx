import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart, HiOutlineLightningBolt, HiOutlineTrash } from "react-icons/hi";
import { STORE_COLORS } from "../data/constants";

export default function WishlistPage({ products, wishlist, toggleWishlist, addToCart, setPage, setSelectedProduct }) {
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddToCart = (product) => {
    addToCart(
      product,
      product.sizes ? JSON.parse(product.sizes)[0] : "One Size",
      product.colors ? JSON.parse(product.colors)[0] : "Default"
    );
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    setPage("orders");
  };

  const totalValue = wishlistProducts.reduce(
    (sum, p) => sum + parseFloat(p.price_bzd || p.price || 0), 0
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            fontWeight: 900,
            marginBottom: "0.25rem",
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <HiHeart size={28} color="#e05c6a" /> My Wishlist
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            {wishlistProducts.length === 0
              ? "You haven't saved any items yet"
              : `${wishlistProducts.length} item${wishlistProducts.length > 1 ? "s" : ""} saved`
            }
          </p>
        </div>
        <button
          className="btn-secondary"
          onClick={() => setPage("featured")}
        >
          ← Continue Shopping
        </button>
      </div>

      {/* EMPTY STATE */}
      {wishlistProducts.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "5rem 2rem",
          background: "white",
          borderRadius: 20,
          border: "1px solid var(--border)"
        }}>
          <HiOutlineHeart size={64} color="var(--border)" style={{ margin: "0 auto 1rem" }} />
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.8rem",
            marginBottom: "0.75rem"
          }}>
            Your wishlist is empty
          </h2>
          <p style={{
            color: "var(--muted)",
            marginBottom: "2rem",
            fontSize: "0.95rem"
          }}>
            Browse our collection and click ♡ Save to Wishlist on products you love
          </p>
          <button
            className="btn-primary"
            onClick={() => setPage("featured")}
          >
            Browse Products →
          </button>
        </div>
      ) : (
        <>
          {/* PRODUCTS GRID */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem"
          }}>
            {wishlistProducts.map(product => {
              const store = product.external_store || product.store || "own";
              const storeColor = STORE_COLORS[store] || "#2563EB";

              return (
                <div key={product.id} style={{
                  background: "white",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  transition: "all 0.3s"
                }}>
                  {/* IMAGE */}
                  <div style={{
                    position: "relative",
                    paddingTop: "75%",
                    overflow: "hidden",
                    cursor: "pointer"
                  }}
                    onClick={() => {
                      setSelectedProduct(product);
                      setPage("reviews");
                    }}
                  >
                    {product.images ? (
                      <img
                        src={product.images}
                        alt={product.name}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `linear-gradient(135deg, ${storeColor}22, ${storeColor}44)`,
                        fontSize: "4rem"
                      }}>
                        🛍️
                      </div>
                    )}
                    <span style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: storeColor,
                      color: "white",
                      padding: "3px 10px",
                      borderRadius: 12,
                      fontSize: "0.7rem",
                      fontWeight: 700
                    }}>
                      {store === "own" ? "B-COM" : store.toUpperCase()}
                    </span>
                  </div>

                  {/* INFO */}
                  <div style={{ padding: "1rem" }}>
                    <div style={{
                      fontSize: "0.72rem",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 4
                    }}>
                      {product.brand}
                    </div>
                    <h3
                      style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        marginBottom: "0.5rem",
                        lineHeight: 1.3,
                        cursor: "pointer",
                        color: "var(--dark)"
                      }}
                      onClick={() => {
                        setSelectedProduct(product);
                        setPage("reviews");
                      }}
                    >
                      {product.name}
                    </h3>
                    <div style={{
                      fontWeight: 700,
                      color: "#2563EB",
                      fontSize: "1.1rem",
                      marginBottom: "1rem"
                    }}>
                      BZ$ {parseFloat(product.price_bzd || product.price || 0).toFixed(2)}
                    </div>

                    {/* BUTTONS */}
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6
                    }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          style={{
                            flex: 1,
                            background: "#2563EB",
                            color: "white",
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 12px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5
                          }}
                          onClick={() => handleAddToCart(product)}
                        >
                          <HiOutlineShoppingCart size={14} />
                          Add to Cart
                        </button>
                        <button
                          style={{
                            flex: 1,
                            background: "var(--dark)",
                            color: "white",
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 12px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5
                          }}
                          onClick={() => handleBuyNow(product)}
                        >
                          <HiOutlineLightningBolt size={14} />
                          Buy Now
                        </button>
                      </div>
                      <button
                        style={{
                          width: "100%",
                          background: "#fff0f2",
                          color: "#e05c6a",
                          border: "1.5px solid #e05c6a",
                          borderRadius: 10,
                          padding: "8px 12px",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 5
                        }}
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <HiOutlineTrash size={14} />
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY FOOTER */}
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "1.5rem 2rem",
            border: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 4 }}>
                Total value of saved items
              </p>
              <p style={{
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#2563EB"
              }}>
                BZ$ {totalValue.toFixed(2)}
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              
            <button
                className="btn-secondary"
                onClick={() => {
                  const productsToAdd = [...wishlistProducts];
                  productsToAdd.forEach(p => {
                    addToCart(
                      p,
                      p.sizes ? JSON.parse(p.sizes)[0] : "One Size",
                      p.colors ? JSON.parse(p.colors)[0] : "Default"
                    );
                  });
                }}
              >
                Add All to Cart
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  const productsToAdd = [...wishlistProducts];
                  productsToAdd.forEach(p => {
                    addToCart(
                      p,
                      p.sizes ? JSON.parse(p.sizes)[0] : "One Size",
                      p.colors ? JSON.parse(p.colors)[0] : "Default"
                    );
                  });
                  setPage("orders");
                }}
              >
                Order All Items →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
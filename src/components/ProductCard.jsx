import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineStar,
  HiStar,
  HiOutlineShoppingCart,
  HiOutlineLightningBolt
} from "react-icons/hi";
import { STORE_LINKS, STORE_COLORS } from "../data/constants";

export default function ProductCard({
  product,
  addToCart,
  wishlist,
  toggleWishlist,
  setSelectedProduct,
  setPage
}) {
  const store = product.external_store || product.store || "own";
  const storeColor = STORE_COLORS[store] || "var(--bright blue)";
  const stock = product.stock_qty ?? product.stock ?? 0;
  const isWishlisted = wishlist.includes(product.id);

  const handleBuyNow = () => {
    addToCart(
      product,
      product.sizes ? JSON.parse(product.sizes)[0] : "One Size",
      product.colors ? JSON.parse(product.colors)[0] : "Default"
    );
    setPage("orders");
  };

  const handleAddToCart = () => {
    addToCart(
      product,
      product.sizes ? JSON.parse(product.sizes)[0] : "One Size",
      product.colors ? JSON.parse(product.colors)[0] : "Default"
    );
  };

  const handleCardClick = () => {
    setSelectedProduct(product);
    setPage("reviews");
  };

  return (
    <div className="product-card">

      {/* IMAGE */}
      <div className="product-image-wrap" onClick={handleCardClick}>
        <div
          className="product-image"
          style={{
            background: product.images
              ? "transparent"
              : `linear-gradient(135deg, ${storeColor}22, ${storeColor}44)`
          }}
        >
          {product.images
            ? <img src={product.images} alt={product.name} />
            : <span style={{ fontSize: "5rem" }}>🛍️</span>
          }
        </div>
        {product.featured && (
          <span className="product-featured-badge" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <HiStar size={12} /> Featured
          </span>
        )}

        {stock === 0 && (
          <div className="product-out-of-stock">Out of Stock</div>
        )}
      </div>

      {/* INFO */}
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>

        <h3 className="product-name" onClick={handleCardClick}>
          {product.name}
        </h3>

        <div className="product-rating" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            i < Math.round(product.rating || 0)
              ? <HiStar key={i} size={14} color="#2563EB" />
              : <HiOutlineStar key={i} size={14} color="#ddd" />
          ))}
          <span className="product-reviews">
            ({product.reviews_count || product.reviews || 0})
          </span>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <span className="product-price">
            BZ$ {parseFloat(product.price_bzd || product.price || 0).toFixed(2)}
          </span>
        </div>

       {/* BUTTONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: "0.75rem" }}>

          {/* ROW 1 — Add to Cart + Buy Now */}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className="add-to-cart-btn"
              style={{
                background: stock === 0 ? "#ccc" : "#2563EB",
                opacity: stock === 0 ? 0.6 : 1,
                flex: 1
              }}
              onClick={handleAddToCart}
              disabled={stock === 0}
              title="Add to cart and keep shopping"
            >
              <span style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                <HiOutlineShoppingCart size={14} />
                {stock === 0 ? "Out of Stock" : "Add to Cart"}
              </span>
            </button>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={stock === 0}
              style={{
                opacity: stock === 0 ? 0.6 : 1,
                flex: 1,
                background: stock === 0 ? "#ccc" : "var(--dark)"
              }}
              title="Buy now — go straight to checkout"
            >
              <span style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                <HiOutlineLightningBolt size={14} />
                Buy Now
              </span>
            </button>
          </div>

          {/* ROW 2 — Save to Wishlist */}
          <button
            className={`wishlist-btn ${isWishlisted ? "saved" : ""}`}
            onClick={() => toggleWishlist(product.id)}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {isWishlisted
                ? <><HiHeart size={14} color="#e05c6a" /> Saved to Wishlist</>
                : <><HiOutlineHeart size={14} /> Save to Wishlist</>
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
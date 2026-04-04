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
    setPage("product");
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
        <div className="product-actions">
          <button
            className="add-to-cart-btn"
            style={{
              background: "var(--bright blue)",
              opacity: stock === 0 ? 0.5 : 1
            }}
            onClick={handleAddToCart}
            disabled={stock === 0}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
              <HiOutlineShoppingCart size={15} /> Add to Cart
            </span>
          </button>

          <button
            className="buy-now-btn"
            onClick={handleBuyNow}
            disabled={stock === 0}
            style={{ opacity: stock === 0 ? 0.5 : 1 }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
              <HiOutlineLightningBolt size={15} /> Buy Now
            </span>
          </button>

          <button
            className={`wishlist-btn ${isWishlisted ? "saved" : ""}`}
            onClick={() => toggleWishlist(product.id)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {isWishlisted
              ? <><HiHeart size={14} color="#e05c6a" /> Saved</>
              : <><HiOutlineHeart size={14} /> Save</>
            }
          </span>
          </button>
        </div>
      </div>
    </div>
  );
}
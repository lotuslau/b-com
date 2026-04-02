import { useState, useEffect, } from "react";
import { getProducts } from './services/api';
// ============================================================
// DATABASE SCHEMA & DATA
// ============================================================
const DB_SCHEMA = `
-- B-Com E-Commerce Database Schema
-- Compatible with PostgreSQL / MySQL / SQLite

CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  parent_id   INT REFERENCES categories(id),
  image_url   TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sellers (
  id            SERIAL PRIMARY KEY,
  store_name    VARCHAR(200) NOT NULL,
  owner_name    VARCHAR(200) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  phone         VARCHAR(30),
  address       TEXT,
  belize_tax_id VARCHAR(50),
  status        ENUM('pending','approved','suspended') DEFAULT 'pending',
  commission_pct DECIMAL(5,2) DEFAULT 10.00,
  bank_name     VARCHAR(100),
  account_no    VARCHAR(100),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id            SERIAL PRIMARY KEY,
  seller_id     INT REFERENCES sellers(id),
  category_id   INT REFERENCES categories(id),
  name          VARCHAR(300) NOT NULL,
  description   TEXT,
  price_bzd     DECIMAL(10,2) NOT NULL,
  stock_qty     INT DEFAULT 0,
  sku           VARCHAR(100) UNIQUE,
  brand         VARCHAR(100),
  sizes         JSON,
  colors        JSON,
  images        JSON,
  external_link TEXT,
  external_store ENUM('amazon','shein','temu','alibaba','own'),
  weight_kg     DECIMAL(6,3),
  is_active     BOOLEAN DEFAULT TRUE,
  featured      BOOLEAN DEFAULT FALSE,
  views         INT DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id              SERIAL PRIMARY KEY,
  customer_id     INT REFERENCES customers(id),
  status          ENUM('pending','paid','processing','shipped','delivered','cancelled','refunded'),
  subtotal_bzd    DECIMAL(10,2),
  shipping_bzd    DECIMAL(10,2) DEFAULT 0,
  tax_bzd         DECIMAL(10,2),
  total_bzd       DECIMAL(10,2),
  payment_method  ENUM('belize_bank_card','atlantic_bank_card','belize_bank_transfer','atlantic_bank_transfer','paypal','stripe','cash_delivery'),
  payment_ref     VARCHAR(200),
  shipping_address TEXT,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INT REFERENCES orders(id),
  product_id  INT REFERENCES products(id),
  qty         INT NOT NULL,
  unit_price  DECIMAL(10,2),
  size        VARCHAR(20),
  color       VARCHAR(50)
);

CREATE TABLE customers (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200),
  email       VARCHAR(255) UNIQUE,
  phone       VARCHAR(30),
  address     TEXT,
  district    VARCHAR(100),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id              SERIAL PRIMARY KEY,
  order_id        INT REFERENCES orders(id),
  gateway         VARCHAR(50),
  transaction_ref VARCHAR(200),
  amount_bzd      DECIMAL(10,2),
  currency        VARCHAR(10) DEFAULT 'BZD',
  status          ENUM('initiated','pending','success','failed','refunded'),
  gateway_response JSON,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_active ON products(is_active, featured);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_payments_order ON payments(order_id);
`;

const STORE_LINKS = {
  Amazon: "https://www.amazon.com",
  Shein: "https://www.shein.com",
  Temu: "https://www.temu.com",
  Alibaba: "https://www.alibaba.com",
};

const STORE_COLORS = {
  amazon: "#FF9900",
  shein: "var(--rose)",
  temu: "var(--orange)",
  alibaba: "#FF6A00",
  own: "var(--teal)",
};

// ============================================================
// MAIN APP
// ============================================================
export default function BCom() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [sellerTab, setSellerTab] = useState("register");
  const [dbTab, setDbTab] = useState("schema");
  const [adminTab, setAdminTab] = useState("overview");
  const [notification, setNotification] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [_apiError, setApiError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.products);
      } catch (err) {
        console.error('API fetch failed:', err);
        setApiError('Could not load products from server.');
        setProducts(PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product, size, color) => {
    const existing = cart.find(i => i.id === product.id && i.size === size && i.color === color);
    if (existing) {
      setCart(cart.map(i => i.id === existing.id && i.size === size && i.color === color ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...product, qty: 1, size, color }]);
    }
    showNotification(`${product.name} added to cart! 🛍️`);
  };

  const removeFromCart = (id, size, color) => setCart(cart.filter(i => !(i.id === id && i.size === size && i.color === color)));
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const toggleWishlist = (id) => {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  };

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchStore = selectedStore === "all" || p.store === selectedStore;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStore && matchSearch;
  });

  return (
    <div style={styles.app}>
      <style>{CSS}</style>

      {notification && (
        <div style={{ ...styles.notification, background: notification.type === "success" ? "var(--teal)" : "var(--rose)" }}>
          {notification.msg}
        </div>
      )}

      <Nav page={page} setPage={setPage} cartCount={cartCount} setCartOpen={setCartOpen} />

      {cartOpen && (
        <CartDrawer
          cart={cart}
          cartTotal={cartTotal}
          removeFromCart={removeFromCart}
          setCartOpen={setCartOpen}
          setPage={setPage}
          setCartOpen2={setCartOpen}
        />
      )}

      {page === "home" && (
        <HomePage
          products={loading ? [] : products}
          loading={loading}
          setPage={setPage}
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {page === "shop" && (
        <ShopPage
          products={filteredProducts}
          allProducts={products}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          setSelectedProduct={setSelectedProduct}
          setPage={setPage}
        />
      )}

      {page === "product" && selectedProduct && (
        <ProductPage
          product={selectedProduct}
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          setPage={setPage}
          relatedProducts={products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0,4)}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {page === "marketplace" && (
        <MarketplacePage sellerTab={sellerTab} setSellerTab={setSellerTab} showNotification={showNotification} />
      )}

      {page === "checkout" && (
        <CheckoutPage
          cart={cart}
          cartTotal={cartTotal}
          checkoutStep={checkoutStep}
          setCheckoutStep={setCheckoutStep}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          orderPlaced={orderPlaced}
          setOrderPlaced={setOrderPlaced}
          setCart={setCart}
          showNotification={showNotification}
        />
      )}

      {page === "payment-info" && <PaymentInfoPage />}

      {page === "database" && <DatabasePage dbTab={dbTab} setDbTab={setDbTab} />}

      {page === "admin" && <AdminPage adminTab={adminTab} setAdminTab={setAdminTab} products={products} />}

      <Footer setPage={setPage} />
    </div>
  );
}

// ============================================================
// NAVIGATION
// ============================================================
function Nav({ page, setPage, cartCount, setCartOpen }) {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{ ...styles.nav, background: scrolled ? "rgba(252,248,240,0.97)" : "rgba(252,248,240,0.85)", boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.1)" : "none" }}>
      <div style={styles.navInner}>
        <div style={styles.logo} onClick={() => setPage("home")}>
          <img 
            src="/images/logo.png" 
            alt="B-Com Belize" 
            style={{height:45, objectFit:"contain", cursor:"pointer"}}
          />
        </div>

        <div style={styles.navLinks}>
          {[["home","Home"],["shop","Shop"],["marketplace","Marketplace"],["payment-info","Payments"],["database","Database"],["admin","Admin"]].map(([p,l]) => (
            <button key={p} onClick={() => setPage(p)} style={{ ...styles.navLink, color: page === p ? "var(--teal)" : "var(--dark)", borderBottom: page === p ? "2px solid var(--teal)" : "2px solid transparent" }}>
              {l}
            </button>
          ))}
        </div>

        <div style={styles.navActions}>
          <button onClick={() => setCartOpen(true)} style={styles.cartBtn}>
            🛍️ {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ products, setPage, addToCart, wishlist, toggleWishlist, setSelectedProduct }) {
  const featured = products.filter(p => p.featured);

  return (
    <div>
      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroBg}>
          <div style={styles.heroWave1}/>
          <div style={styles.heroWave2}/>
          <div style={styles.heroPattern}/>
        </div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Fashion Meets<br/>
            <span style={styles.heroAccent}>Paradise</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Belize's premier online fashion destination. Clothes, shoes & accessories
            curated from local makers and global brands — delivered to your door.
          </p>
          <div style={styles.heroActions}>
            <button style={styles.btnPrimary} onClick={() => setPage("shop")}>Shop Collection ✨</button>
            <button style={styles.btnSecondary} onClick={() => setPage("marketplace")}>Sell With Us</button>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}><strong>500+</strong><span>Products</span></div>
            <div style={styles.heroStatDiv}/>
            <div style={styles.heroStat}><strong>50+</strong><span>Sellers</span></div>
            <div style={styles.heroStatDiv}/>
            <div style={styles.heroStat}><strong>4</strong><span>Global Stores</span></div>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardEmoji}>👗</div>
            <div style={styles.heroCardLabel}>New Arrivals</div>
          </div>
          <div style={{ ...styles.heroCard, top: "55%", left: "65%" }}>
            <div style={styles.heroCardEmoji}>🩴</div>
            <div style={styles.heroCardLabel}>Beach Essentials</div>
          </div>
          <div style={{ ...styles.heroCard, top: "15%", left: "60%" }}>
            <div style={styles.heroCardEmoji}>🎩</div>
            <div style={styles.heroCardLabel}>Accessories</div>
          </div>
        </div>
      </div>

      {/* EXTERNAL STORES BANNER */}
      <div style={styles.storesBanner}>
        <p style={styles.storesBannerLabel}>Also shop from global stores →</p>
        {[
          { name:"Amazon", emoji:"📦", color:"#FF9900", url: STORE_LINKS.amazon },
          { name:"Shein", emoji:"👘", color:"#e74c3c", url: STORE_LINKS.shein },
          { name:"Temu", emoji:"🛒", color:"#e67e22", url: STORE_LINKS.temu },
          { name:"Alibaba", emoji:"🏪", color:"#FF6A00", url: STORE_LINKS.alibaba },
        ].map(s => (
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{ ...styles.storeChip, borderColor: s.color, color: s.color }}>
            {s.emoji} {s.name}
          </a>
        ))}
      </div>

      {/* CATEGORIES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Shop by Category</h2>
        <div style={styles.categoryGrid}>
          {[
            { key:"clothes", label:"Clothing", emoji:"👗", desc:"Tropical styles for every occasion", count: products.filter(p=>p.category==="clothes").length },
            { key:"shoes", label:"Footwear", emoji:"👟", desc:"From beach sandals to city sneakers", count: products.filter(p=>p.category==="shoes").length },
            { key:"accessories", label:"Accessories", emoji:"📿", desc:"Complete your look with our curated picks", count: products.filter(p=>p.category==="accessories").length },
          ].map(c => (
            <div key={c.key} style={styles.categoryCard} onClick={() => { setPage("shop"); }}>
              <div style={styles.categoryEmoji}>{c.emoji}</div>
              <h3 style={styles.categoryLabel}>{c.label}</h3>
              <p style={styles.categoryDesc}>{c.desc}</p>
              <span style={styles.categoryCount}>{c.count} items</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ ...styles.section, background: "#ffffff" }}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>
        <div style={styles.productGrid}>
          {featured.slice(0,6).map(p => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} setSelectedProduct={setSelectedProduct} setPage={setPage} />
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:"2rem" }}>
          <button style={styles.btnPrimary} onClick={() => setPage("shop")}>View All Products →</button>
        </div>
      </section>

      {/* PAYMENT METHODS STRIP */}
      <section style={styles.paymentStrip}>
        <p style={styles.paymentStripLabel}>Secure payment with Belize's trusted banks</p>
        <div style={styles.paymentIcons}>
          {["🏦 Belize Bank", "🏦 Atlantic Bank", "💳 Visa / Mastercard", "🌐 PayPal", "💸 Online Transfer"].map(m => (
            <span key={m} style={styles.paymentIcon}>{m}</span>
          ))}
        </div>
      </section>

      {/* MARKETPLACE CTA */}
      <section style={styles.marketplaceCta}>
        <div style={styles.marketplaceCtaContent}>
          <h2 style={styles.marketplaceCtaTitle}>Sell on B-COM Marketplace</h2>
          <p style={styles.marketplaceCtaText}>Join Belize's fastest-growing fashion marketplace. Set up your store in minutes and reach thousands of customers across the country.</p>
          <button style={styles.btnPrimary} onClick={() => setPage("marketplace")}>Start Selling Today →</button>
        </div>
        <div style={styles.marketplaceCtaVisual}>
          <div style={styles.mktBubble}>🏪</div>
          <div style={{ ...styles.mktBubble, width:80, height:80, top:"60%", left:"60%", fontSize:"2rem" }}>💰</div>
          <div style={{ ...styles.mktBubble, width:60, height:60, top:"20%", left:"55%", fontSize:"1.5rem" }}>📦</div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// SHOP PAGE
// ============================================================
function ShopPage({ products, allProducts, selectedCategory, setSelectedCategory, selectedStore, setSelectedStore, searchQuery, setSearchQuery, addToCart, wishlist, toggleWishlist, setSelectedProduct, setPage }) {
  return (
    <div style={styles.shopPage}>
      <div style={styles.shopHeader}>
        <h1 style={styles.shopTitle}>Shop All</h1>
        <input
          style={styles.searchInput}
          placeholder="🔍 Search products, brands..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={styles.shopLayout}>
        {/* SIDEBAR */}
        <div style={styles.shopSidebar}>
          <div style={styles.filterGroup}>
            <h3 style={styles.filterTitle}>Category</h3>
            {["all","clothes","shoes","accessories"].map(c => (
              <button key={c} style={{ ...styles.filterBtn, background: selectedCategory === c ? "var(--teal)" : "transparent", color: selectedCategory === c ? "white" : "var(--dark)" }} onClick={() => setSelectedCategory(c)}>
                {c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}
                <span style={styles.filterCount}>({c === "all" ? allProducts.length : allProducts.filter(p=>p.category===c).length})</span>
              </button>
            ))}
          </div>

          <div style={styles.filterGroup}>
            <h3 style={styles.filterTitle}>Store</h3>
            {["all","own","amazon","shein","temu","alibaba"].map(s => (
              <button key={s} style={{ ...styles.filterBtn, background: selectedStore === s ? "var(--teal)" : "transparent", color: selectedStore === s ? "white" : "var(--dark)" }} onClick={() => setSelectedStore(s)}>
                {s === "all" ? "All Stores" : s === "own" ? "🌴 B-COM" : s.charAt(0).toUpperCase() + s.slice(1)}
                <span style={styles.filterCount}>({s === "all" ? allProducts.length : allProducts.filter(p=>p.store===s).length})</span>
              </button>
            ))}
          </div>

          <div style={styles.externalStoreBox}>
            <h3 style={styles.filterTitle}>🌐 Global Stores</h3>
            <p style={styles.externalStoreText}>Browse & order directly from international retailers</p>
            {[
              { name:"Amazon", url: STORE_LINKS.amazon, color:"#FF9900", emoji:"📦" },
              { name:"Shein", url: STORE_LINKS.shein, color:"#e74c3c", emoji:"👘" },
              { name:"Temu", url: STORE_LINKS.temu, color:"#e67e22", emoji:"🛒" },
              { name:"Alibaba", url: STORE_LINKS.alibaba, color:"#FF6A00", emoji:"🏪" },
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{ ...styles.externalStoreLink, borderColor: s.color }}>
                <span>{s.emoji} {s.name}</span>
                <span style={{ color: s.color }}>→</span>
              </a>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        <div style={styles.shopProducts}>
          <div style={styles.shopResultsBar}>
            <span>{products.length} products found</span>
          </div>
          {products.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize:"4rem" }}>🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div style={styles.productGrid}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} setSelectedProduct={setSelectedProduct} setPage={setPage} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT CARD
// ============================================================
  function ProductCard({ product, addToCart: _addToCart, wishlist, toggleWishlist, setSelectedProduct, setPage }) {
  const isExternal = (product.external_store || product.store) !== "own";
  const storeColor = STORE_COLORS[product.external_store || product.store] || "var(--teal)";

  const handleAction = () => {
    if (isExternal) {
      window.open(STORE_LINKS[product.store], "_blank");
    } else {
      setSelectedProduct(product);
      setPage("product");
    }
  };

  return (
    <div style={styles.productCard}>
      <div style={styles.productImageWrap} onClick={handleAction}>
        <div style={{ ...styles.productImage, background: product.images ? "transparent" : `linear-gradient(135deg, ${storeColor}22, ${storeColor}44)` }}>
          <span style={styles.productEmoji}>{product.images ? <img src={product.images} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"12px"}} /> : "🛍️"}</span>
        </div>
        {product.featured && <span style={styles.featuredBadge}>⭐ Featured</span>}
        {(product.stock_qty ?? product.stock ?? 0) === 0 && <div style={styles.outOfStock}>Out of Stock</div>}
      </div>

      <div style={styles.productInfo}>
        <div style={styles.productBrand}>{product.brand}</div>
        <h3 style={styles.productName} onClick={handleAction}>{product.name}</h3>
        <div style={styles.productRating}>
          {"★".repeat(Math.round(product.rating))}{"☆".repeat(5-Math.round(product.rating))}
          <span style={styles.productReviews}>({product.reviews})</span>
        </div>
        <div style={styles.productPriceRow}>
          <span style={styles.productPrice}>BZ$ {parseFloat(product.price_bzd || product.price || 0).toFixed(2)}</span>
          
        </div>

        <div style={styles.productActions}>
          <button
            style={{ 
              ...styles.addToCartBtn, 
              background: "var(--teal)",
              opacity: (product.stock_qty ?? product.stock ?? 0) === 0 ? 0.5 : 1,
              flex: 1
            }}
            onClick={() => _addToCart && _addToCart(product, 
              (product.sizes ? JSON.parse(product.sizes)[0] : "One Size"), 
              (product.colors ? JSON.parse(product.colors)[0] : "Default")
            )}
            disabled={(product.stock_qty ?? product.stock ?? 0) === 0}
          >
            {(product.stock_qty ?? product.stock ?? 0) === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <button
            style={{ 
              ...styles.addToCartBtn, 
              background: "var(--dark)",
              flex: 1
            }}
            onClick={() => {
              _addToCart && _addToCart(product,
                (product.sizes ? JSON.parse(product.sizes)[0] : "One Size"),
                (product.colors ? JSON.parse(product.colors)[0] : "Default")
              );
              setPage("checkout");
            }}
            disabled={(product.stock_qty ?? product.stock ?? 0) === 0}
          >
              Buy Now
          </button>
          <button 
  style={{ 
    ...styles.wishlistBtn,
    background: wishlist.includes(product.id) ? "#fff0f2" : "#f5f5f5",
    color: wishlist.includes(product.id) ? "var(--rose)" : "var(--muted)",
    border: wishlist.includes(product.id) ? "1.5px solid var(--rose)" : "1.5px solid #ddd",
    borderRadius: 10,
    padding: "8px 10px",
    fontSize: "0.75rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 4,
    whiteSpace: "nowrap"
  }} 
  onClick={() => toggleWishlist(product.id)}
>
  {wishlist.includes(product.id) ? "♥ Saved" : "♡ Save"}
</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT DETAIL PAGE
// ============================================================
function ProductPage({ product, addToCart, wishlist, toggleWishlist, setPage, relatedProducts, setSelectedProduct }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  return (
    <div style={styles.productPage}>
      <button style={styles.backBtn} onClick={() => setPage("shop")}>← Back to Shop</button>

      <div style={styles.productPageLayout}>
        <div style={styles.productPageImage}>
          <div style={{ ...styles.productPageEmoji, background: `linear-gradient(135deg, var(--teal-light), var(--sand))` }}>
            {product.image}
          </div>
        </div>

        <div style={styles.productPageInfo}>
          <span style={styles.productBrand}>{product.brand}</span>
          <h1 style={styles.productPageTitle}>{product.name}</h1>
          <div style={styles.productRating}>
            {"★".repeat(Math.round(product.rating))}
            <span style={styles.productReviews}>{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div style={styles.productPagePrice}>
            <span style={styles.productPagePriceBzd}>BZ$ {parseFloat(product.price_bzd || product.price || 0).toFixed(2)}</span>
            </div>

          <div style={styles.optionGroup}>
            <label style={styles.optionLabel}>Size</label>
            <div style={styles.optionBtns}>
              {product.sizes.map(s => (
                <button key={s} style={{ ...styles.optionBtn, background: selectedSize === s ? "var(--teal)" : "white", color: selectedSize === s ? "white" : "var(--dark)", borderColor: selectedSize === s ? "var(--teal)" : "#ddd" }} onClick={() => setSelectedSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div style={styles.optionGroup}>
            <label style={styles.optionLabel}>Color</label>
            <div style={styles.optionBtns}>
              {product.colors.map(c => (
                <button key={c} style={{ ...styles.optionBtn, background: selectedColor === c ? "var(--teal)" : "white", color: selectedColor === c ? "white" : "var(--dark)", borderColor: selectedColor === c ? "var(--teal)" : "#ddd" }} onClick={() => setSelectedColor(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div style={styles.qtyRow}>
            <button style={styles.qtyBtn} onClick={() => setQty(Math.max(1,qty-1))}>-</button>
            <span style={styles.qtyNum}>{qty}</span>
            <button style={styles.qtyBtn} onClick={() => setQty(qty+1)}>+</button>
          </div>

          <div style={styles.productPageActions}>
            <button style={styles.btnPrimary} onClick={() => addToCart(product, selectedSize, selectedColor)}>Add to Cart 🛍️</button>
            <button style={{ ...styles.wishlistBtn, fontSize:"1.5rem" }} onClick={() => toggleWishlist(product.id)}>
              {wishlist.includes(product.id) ? "❤️" : "🤍"}
            </button>
          </div>

          <div style={styles.productMeta}>
            <div style={styles.metaItem}><span>📦</span> In stock: {product.stock} units</div>
            <div style={styles.metaItem}><span>🚚</span> Free delivery in Belize City</div>
            <div style={styles.metaItem}><span>🔒</span> Secure payment via Belize Bank / Atlantic Bank</div>
            <div style={styles.metaItem}><span>↩️</span> 30-day returns</div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div style={{ marginTop:"3rem" }}>
          <h2 style={styles.sectionTitle}>Related Products</h2>
          <div style={styles.productGrid}>
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} setSelectedProduct={setSelectedProduct} setPage={setPage} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CART DRAWER
// ============================================================
function CartDrawer({ cart, cartTotal, removeFromCart, setCartOpen, setPage }) {
  return (
    <div style={styles.cartOverlay} onClick={() => setCartOpen(false)}>
      <div style={styles.cartDrawer} onClick={e => e.stopPropagation()}>
        <div style={styles.cartHeader}>
          <h2 style={styles.cartTitle}>Your Cart 🛍️</h2>
          <button style={styles.closeBtn} onClick={() => setCartOpen(false)}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div style={styles.cartEmpty}>
            <div style={{ fontSize:"4rem" }}>🛒</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div style={styles.cartItems}>
              {cart.map((item, i) => (
                <div key={i} style={styles.cartItem}>
                  <div style={styles.cartItemEmoji}>{item.image}</div>
                  <div style={styles.cartItemInfo}>
                    <div style={styles.cartItemName}>{item.name}</div>
                    <div style={styles.cartItemMeta}>{item.size} · {item.color} · ×{item.qty}</div>
                    <div style={styles.cartItemPrice}>BZ$ {(parseFloat(item.price_bzd || item.price || 0) * item.qty).toFixed(2)}</div>
                  </div>
                  <button style={styles.removeBtn} onClick={() => removeFromCart(item.id, item.size, item.color)}>✕</button>
                </div>
              ))}
            </div>
            <div style={styles.cartFooter}>
              <div style={styles.cartTotal}>
                <span>Total</span>
                <span>BZ$ {cartTotal.toFixed(2)}</span>
              </div>
              <button style={styles.btnPrimary} onClick={() => { setCartOpen(false); setPage("checkout"); }}>
                Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CHECKOUT PAGE
// ============================================================
function CheckoutPage({ cart, cartTotal, checkoutStep, setCheckoutStep, paymentMethod, setPaymentMethod, orderPlaced, setOrderPlaced, setCart, showNotification }) {
  const [orderRef] = useState(() => "Order #BCM-" + String(Date.now()).slice(-5));
  const [form, setForm] = useState({ name:"", email:"", phone:"", address:"", district:"Belize" });
  const tax = cartTotal * 0.125;
  const shipping = cartTotal > 200 ? 0 : 15;
  const total = cartTotal + tax + shipping;

  const placeOrder = () => {
    setOrderPlaced(true);
    setCart([]);
    showNotification("🎉 Order placed successfully!");
  };

  if (orderPlaced) {
    return (
      <div style={styles.orderSuccess}>
        <div style={styles.orderSuccessIcon}>🎉</div>
        <h1 style={styles.orderSuccessTitle}>Order Confirmed!</h1>
        <p style={styles.orderSuccessText}>Thank you for shopping with B-COM! Your order has been received and payment is being processed through {paymentMethod}.</p>
        <div style={styles.orderRef}>{orderRef}</div>
        <p style={{ color:"var(--muted)", marginTop:"1rem" }}>A confirmation email will be sent to {form.email || "your email"}</p>
      </div>
    );
  }

  const PAYMENT_METHODS = [
    { id:"belize_bank_card", label:"Belize Bank – Credit/Debit Card", icon:"💳", desc:"Visa & Mastercard via Belize Bank hosted gateway. 3-D Secure enabled.", badge:"Recommended" },
    { id:"atlantic_bank_card", label:"Atlantic Bank – Credit/Debit Card", icon:"💳", desc:"Secure card processing via Atlantic Bank. CVV2 authentication.", badge:"" },
    { id:"belize_bank_transfer", label:"Belize Bank – Online Transfer", icon:"🏦", desc:"Direct bank-to-bank transfer via Belize Bank Online Banking.", badge:"" },
    { id:"atlantic_bank_transfer", label:"Atlantic Bank – Online Transfer", icon:"🏦", desc:"Transfer via Atlantic Bank Corporate Online Banking.", badge:"" },
    { id:"paypal", label:"PayPal", icon:"🌐", desc:"Pay securely with your PayPal account or linked card.", badge:"Global" },
    { id:"stripe", label:"Stripe", icon:"💸", desc:"International card processing. Supports Apple Pay, Google Pay.", badge:"" },
    { id:"cash_delivery", label:"Cash on Delivery", icon:"💵", desc:"Pay when your order arrives. Available in Belize City & San Pedro.", badge:"" },
  ];

  return (
    <div style={styles.checkoutPage}>
      <h1 style={styles.shopTitle}>Checkout</h1>

      <div style={styles.checkoutSteps}>
        {["Shipping","Payment","Review"].map((s,i) => (
          <div key={s} style={styles.checkoutStep}>
            <div style={{ ...styles.stepNum, background: checkoutStep > i ? "var(--teal)" : checkoutStep === i+1 ? "var(--dark)" : "#ddd", color: checkoutStep >= i+1 ? "white" : "#999" }}>{i+1}</div>
            <span style={{ color: checkoutStep === i+1 ? "var(--dark)" : "#999" }}>{s}</span>
          </div>
        ))}
      </div>

      <div style={styles.checkoutLayout}>
        <div style={styles.checkoutMain}>
          {checkoutStep === 1 && (
            <div style={styles.checkoutCard}>
              <h2 style={styles.checkoutCardTitle}>Shipping Information</h2>
              {[["Full Name","name","text"],["Email Address","email","email"],["Phone Number","phone","tel"]].map(([label,field,type]) => (
                <div key={field} style={styles.formGroup}>
                  <label style={styles.formLabel}>{label}</label>
                  <input style={styles.formInput} type={type} value={form[field]} onChange={e => setForm({...form,[field]:e.target.value})} placeholder={label} />
                </div>
              ))}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>District</label>
                <select style={styles.formInput} value={form.district} onChange={e => setForm({...form,district:e.target.value})}>
                  {["Belize","Cayo","Corozal","Orange Walk","Stann Creek","Toledo"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Delivery Address</label>
                <textarea style={{ ...styles.formInput, height:80 }} value={form.address} onChange={e => setForm({...form,address:e.target.value})} placeholder="Street address, village, town..." />
              </div>
              <button style={styles.btnPrimary} onClick={() => setCheckoutStep(2)}>Continue to Payment →</button>
            </div>
          )}

          {checkoutStep === 2 && (
            <div style={styles.checkoutCard}>
              <h2 style={styles.checkoutCardTitle}>Select Payment Method</h2>
              <div style={styles.belizeNote}>
                BZ All Belizean bank integrations follow Central Bank of Belize guidelines. Transactions are PCI-DSS compliant with 3-D Secure authentication where applicable.
              </div>
              {PAYMENT_METHODS.map(pm => (
                <div key={pm.id} style={{ ...styles.paymentOption, borderColor: paymentMethod === pm.id ? "var(--teal)" : "#e0d9cc", background: paymentMethod === pm.id ? "var(--teal-light)" : "white" }} onClick={() => setPaymentMethod(pm.id)}>
                  <div style={styles.paymentOptionLeft}>
                    <span style={styles.paymentRadio}>{paymentMethod === pm.id ? "🔵" : "⚪"}</span>
                    <div>
                      <div style={styles.paymentOptionLabel}>{pm.icon} {pm.label} {pm.badge && <span style={styles.paymentBadge}>{pm.badge}</span>}</div>
                      <div style={styles.paymentOptionDesc}>{pm.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ display:"flex", gap:"1rem", marginTop:"1.5rem" }}>
                <button style={styles.btnSecondary} onClick={() => setCheckoutStep(1)}>← Back</button>
                <button style={{ ...styles.btnPrimary, opacity: paymentMethod ? 1 : 0.5 }} disabled={!paymentMethod} onClick={() => setCheckoutStep(3)}>Review Order →</button>
              </div>
            </div>
          )}

          {checkoutStep === 3 && (
            <div style={styles.checkoutCard}>
              <h2 style={styles.checkoutCardTitle}>Review & Place Order</h2>
              <div style={styles.reviewSection}>
                <h3 style={styles.reviewLabel}>📦 Items ({cart.length})</h3>
                {cart.map((item,i) => (
                  <div key={i} style={styles.reviewItem}>
                    <span>{item.image} {item.name} ({item.size}, {item.color}) ×{item.qty}</span>
                    <span>BZ$ {(item.price*item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={styles.reviewSection}>
                <h3 style={styles.reviewLabel}>🚚 Shipping to {form.district || "Belize"}</h3>
                <div style={styles.reviewItem}><span>Shipping fee</span><span>{shipping === 0 ? "FREE" : `BZ$ ${shipping.toFixed(2)}`}</span></div>
                <div style={styles.reviewItem}><span>GST (12.5%)</span><span>BZ$ {tax.toFixed(2)}</span></div>
                <div style={{ ...styles.reviewItem, fontWeight:700, fontSize:"1.1rem" }}><span>Total</span><span>BZ$ {total.toFixed(2)}</span></div>
              </div>
              <div style={styles.reviewSection}>
                <h3 style={styles.reviewLabel}>💳 Payment via {paymentMethod.replace(/_/g," ").toUpperCase()}</h3>
              </div>
              <div style={{ display:"flex", gap:"1rem" }}>
                <button style={styles.btnSecondary} onClick={() => setCheckoutStep(2)}>← Back</button>
                <button style={styles.btnPrimary} onClick={placeOrder}>Place Order ✓</button>
              </div>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div style={styles.orderSummary}>
          <h3 style={styles.checkoutCardTitle}>Order Summary</h3>
          {cart.map((item,i) => (
            <div key={i} style={styles.summaryItem}>
              <span>{item.image} {item.name.slice(0,20)}...</span>
              <span>BZ$ {(item.price*item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.summaryDivider}/>
          <div style={styles.summaryItem}><span>Subtotal</span><span>BZ$ {cartTotal.toFixed(2)}</span></div>
          <div style={styles.summaryItem}><span>Shipping</span><span>{shipping === 0 ? "FREE" : `BZ$ ${shipping.toFixed(2)}`}</span></div>
          <div style={styles.summaryItem}><span>GST</span><span>BZ$ {tax.toFixed(2)}</span></div>
          <div style={{ ...styles.summaryItem, fontWeight:700, color:"var(--teal)", fontSize:"1.1rem" }}>
            <span>Total</span><span>BZ$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MARKETPLACE PAGE
// ============================================================
function MarketplacePage({ sellerTab, setSellerTab, showNotification }) {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const SELLERS = [
    { name:"Belizean Threads Co.", store:"BZ Threads", products:34, rating:4.8, badge:"Top Seller", emoji:"🧵" },
    { name:"Caribbean Kicks", store:"CaribbeanKicks", products:21, rating:4.7, badge:"Verified", emoji:"👟" },
    { name:"Sea & Sun Accessories", store:"SeaSunAcc", products:57, rating:4.9, badge:"Top Seller", emoji:"🌊" },
    { name:"Corozal Crafts", store:"CorozalCrafts", products:15, rating:4.5, badge:"New", emoji:"🎨" },
  ];

  return (
    <div style={styles.checkoutPage}>
      <h1 style={styles.shopTitle}>🏪 B-COM Marketplace</h1>
      <p style={styles.shopSubtitle}>Connect with local Belizean sellers and discover unique, handcrafted fashion</p>

      <div style={styles.tabBar}>
        {["browse","register","sellers"].map(t => (
          <button key={t} style={{ ...styles.tab, background: sellerTab === t ? "var(--teal)" : "transparent", color: sellerTab === t ? "white" : "var(--dark)" }} onClick={() => setSellerTab(t)}>
            {t === "browse" ? "🛍️ Browse" : t === "register" ? "➕ Become a Seller" : "👥 Our Sellers"}
          </button>
        ))}
      </div>

      {sellerTab === "browse" && (
        <div>
          <div style={styles.marketplaceBenefits}>
            {[
              { emoji:"🌴", title:"Local First", desc:"Support Belizean entrepreneurs and artisans" },
              { emoji:"🔒", title:"Verified Sellers", desc:"All sellers are vetted and KYC-approved" },
              { emoji:"💳", title:"Secure Payments", desc:"Pay via Belize Bank, Atlantic Bank or PayPal" },
              { emoji:"📦", title:"Island Delivery", desc:"Nationwide delivery to all 6 districts" },
            ].map(b => (
              <div key={b.title} style={styles.benefitCard}>
                <div style={styles.benefitEmoji}>{b.emoji}</div>
                <h3 style={styles.benefitTitle}>{b.title}</h3>
                <p style={styles.benefitDesc}>{b.desc}</p>
              </div>
            ))}
          </div>

          <h2 style={styles.sectionTitle}>Featured Stores</h2>
          <div style={styles.sellerGrid}>
            {SELLERS.map(s => (
              <div key={s.name} style={styles.sellerCard}>
                <div style={styles.sellerEmoji}>{s.emoji}</div>
                <div style={styles.sellerBadge}>{s.badge}</div>
                <h3 style={styles.sellerName}>{s.store}</h3>
                <p style={styles.sellerOwner}>{s.name}</p>
                <div style={styles.sellerStats}>
                  <span>{s.products} products</span>
                  <span>★ {s.rating}</span>
                </div>
                <button style={styles.btnPrimary}>Visit Store →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {sellerTab === "register" && !formSubmitted && (
        <div style={styles.checkoutCard}>
          <h2 style={styles.checkoutCardTitle}>Register as a Seller</h2>
          <div style={styles.belizeNote}>
            📋 To comply with Belize's Financial Intelligence Unit (FIU) and KYC requirements, we'll need to verify your identity before approving your seller account.
          </div>
          <div style={styles.twoCol}>
            {[["Store Name","text"],["Owner Full Name","text"],["Email","email"],["Phone","tel"],["Belize Tax ID (GST/BT)","text"],["Business Address","text"]].map(([l,t]) => (
              <div key={l} style={styles.formGroup}>
                <label style={styles.formLabel}>{l}</label>
                <input style={styles.formInput} type={t} placeholder={l} />
              </div>
            ))}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Bank for Payments</label>
            <select style={styles.formInput}>
              <option>Belize Bank – Direct Deposit</option>
              <option>Atlantic Bank – Direct Deposit</option>
              <option>PayPal</option>
              <option>Bank of Belize</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Product Categories</label>
            <div style={styles.checkboxRow}>
              {["Clothing","Shoes","Accessories","Handmade","Vintage"].map(c => (
                <label key={c} style={styles.checkboxLabel}><input type="checkbox" /> {c}</label>
              ))}
            </div>
          </div>
          <div style={styles.commissionBox}>
            <h3>💰 Commission Structure</h3>
            <p>B-COM charges a <strong>10% commission</strong> on each sale. Payments are settled weekly directly to your bank account.</p>
          </div>
          <button style={styles.btnPrimary} onClick={() => { setFormSubmitted(true); showNotification("Application submitted! We'll review within 48 hours ✅"); }}>
            Submit Application →
          </button>
        </div>
      )}

      {sellerTab === "register" && formSubmitted && (
        <div style={styles.orderSuccess}>
          <div style={styles.orderSuccessIcon}>✅</div>
          <h2 style={styles.orderSuccessTitle}>Application Submitted!</h2>
          <p>We'll review your application within 48 hours. Once approved, you'll receive an email with access to your Seller Dashboard.</p>
        </div>
      )}

      {sellerTab === "sellers" && (
        <div style={styles.sellerGrid}>
          {SELLERS.map(s => (
            <div key={s.name} style={styles.sellerCard}>
              <div style={styles.sellerEmoji}>{s.emoji}</div>
              <div style={styles.sellerBadge}>{s.badge}</div>
              <h3 style={styles.sellerName}>{s.store}</h3>
              <p style={styles.sellerOwner}>{s.name}</p>
              <div style={styles.sellerStats}>
                <span>{s.products} products</span>
                <span>★ {s.rating}</span>
              </div>
              <button style={styles.btnPrimary}>Visit Store →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAYMENT INFO PAGE
// ============================================================
function PaymentInfoPage() {
  return (
    <div style={styles.checkoutPage}>
      <h1 style={styles.shopTitle}>💳 Payment Methods</h1>
      <p style={styles.shopSubtitle}>B-COM supports multiple secure payment options tailored for Belize's banking ecosystem</p>

      <div style={styles.paymentInfoGrid}>
        <div style={styles.paymentInfoCard}>
          <div style={styles.paymentInfoIcon}>🏦</div>
          <h2 style={styles.paymentInfoTitle}>Belize Bank</h2>
          <div style={styles.paymentInfoBadge}>Official Partner</div>
          <ul style={styles.paymentInfoList}>
            <li>✅ Hosted Payment Page (hosted gateway concept)</li>
            <li>✅ Visa & Mastercard credit/debit cards</li>
            <li>✅ 3-D Secure authentication</li>
            <li>✅ Test environment available for integration</li>
            <li>✅ Internet Merchant Account required</li>
            <li>✅ Transactions in BZD</li>
            <li>✅ Online Bill Pay (register as Payee)</li>
            <li>✅ Over-the-counter Collections</li>
          </ul>
          <div style={styles.techBox}>
            <code>POST {"{payment-url}"}/charge</code><br/>
            <code>Integration: Hosted Payment Page</code><br/>
            <code>Auth: Merchant ID + Secret Key</code>
          </div>
        </div>

        <div style={styles.paymentInfoCard}>
          <div style={styles.paymentInfoIcon}>🏦</div>
          <h2 style={styles.paymentInfoTitle}>Atlantic Bank</h2>
          <div style={styles.paymentInfoBadge}>Official Partner</div>
          <ul style={styles.paymentInfoList}>
            <li>✅ Secure hosted payment gateway</li>
            <li>✅ Visa & Mastercard processing</li>
            <li>✅ CVV2 cardholder authentication</li>
            <li>✅ Fraud screening tools included</li>
            <li>✅ Unlimited concurrent users</li>
            <li>✅ BZD configuration</li>
            <li>✅ POS module via Corporate Online</li>
            <li>✅ Requires Atlantic Bank Corporate Online</li>
          </ul>
          <div style={styles.techBox}>
            <code>Requires: Website + Email</code><br/>
            <code>Requires: Checking account (Atlantic)</code><br/>
            <code>Support: No installation fees</code>
          </div>
        </div>

        <div style={styles.paymentInfoCard}>
          <div style={styles.paymentInfoIcon}>🌐</div>
          <h2 style={styles.paymentInfoTitle}>PayPal</h2>
          <div style={{ ...styles.paymentInfoBadge, background:"#003087" }}>Global</div>
          <ul style={styles.paymentInfoList}>
            <li>✅ Credit cards, debit cards, PayPal balance</li>
            <li>✅ Buyer & seller protection</li>
            <li>✅ Used widely in Belize</li>
            <li>✅ Multi-currency support</li>
            <li>✅ Easy REST API integration</li>
            <li>✅ Mobile-friendly checkout</li>
          </ul>
          <div style={styles.techBox}>
            <code>API: PayPal REST API v2</code><br/>
            <code>Endpoint: /v2/checkout/orders</code><br/>
            <code>SDK: @paypal/checkout-server-sdk</code>
          </div>
        </div>

        <div style={styles.paymentInfoCard}>
          <div style={styles.paymentInfoIcon}>💸</div>
          <h2 style={styles.paymentInfoTitle}>Stripe</h2>
          <div style={{ ...styles.paymentInfoBadge, background:"#635BFF" }}>International</div>
          <ul style={styles.paymentInfoList}>
            <li>✅ Credit & debit cards worldwide</li>
            <li>✅ Apple Pay & Google Pay</li>
            <li>✅ Advanced fraud detection</li>
            <li>✅ Subscription billing support</li>
            <li>✅ Webhooks for order confirmation</li>
            <li>⚠️ Note: May require US/UK business entity</li>
          </ul>
          <div style={styles.techBox}>
            <code>API: Stripe Payment Intents</code><br/>
            <code>Endpoint: /v1/payment_intents</code><br/>
            <code>SDK: stripe-node / stripe-js</code>
          </div>
        </div>
      </div>

      <div style={styles.belizeNote}>
        <strong>BZ Belize Regulatory Note:</strong> All card-based payment integrations must comply with the Central Bank of Belize's guidelines on foreign exchange and electronic payments. Merchants must hold an Internet Merchant Account with their respective bank. KYC/AML procedures apply. For online bank transfers, customers must have Corporate Online Banking enabled. GST (12.5%) applies to all transactions.
      </div>

      <div style={styles.transferBox}>
        <h2 style={styles.transferTitle}>🔄 Online Bank Transfer Guide</h2>
        <div style={styles.transferSteps}>
          {[
            { step:"1", title:"Customer selects Transfer", desc:"At checkout, customer chooses Belize Bank or Atlantic Bank online transfer" },
            { step:"2", title:"Transfer Reference Generated", desc:"System generates a unique payment reference code (TRP-XXXXXX)" },
            { step:"3", title:"Customer Logs into Online Banking", desc:"Customer visits their bank's online portal and initiates transfer to Tropika's account" },
            { step:"4", title:"Payment Confirmation", desc:"Bank webhook notifies Tropika system. Order is confirmed automatically." },
            { step:"5", title:"Order Processing", desc:"Order moves to 'paid' status and is dispatched for fulfillment" },
          ].map(s => (
            <div key={s.step} style={styles.transferStep}>
              <div style={styles.transferStepNum}>{s.step}</div>
              <div>
                <strong>{s.title}</strong>
                <p style={{ margin:0, color:"var(--muted)", fontSize:"0.85rem" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DATABASE PAGE
// ============================================================
function DatabasePage({ dbTab, setDbTab }) {
  return (
    <div style={styles.checkoutPage}>
      <h1 style={styles.shopTitle}>🗄️ Database Architecture</h1>
      <p style={styles.shopSubtitle}>B-COM's data model — PostgreSQL-compatible schema designed for scalability</p>

      <div style={styles.tabBar}>
        {["schema","erd","sample"].map(t => (
          <button key={t} style={{ ...styles.tab, background: dbTab === t ? "var(--dark)" : "transparent", color: dbTab === t ? "white" : "var(--dark)" }} onClick={() => setDbTab(t)}>
            {t === "schema" ? "📋 SQL Schema" : t === "erd" ? "🗺️ Entity Diagram" : "📊 Sample Data"}
          </button>
        ))}
      </div>

      {dbTab === "schema" && (
        <div style={styles.schemaWrap}>
          <pre style={styles.schemaCode}>{DB_SCHEMA}</pre>
        </div>
      )}

      {dbTab === "erd" && (
        <div style={styles.erdWrap}>
          {[
            { name:"customers", color:"#2ecc71", fields:["id","name","email","phone","address","district"] },
            { name:"sellers", color:"#3498db", fields:["id","store_name","owner_name","email","status","commission_pct","bank_name"] },
            { name:"categories", color:"#9b59b6", fields:["id","name","slug","parent_id","image_url"] },
            { name:"products", color:"#e67e22", fields:["id","seller_id →","category_id →","name","price_bzd","stock_qty","external_store","is_active"] },
            { name:"orders", color:"#e74c3c", fields:["id","customer_id →","status","total_bzd","payment_method","shipping_address"] },
            { name:"order_items", color:"#1abc9c", fields:["id","order_id →","product_id →","qty","unit_price","size","color"] },
            { name:"payments", color:"#f39c12", fields:["id","order_id →","gateway","transaction_ref","amount_bzd","status"] },
          ].map(t => (
            <div key={t.name} style={{ ...styles.erdTable, borderColor: t.color }}>
              <div style={{ ...styles.erdTableHeader, background: t.color }}>{t.name.toUpperCase()}</div>
              {t.fields.map(f => <div key={f} style={styles.erdField}>{f.includes("→") ? <span style={{ color: t.color }}>🔗 {f}</span> : f}</div>)}
            </div>
          ))}
        </div>
      )}

      {dbTab === "sample" && (
        <div>
          <h3 style={styles.sectionTitle}>Sample Products Data</h3>
          <div style={{ overflowX:"auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>{["ID","Name","Category","Price BZD","Stock","Store","Rating"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {PRODUCTS.map(p => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>{p.id}</td>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>{p.category}</td>
                    <td style={styles.td}>BZ$ {p.price}</td>
                    <td style={styles.td}>{p.stock}</td>
                    <td style={{ ...styles.td, color: STORE_COLORS[p.store] }}>{p.store}</td>
                    <td style={styles.td}>★ {p.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function AdminPage({ adminTab, setAdminTab, products }) {
  const stats = [
    { label:"Total Revenue", value:"BZ$ 48,291", trend:"+12.4%", emoji:"💰" },
    { label:"Orders Today", value:"47", trend:"+8 vs yesterday", emoji:"📦" },
    { label:"Active Sellers", value:"23", trend:"+3 new", emoji:"🏪" },
    { label:"Products Listed", value:products.length, trend:"", emoji:"👗" },
  ];

  return (
    <div style={styles.checkoutPage}>
      <h1 style={styles.shopTitle}>⚙️ Admin Dashboard</h1>

      <div style={styles.tabBar}>
        {["overview","orders","sellers","products"].map(t => (
          <button key={t} style={{ ...styles.tab, background: adminTab === t ? "var(--dark)" : "transparent", color: adminTab === t ? "white" : "var(--dark)" }} onClick={() => setAdminTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {adminTab === "overview" && (
        <div>
          <div style={styles.statsGrid}>
            {stats.map(s => (
              <div key={s.label} style={styles.statCard}>
                <div style={styles.statEmoji}>{s.emoji}</div>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
                {s.trend && <div style={styles.statTrend}>{s.trend}</div>}
              </div>
            ))}
          </div>

          <div style={styles.adminRow}>
            <div style={styles.adminCard}>
              <h3 style={styles.adminCardTitle}>Recent Orders</h3>
              {[
                { ref:"TRP-10234", customer:"Maria Lopez", total:"BZ$ 289.99", status:"paid", method:"Belize Bank Card" },
                { ref:"TRP-10233", customer:"John Usher", total:"BZ$ 149.50", status:"delivered", method:"PayPal" },
                { ref:"TRP-10232", customer:"Sandra Chan", total:"BZ$ 520.00", status:"processing", method:"Atlantic Bank Transfer" },
                { ref:"TRP-10231", customer:"Roy Smith", total:"BZ$ 79.99", status:"pending", method:"Cash on Delivery" },
              ].map(o => (
                <div key={o.ref} style={styles.orderRow}>
                  <div>
                    <div style={styles.orderRef2}>{o.ref}</div>
                    <div style={styles.orderCustomer}>{o.customer} · {o.method}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={styles.orderTotal}>{o.total}</div>
                    <div style={{ ...styles.statusBadge, background: o.status==="paid"?"var(--teal)":o.status==="delivered"?"#2ecc71":o.status==="processing"?"#f39c12":"#e74c3c" }}>{o.status}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.adminCard}>
              <h3 style={styles.adminCardTitle}>Payment Methods Breakdown</h3>
              {[
                { method:"Belize Bank Card", pct:42, color:"var(--teal)" },
                { method:"Atlantic Bank Card", pct:23, color:"#3498db" },
                { method:"PayPal", pct:18, color:"#003087" },
                { method:"Online Transfer", pct:11, color:"#9b59b6" },
                { method:"Cash on Delivery", pct:6, color:"var(--muted)" },
              ].map(p => (
                <div key={p.method} style={styles.paymentBar}>
                  <span style={styles.paymentBarLabel}>{p.method}</span>
                  <div style={styles.paymentBarTrack}>
                    <div style={{ ...styles.paymentBarFill, width:`${p.pct}%`, background: p.color }}/>
                  </div>
                  <span style={styles.paymentBarPct}>{p.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminTab === "products" && (
        <div style={{ overflowX:"auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>{["","Name","Category","Price","Stock","Store","Status"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={styles.tr}>
                  <td style={styles.td}>{p.image}</td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.category}</td>
                  <td style={styles.td}>BZ$ {p.price}</td>
                  <td style={{ ...styles.td, color: p.stock === 0 ? "var(--rose)" : "inherit" }}>{p.stock === 0 ? "⚠️ Out" : p.stock}</td>
                  <td style={{ ...styles.td, color: STORE_COLORS[p.store] }}>{p.store}</td>
                  <td style={styles.td}><span style={{ ...styles.statusBadge, background: p.stock > 0 ? "var(--teal)" : "var(--rose)" }}>{p.stock > 0 ? "Active" : "OOS"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(adminTab === "orders" || adminTab === "sellers") && (
        <div style={styles.emptyState}>
          <div style={{ fontSize:"3rem" }}>🚧</div>
          <h3>{adminTab === "orders" ? "Orders Management" : "Sellers Management"}</h3>
          <p>Full {adminTab} management panel — connect to your backend API to populate this view.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ setPage }) {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner}>
        <div style={styles.footerBrand}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🌴</span>
            <span style={{ ...styles.logoText, color:"white" }}>B-COM</span>
          </div>
          <p style={styles.footerTagline}>Belize's premier online fashion marketplace — from local artisans to global brands.</p>
        </div>
        <div style={styles.footerLinks}>
          <h4 style={styles.footerLinkTitle}>Shop</h4>
          {["home","shop","marketplace"].map(p => <button key={p} style={styles.footerLink} onClick={() => setPage(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>)}
        </div>
        <div style={styles.footerLinks}>
          <h4 style={styles.footerLinkTitle}>Info</h4>
          {[["payment-info","Payments"],["database","Database"],["admin","Admin"]].map(([p,l]) => <button key={p} style={styles.footerLink} onClick={() => setPage(p)}>{l}</button>)}
        </div>
        <div style={styles.footerLinks}>
          <h4 style={styles.footerLinkTitle}>Contact</h4>
          <span style={styles.footerContact}>📍 Belize City, Belize</span>
          <span style={styles.footerContact}>📧 hello@bcom.bz</span>
          <span style={styles.footerContact}>📱 +501-625-1612</span>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <span>© 2025 Tropika Belize. All rights reserved.</span>
        <span>🔒 PCI-DSS Compliant · BZ Proudly Belizean</span>
      </div>
    </footer>
  );
}

// ============================================================
// STYLES
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --teal: #0d9e8e;
    --teal-light: #e0f5f3;
    --dark: #1a1a2e;
    --sand: #f5e6d3;
    --cream: #ffffff;
    --cream2: #f9f9f9;
    --rose: #e05c6a;
    --orange: #e07830;
    --muted: #7a7060;
    --border: #e0d9cc;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }
  button { cursor: pointer; border: none; font-family: inherit; }
  a { text-decoration: none; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 3px; }
  .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important; }
  .category-card:hover { transform: translateY(-4px); }
`;

const styles = {
  app: { fontFamily:"'DM Sans',sans-serif", background:"#ffffff", color:"var(--dark)", minHeight:"100vh" },
  notification: { position:"fixed", top:80, right:20, zIndex:1000, padding:"12px 24px", borderRadius:12, color:"white", fontWeight:600, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeIn 0.3s ease" },

  // NAV
  nav: { position:"sticky", top:0, zIndex:100, backdropFilter:"blur(12px)", borderBottom:"1px solid var(--border)", transition:"all 0.3s" },
  navInner: { maxWidth:1280, margin:"0 auto", padding:"0 2rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" },
  logo: { display:"flex", alignItems:"baseline", gap:6, cursor:"pointer" },
  logoIcon: { fontSize:"1.5rem" },
  logoText: { fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", fontWeight:900, color:"var(--dark)", letterSpacing:2 },
  logoSub: { fontSize:"0.6rem", letterSpacing:4, color:"var(--teal)", fontWeight:600, textTransform:"uppercase" },
  navLinks: { display:"flex", gap:"0.25rem" },
  navLink: { background:"none", padding:"8px 14px", fontSize:"0.85rem", fontWeight:500, cursor:"pointer", letterSpacing:0.5, transition:"all 0.2s" },
  navActions: { display:"flex", alignItems:"center", gap:"1rem" },
  cartBtn: { position:"relative", background:"none", fontSize:"1.3rem", padding:"6px 10px" },
  cartBadge: { position:"absolute", top:-4, right:-4, background:"var(--rose)", color:"white", borderRadius:"50%", width:18, height:18, fontSize:"0.65rem", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 },

  // HERO
  hero: { position:"relative", minHeight:"90vh", display:"flex", alignItems:"center", overflow:"hidden" },
  heroBg: { position:"absolute", inset:0, background:"#ffffff" },
  heroWave1: { display:"none" },
  heroWave2: { display:"none" },
  heroPattern: { display:"none" },
  heroContent: { position:"relative", zIndex:1, maxWidth:1280, margin:"0 auto", padding:"4rem 2rem", flex:1 },
  heroBadge: { display:"inline-block", background:"var(--teal)", color:"white", padding:"6px 16px", borderRadius:20, fontSize:"0.8rem", fontWeight:600, marginBottom:"1.5rem", letterSpacing:1 },
  heroTitle: { fontFamily:"'Playfair Display',serif", fontSize:"clamp(3rem,6vw,5.5rem)", fontWeight:900, lineHeight:1.05, marginBottom:"1.5rem", color:"var(--dark)" },
  heroAccent: { color:"var(--teal)", position:"relative" },
  heroSubtitle: { fontSize:"1.05rem", color:"var(--muted)", lineHeight:1.7, marginBottom:"2.5rem", maxWidth:520 },
  heroActions: { display:"flex", gap:"1rem", marginBottom:"3rem", flexWrap:"wrap" },
  heroStats: { display:"flex", gap:"2rem", alignItems:"center" },
  heroStat: { display:"flex", flexDirection:"column", gap:2 },
  heroStatDiv: { width:1, height:40, background:"var(--border)" },
  heroVisual: { position:"absolute", right:"5%", top:"50%", transform:"translateY(-50%)", width:300, height:400, display:"none" },
  heroCard: { position:"absolute", background:"white", borderRadius:16, padding:"1rem 1.5rem", boxShadow:"0 8px 32px rgba(0,0,0,0.1)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, transition:"all 0.3s" },
  heroCardEmoji: { fontSize:"2.5rem" },
  heroCardLabel: { fontSize:"0.8rem", fontWeight:600, color:"var(--muted)" },

  // STORES BANNER
  storesBanner: { background:"var(--dark)", padding:"14px 2rem", display:"flex", alignItems:"center", gap:"1.5rem", flexWrap:"wrap" },
  storesBannerLabel: { color:"rgba(255,255,255,0.6)", fontSize:"0.85rem", whiteSpace:"nowrap" },
  storeChip: { padding:"6px 16px", borderRadius:20, border:"1.5px solid", fontSize:"0.85rem", fontWeight:600, cursor:"pointer", transition:"all 0.2s", background:"rgba(255,255,255,0.05)" },

  // SECTIONS
  section: { padding:"5rem 2rem", maxWidth:1280, margin:"0 auto" },
  sectionTitle: { fontFamily:"'Playfair Display',serif", fontSize:"2rem", fontWeight:800, marginBottom:"2.5rem", color:"var(--dark)" },

  // CATEGORIES
  categoryGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.5rem" },
  categoryCard: { background:"white", borderRadius:20, padding:"2.5rem 2rem", textAlign:"center", cursor:"pointer", transition:"all 0.3s", boxShadow:"0 4px 20px rgba(0,0,0,0.05)", border:"1px solid var(--border)" },
  categoryEmoji: { fontSize:"3.5rem", marginBottom:"1rem" },
  categoryLabel: { fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", marginBottom:"0.5rem" },
  categoryDesc: { color:"var(--muted)", fontSize:"0.9rem", marginBottom:"1rem" },
  categoryCount: { background:"var(--teal-light)", color:"var(--teal)", padding:"4px 12px", borderRadius:20, fontSize:"0.8rem", fontWeight:600 },

  // PRODUCT GRID & CARD
  productGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"1.5rem" },
  productCard: { background:"white", borderRadius:16, overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.06)", transition:"all 0.3s", border:"1px solid var(--border)", cursor:"pointer" },
  productImageWrap: { position:"relative", paddingTop:"100%", overflow:"hidden" },
  productImage: { position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", borderRadius:"12px" },
  productEmoji: { fontSize:"5rem" },
  featuredBadge: { position:"absolute", top:10, left:10, background:"#f1c40f", color:"white", padding:"3px 10px", borderRadius:12, fontSize:"0.7rem", fontWeight:700 },
  storeBadge: { position:"absolute", top:10, right:10, color:"white", padding:"3px 10px", borderRadius:12, fontSize:"0.7rem", fontWeight:700 },
  outOfStock: { position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 },
  productInfo: { padding:"1rem" },
  productBrand: { fontSize:"0.72rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, marginBottom:4 },
  productName: { fontWeight:600, fontSize:"0.95rem", marginBottom:"0.4rem", lineHeight:1.3 },
  productRating: { color:"#f1c40f", fontSize:"0.8rem", marginBottom:"0.4rem" },
  productReviews: { color:"var(--muted)", fontSize:"0.75rem", marginLeft:4 },
  productPriceRow: { display:"flex", alignItems:"baseline", gap:8, marginBottom:"0.75rem" },
  productPrice: { fontWeight:700, color:"var(--dark)", fontSize:"1.05rem" },
  productActions: { display:"flex", gap:6, alignItems:"center" },  addToCartBtn: { flex:1, color:"white", padding:"8px 12px", borderRadius:10, fontSize:"0.82rem", fontWeight:600, transition:"all 0.2s" },
  wishlistBtn: { background:"none", fontSize:"1.2rem", padding:"0 4px", transition:"all 0.2s" },

  // PAYMENT STRIP
  paymentStrip: { background:"var(--dark)", padding:"1.5rem 2rem", display:"flex", alignItems:"center", gap:"2rem", flexWrap:"wrap" },
  paymentStripLabel: { color:"rgba(255,255,255,0.7)", fontSize:"0.85rem" },
  paymentIcons: { display:"flex", gap:"1rem", flexWrap:"wrap" },
  paymentIcon: { background:"rgba(255,255,255,0.1)", color:"white", padding:"6px 14px", borderRadius:8, fontSize:"0.82rem" },

  // MARKETPLACE CTA
  marketplaceCta: { background:"linear-gradient(135deg, var(--teal) 0%, #0a6e62 100%)", padding:"5rem 2rem", display:"flex", alignItems:"center", justifyContent:"center", gap:"4rem", flexWrap:"wrap", position:"relative", overflow:"hidden" },
  marketplaceCtaContent: { color:"white", maxWidth:480, position:"relative", zIndex:1 },
  marketplaceCtaTitle: { fontFamily:"'Playfair Display',serif", fontSize:"2.5rem", marginBottom:"1rem" },
  marketplaceCtaText: { fontSize:"1rem", opacity:0.85, lineHeight:1.7, marginBottom:"2rem" },
  marketplaceCtaVisual: { position:"relative", width:200, height:200 },
  mktBubble: { position:"absolute", top:"30%", left:"20%", width:100, height:100, background:"rgba(255,255,255,0.15)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.5rem", backdropFilter:"blur(4px)" },

  // SHOP PAGE
  shopPage: { maxWidth:1280, margin:"0 auto", padding:"2rem" },
  shopHeader: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" },
  shopTitle: { fontFamily:"'Playfair Display',serif", fontSize:"2.2rem", fontWeight:900 },
  shopSubtitle: { color:"var(--muted)", marginBottom:"2rem" },
  searchInput: { border:"2px solid var(--border)", borderRadius:12, padding:"10px 20px", fontSize:"0.9rem", fontFamily:"inherit", background:"white", minWidth:280, outline:"none" },
  shopLayout: { display:"grid", gridTemplateColumns:"260px 1fr", gap:"2rem" },
  shopSidebar: { display:"flex", flexDirection:"column", gap:"1.5rem" },
  filterGroup: { background:"white", borderRadius:16, padding:"1.25rem", border:"1px solid var(--border)" },
  filterTitle: { fontSize:"0.8rem", fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--muted)", marginBottom:"0.75rem" },
  filterBtn: { width:"100%", padding:"8px 12px", borderRadius:8, fontSize:"0.85rem", fontWeight:500, marginBottom:4, textAlign:"left", display:"flex", justifyContent:"space-between", transition:"all 0.2s" },
  filterCount: { color:"var(--muted)", fontSize:"0.75rem" },
  externalStoreBox: { background:"white", borderRadius:16, padding:"1.25rem", border:"1px solid var(--border)" },
  externalStoreText: { fontSize:"0.8rem", color:"var(--muted)", marginBottom:"0.75rem" },
  externalStoreLink: { display:"flex", justifyContent:"space-between", padding:"8px 12px", borderRadius:8, border:"1.5px solid", marginBottom:6, fontSize:"0.85rem", fontWeight:600, transition:"all 0.2s" },
  shopProducts: { flex:1 },
  shopResultsBar: { color:"var(--muted)", fontSize:"0.85rem", marginBottom:"1rem" },
  emptyState: { textAlign:"center", padding:"4rem", color:"var(--muted)" },

  // BUTTONS
  btnPrimary: { background:"var(--teal)", color:"white", padding:"12px 28px", borderRadius:12, fontWeight:600, fontSize:"0.9rem", letterSpacing:0.5, transition:"all 0.2s", cursor:"pointer" },
  btnSecondary: { background:"transparent", color:"var(--dark)", padding:"12px 28px", borderRadius:12, fontWeight:600, fontSize:"0.9rem", border:"2px solid var(--border)", transition:"all 0.2s", cursor:"pointer" },

  // PRODUCT PAGE
  productPage: { maxWidth:1280, margin:"0 auto", padding:"2rem" },
  backBtn: { background:"none", color:"var(--muted)", fontSize:"0.85rem", marginBottom:"2rem", padding:"6px 0" },
  productPageLayout: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", marginBottom:"4rem" },
  productPageImage: { borderRadius:24, overflow:"hidden" },
  productPageEmoji: { width:"100%", paddingTop:"100%", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", borderRadius:24 },
  productPageTitle: { fontFamily:"'Playfair Display',serif", fontSize:"2rem", marginBottom:"0.75rem", marginTop:"0.5rem" },
  productPagePrice: { display:"flex", alignItems:"baseline", gap:12, margin:"1rem 0 1.5rem" },
  productPagePriceBzd: { fontSize:"2rem", fontWeight:800, color:"var(--teal)" },
  optionGroup: { marginBottom:"1.25rem" },
  optionLabel: { display:"block", fontSize:"0.8rem", fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--muted)", marginBottom:"0.5rem" },
  optionBtns: { display:"flex", gap:8, flexWrap:"wrap" },
  optionBtn: { padding:"8px 16px", borderRadius:8, border:"1.5px solid", fontSize:"0.85rem", fontWeight:500, cursor:"pointer", transition:"all 0.2s" },
  qtyRow: { display:"flex", alignItems:"center", gap:16, margin:"1.25rem 0" },
  qtyBtn: { width:36, height:36, borderRadius:"50%", border:"1.5px solid var(--border)", background:"white", fontSize:"1.2rem", display:"flex", alignItems:"center", justifyContent:"center" },
  qtyNum: { fontWeight:700, fontSize:"1.1rem", minWidth:24, textAlign:"center" },
  productPageActions: { display:"flex", gap:12, marginBottom:"1.5rem" },
  productMeta: { background:"var(--cream2)", borderRadius:12, padding:"1rem", display:"flex", flexDirection:"column", gap:8 },
  metaItem: { display:"flex", gap:8, fontSize:"0.85rem", color:"var(--muted)" },

  // CART
  cartOverlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, backdropFilter:"blur(4px)" },
  cartDrawer: { position:"absolute", right:0, top:0, bottom:0, width:400, background:"var(--white)", padding:"1.5rem", display:"flex", flexDirection:"column", overflow:"hidden" },
  cartHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" },
  cartTitle: { fontFamily:"'Playfair Display',serif", fontSize:"1.5rem" },
  closeBtn: { background:"none", fontSize:"1.2rem", color:"var(--muted)" },
  cartEmpty: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"var(--muted)", gap:"1rem" },
  cartItems: { flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:"1rem" },
  cartItem: { display:"flex", gap:"1rem", background:"white", borderRadius:12, padding:"0.75rem" },
  cartItemEmoji: { fontSize:"2.5rem", minWidth:50, textAlign:"center" },
  cartItemInfo: { flex:1 },
  cartItemName: { fontWeight:600, fontSize:"0.9rem" },
  cartItemMeta: { color:"var(--muted)", fontSize:"0.78rem", margin:"2px 0" },
  cartItemPrice: { fontWeight:700, color:"var(--teal)", fontSize:"0.9rem" },
  removeBtn: { background:"none", color:"var(--muted)", fontSize:"0.9rem", alignSelf:"flex-start" },
  cartFooter: { borderTop:"1px solid var(--border)", paddingTop:"1.25rem", marginTop:"1rem" },
  cartTotal: { display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:"1.1rem", marginBottom:"1rem" },

  // CHECKOUT
  checkoutPage: { maxWidth:1100, margin:"0 auto", padding:"2rem" },
  checkoutSteps: { display:"flex", gap:"2rem", marginBottom:"2rem", alignItems:"center" },
  checkoutStep: { display:"flex", alignItems:"center", gap:8, fontSize:"0.9rem", fontWeight:500 },
  stepNum: { width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem", fontWeight:700, transition:"all 0.3s" },
  checkoutLayout: { display:"grid", gridTemplateColumns:"1fr 320px", gap:"2rem" },
  checkoutMain: {},
  checkoutCard: { background:"white", borderRadius:20, padding:"2rem", border:"1px solid var(--border)" },
  checkoutCardTitle: { fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", marginBottom:"1.5rem" },
  formGroup: { marginBottom:"1rem" },
  formLabel: { display:"block", fontSize:"0.8rem", fontWeight:600, color:"var(--muted)", marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 },
  formInput: { width:"100%", border:"1.5px solid var(--border)", borderRadius:10, padding:"10px 14px", fontSize:"0.9rem", fontFamily:"inherit", background:"white", outline:"none", transition:"all 0.2s" },
  twoCol: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" },
  belizeNote: { background:"#e8f5f3", border:"1px solid var(--teal)", borderRadius:10, padding:"12px 16px", fontSize:"0.85rem", color:"var(--dark)", marginBottom:"1.25rem", lineHeight:1.6 },
  paymentOption: { border:"2px solid", borderRadius:12, padding:"1rem", marginBottom:"0.75rem", cursor:"pointer", transition:"all 0.2s" },
  paymentOptionLeft: { display:"flex", gap:12, alignItems:"flex-start" },
  paymentRadio: { fontSize:"1rem", marginTop:2 },
  paymentOptionLabel: { fontWeight:600, fontSize:"0.9rem", marginBottom:2 },
  paymentOptionDesc: { color:"var(--muted)", fontSize:"0.8rem" },
  paymentBadge: { background:"var(--teal)", color:"white", padding:"2px 8px", borderRadius:10, fontSize:"0.68rem", marginLeft:6, fontWeight:600 },
  reviewSection: { background:"var(--cream2)", borderRadius:12, padding:"1rem", marginBottom:"1rem" },
  reviewLabel: { fontSize:"0.85rem", fontWeight:700, marginBottom:"0.5rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:0.5 },
  reviewItem: { display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:"0.9rem" },
  orderSummary: { background:"white", borderRadius:20, padding:"1.5rem", border:"1px solid var(--border)", height:"fit-content", position:"sticky", top:80 },
  summaryItem: { display:"flex", justifyContent:"space-between", padding:"6px 0", fontSize:"0.85rem" },
  summaryDivider: { height:1, background:"var(--border)", margin:"0.75rem 0" },
  orderSuccess: { textAlign:"center", padding:"5rem 2rem" },
  orderSuccessIcon: { fontSize:"5rem", marginBottom:"1rem" },
  orderSuccessTitle: { fontFamily:"'Playfair Display',serif", fontSize:"2.5rem", marginBottom:"1rem" },
  orderSuccessText: { color:"var(--muted)", fontSize:"1rem", lineHeight:1.7, maxWidth:500, margin:"0 auto 1.5rem" },
  orderRef: { background:"var(--teal)", color:"white", display:"inline-block", padding:"8px 24px", borderRadius:12, fontWeight:700, letterSpacing:1 },

  // MARKETPLACE
  tabBar: { display:"flex", gap:8, marginBottom:"2rem", flexWrap:"wrap" },
  tab: { padding:"10px 20px", borderRadius:10, fontSize:"0.9rem", fontWeight:600, border:"1.5px solid var(--border)", transition:"all 0.2s", cursor:"pointer" },
  marketplaceBenefits: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1.5rem", marginBottom:"3rem" },
  benefitCard: { background:"white", borderRadius:16, padding:"1.5rem", border:"1px solid var(--border)", textAlign:"center" },
  benefitEmoji: { fontSize:"2.5rem", marginBottom:"0.75rem" },
  benefitTitle: { fontWeight:700, marginBottom:4 },
  benefitDesc: { color:"var(--muted)", fontSize:"0.85rem" },
  sellerGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"1.5rem" },
  sellerCard: { background:"white", borderRadius:16, padding:"1.5rem", border:"1px solid var(--border)", textAlign:"center", position:"relative" },
  sellerEmoji: { fontSize:"3rem", marginBottom:"0.5rem" },
  sellerBadge: { background:"var(--teal)", color:"white", padding:"3px 12px", borderRadius:20, fontSize:"0.7rem", fontWeight:700, display:"inline-block", marginBottom:"0.5rem" },
  sellerName: { fontWeight:700, fontSize:"1rem", marginBottom:2 },
  sellerOwner: { color:"var(--muted)", fontSize:"0.82rem", marginBottom:"0.75rem" },
  sellerStats: { display:"flex", justifyContent:"space-around", color:"var(--muted)", fontSize:"0.82rem", marginBottom:"1rem" },
  checkboxRow: { display:"flex", gap:"1rem", flexWrap:"wrap" },
  checkboxLabel: { display:"flex", gap:6, fontSize:"0.9rem", cursor:"pointer" },
  commissionBox: { background:"#fff9e6", border:"1px solid #f1c40f", borderRadius:10, padding:"1rem", marginBottom:"1.5rem" },

  // PAYMENT INFO
  paymentInfoGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"1.5rem", marginBottom:"2rem" },
  paymentInfoCard: { background:"white", borderRadius:20, padding:"1.75rem", border:"1px solid var(--border)" },
  paymentInfoIcon: { fontSize:"2.5rem", marginBottom:"0.75rem" },
  paymentInfoTitle: { fontFamily:"'Playfair Display',serif", fontSize:"1.3rem", marginBottom:"0.5rem" },
  paymentInfoBadge: { background:"var(--teal)", color:"white", display:"inline-block", padding:"3px 12px", borderRadius:20, fontSize:"0.72rem", fontWeight:700, marginBottom:"1rem" },
  paymentInfoList: { listStyle:"none", display:"flex", flexDirection:"column", gap:6, marginBottom:"1.25rem" },
  techBox: { background:"var(--dark)", borderRadius:10, padding:"0.75rem 1rem", fontSize:"0.75rem", fontFamily:"monospace", color:"#7effc5", lineHeight:1.7 },
  transferBox: { background:"white", borderRadius:20, padding:"2rem", border:"1px solid var(--border)", marginTop:"2rem" },
  transferTitle: { fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", marginBottom:"1.5rem" },
  transferSteps: { display:"flex", flexDirection:"column", gap:"1rem" },
  transferStep: { display:"flex", gap:"1rem", alignItems:"flex-start" },
  transferStepNum: { width:32, height:32, borderRadius:"50%", background:"var(--teal)", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.9rem", flexShrink:0 },

  // DATABASE
  schemaWrap: { background:"var(--dark)", borderRadius:16, padding:"2rem", overflow:"auto" },
  schemaCode: { color:"#7effc5", fontFamily:"monospace", fontSize:"0.8rem", lineHeight:1.8, whiteSpace:"pre" },
  erdWrap: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1.5rem" },
  erdTable: { background:"white", borderRadius:12, border:"2px solid", overflow:"hidden" },
  erdTableHeader: { padding:"10px 14px", color:"white", fontWeight:700, fontSize:"0.85rem", letterSpacing:1, textTransform:"uppercase" },
  erdField: { padding:"6px 14px", fontSize:"0.8rem", borderBottom:"1px solid var(--border)", fontFamily:"monospace" },
  table: { width:"100%", borderCollapse:"collapse", background:"white", borderRadius:12, overflow:"hidden" },
  th: { background:"var(--dark)", color:"white", padding:"10px 14px", textAlign:"left", fontSize:"0.8rem", fontWeight:600, letterSpacing:0.5 },
  td: { padding:"10px 14px", fontSize:"0.85rem", borderBottom:"1px solid var(--border)" },
  tr: { transition:"background 0.2s" },

  // ADMIN
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1.5rem", marginBottom:"2rem" },
  statCard: { background:"white", borderRadius:16, padding:"1.5rem", border:"1px solid var(--border)", textAlign:"center" },
  statEmoji: { fontSize:"2.5rem", marginBottom:"0.5rem" },
  statValue: { fontSize:"1.8rem", fontWeight:800, color:"var(--dark)", marginBottom:4 },
  statLabel: { color:"var(--muted)", fontSize:"0.85rem" },
  statTrend: { background:"var(--teal-light)", color:"var(--teal)", padding:"3px 10px", borderRadius:20, fontSize:"0.75rem", fontWeight:600, marginTop:6, display:"inline-block" },
  adminRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" },
  adminCard: { background:"white", borderRadius:16, padding:"1.5rem", border:"1px solid var(--border)" },
  adminCardTitle: { fontWeight:700, marginBottom:"1rem", fontSize:"1rem" },
  orderRow: { display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid var(--border)" },
  orderRef2: { fontWeight:600, fontSize:"0.9rem", fontFamily:"monospace" },
  orderCustomer: { color:"var(--muted)", fontSize:"0.8rem", marginTop:2 },
  orderTotal: { fontWeight:700, fontSize:"0.9rem" },
  statusBadge: { color:"white", padding:"2px 10px", borderRadius:20, fontSize:"0.7rem", fontWeight:600, display:"inline-block", marginTop:2 },
  paymentBar: { display:"flex", alignItems:"center", gap:10, marginBottom:"0.75rem" },
  paymentBarLabel: { width:160, fontSize:"0.8rem", color:"var(--muted)" },
  paymentBarTrack: { flex:1, height:8, background:"var(--cream2)", borderRadius:4, overflow:"hidden" },
  paymentBarFill: { height:"100%", borderRadius:4, transition:"width 0.3s" },
  paymentBarPct: { width:35, fontSize:"0.8rem", fontWeight:600, textAlign:"right" },

  // FOOTER
  footer: { background:"var(--dark)", padding:"4rem 2rem 2rem", marginTop:"4rem" },
  footerInner: { maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1.5fr", gap:"3rem", marginBottom:"3rem" },
  footerBrand: {},
  footerTagline: { color:"rgba(255,255,255,0.5)", fontSize:"0.85rem", lineHeight:1.7, marginTop:"1rem", maxWidth:280 },
  footerLinks: { display:"flex", flexDirection:"column", gap:8 },
  footerLinkTitle: { color:"rgba(255,255,255,0.5)", fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, marginBottom:"0.5rem" },
  footerLink: { background:"none", color:"rgba(255,255,255,0.75)", fontSize:"0.85rem", textAlign:"left", padding:0, transition:"color 0.2s", cursor:"pointer" },
  footerContact: { color:"rgba(255,255,255,0.6)", fontSize:"0.82rem" },
  footerBottom: { maxWidth:1280, margin:"0 auto", paddingTop:"1.5rem", borderTop:"1px solid rgba(255,255,255,0.1)", display:"flex", justifyContent:"space-between", color:"rgba(255,255,255,0.4)", fontSize:"0.78rem" },
};
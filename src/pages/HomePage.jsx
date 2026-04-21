import { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { STORE_LINKS, EXTERNAL_STORES } from "../data/constants";
import {
  HiOutlineTruck,
  HiOutlineLockClosed,
  HiOutlineRefresh,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineShoppingBag,
  HiOutlineStar
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  // Carousel slides
  const slides = [
    {
      badge: "New Arrivals",
      title: "Trend Starts",
      accent: "Here",
      subtitle: "Shop the latest fashion in Belize. Clothes, shoes and accessories delivered to your door.",
      cta: "Shop Now",
      ctaPage: "featured",
      bg: "#ffffff",
      image: "/images/apparel.jpg"
    },
    {
      badge: "Fast Delivery",
      title: "Delivered to",
      accent: "Your Door",
      subtitle: "We deliver to Belize City, Ladyville and Sandhill. Free delivery on orders over BZ$200!",
      cta: "Place an Order",
      ctaPage: "orders",
      bg: "#f0f7ff",
      image: "/images/apparel.jpg"
    },
    {
      badge: "Global Brands",
      title: "Shop From",
      accent: "Amazon & More",
      subtitle: "Find items on Amazon, Shein, Temu and Alibaba — we handle the ordering and delivery for you.",
      cta: "Browse Stores",
      ctaPage: "online-stores",
      bg: "#ffffff",
      image: "/images/apparel.jpg"
    },
  ];

  // Auto play carousel
  useEffect(() => {
    if (isAutoPlaying && slides.length) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying && slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div style={{ background: "#ffffff" }}>

      {/* ── HERO CAROUSEL ── */}
      <div style={{
        background: slide.bg,
        transition: "background 0.5s ease",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid #e5e7eb"
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "4rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "3rem",
          flexWrap: "wrap",
          minHeight: "85vh"
        }}>

          {/* LEFT — Text */}
          <div style={{ flex: 1, minWidth: 280 }}>

            {/* BADGE */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#2563EB",
              color: "white",
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: "0.82rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
              letterSpacing: 0.5
            }}>
              {slide.badge}
            </div>

            {/* TITLE */}
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 900,
              color: "#1a1a2e",
              lineHeight: 1.05,
              marginBottom: "1rem"
            }}>
              {slide.title}<br />
              <span style={{ color: "#2563EB" }}>{slide.accent}</span>
            </h1>

            {/* SUBTITLE */}
            <p style={{
              color: "#6b7280",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              marginBottom: "2rem",
              maxWidth: 460
            }}>
              {slide.subtitle}
            </p>

            {/* BUTTONS */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              <button
                style={{
                  background: "#2563EB",
                  color: "white",
                  padding: "14px 32px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onClick={() => setPage(slide.ctaPage)}
              >
                <HiOutlineShoppingBag size={18} />
                {slide.cta} →
              </button>
              <a
                href="https://wa.me/5016123456"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "transparent",
                  color: "#1a1a2e",
                  padding: "14px 28px",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  border: "1.5px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif"
                }}
              >
                <FaWhatsapp size={18} color="#25D366" />
                Chat with Us
              </a>
            </div>

            {/* STATS */}
            <div style={{
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap"
            }}>
              {[
                { value: products?.length || "8+", label: "Products" },
                { value: "3", label: "Delivery Areas" },
                { value: "4", label: "Global Stores" },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    color: "#2563EB"
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: "0.78rem",
                    color: "#9ca3af",
                    fontWeight: 500
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          

          {/* RIGHT — Image */}
          <div style={{
            flex: 1,
            minWidth: 280,
            display: "flex",
            justifyContent: "center",
            position: "relative"
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: 520
            }}>
              <img
                src={slide.image}
                alt="B-Com Fashion"
                style={{
                  width: "100%",
                  borderRadius: 20,
                  objectFit: "cover",
                  boxShadow: "0 24px 64px rgba(37,99,235,0.15)",
                  transition: "all 0.5s ease"
                }}
              />
              {/* FLOATING BADGE */}
              <div style={{
                position: "absolute",
                bottom: 20,
                left: -20,
                background: "white",
                borderRadius: 14,
                padding: "12px 20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#f0f7ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <HiOutlineStar size={20} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1a1a2e" }}>
                    Trusted Store
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                    Proudly Belizean
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CAROUSEL CONTROLS */}
        <div style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <button
            style={{
              background: "rgba(37,99,235,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563EB"
            }}
            onClick={prevSlide}
          >
            <HiChevronLeft size={20} />
          </button>

          {/* DOTS */}
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              style={{
                width: i === currentSlide ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === currentSlide ? "#2563EB" : "#dbeafe",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0
              }}
            />
          ))}

          <button
            style={{
              background: "rgba(37,99,235,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563EB"
            }}
            onClick={nextSlide}
          >
            <HiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* ── TRUST BADGES ── */}
      <div style={{
        background: "#2563EB",
        padding: "1.25rem 2rem",
        display: "flex",
        justifyContent: "center",
        gap: "3rem",
        flexWrap: "wrap"
      }}>
        {[
          { icon: <HiOutlineTruck size={20} color="white" />, text: "Nationwide Delivery" },
          { icon: <HiOutlineLockClosed size={20} color="white" />, text: "Secure Checkout" },
          { icon: <HiOutlineRefresh size={20} color="white" />, text: "Easy Exchanges" },
          { icon: <FaWhatsapp size={20} color="white" />, text: "WhatsApp Support" },
        ].map(b => (
          <div key={b.text} style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "white",
            fontSize: "0.9rem",
            fontWeight: 500
          }}>
            {b.icon} {b.text}
          </div>
        ))}
      </div>

      {/* ── NEW COLLECTION BANNER ── */}
      <div style={{
        background: "#1a1a2e",
        padding: "0.9rem 2rem",
        textAlign: "center"
      }}>
        <p style={{
          color: "white",
          fontSize: "0.9rem",
          fontWeight: 500,
          letterSpacing: 0.5
        }}>
          New Collection Just Dropped &nbsp;
          <span
            style={{
              color: "#93c5fd",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: 700
            }}
            onClick={() => setPage("featured")}
          >
            Explore Now →
          </span>
        </p>
      </div>
  
      {/* ── FEATURED PRODUCTS ── */}
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "4rem 2rem"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <p style={{
              color: "#2563EB",
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 6
            }}>
              Hand Picked For You
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem",
              fontWeight: 900,
              color: "#1a1a2e",
              margin: 0
            }}>
              Featured Products
            </h2>
          </div>
          <button
            style={{
              background: "transparent",
              color: "#2563EB",
              border: "1.5px solid #2563EB",
              padding: "10px 22px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s"
            }}
            onClick={() => setPage("featured")}
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div style={{
            textAlign: "center",
            padding: "4rem",
            color: "#9ca3af"
          }}>
            <div style={{
              width: 48,
              height: 48,
              border: "3px solid #dbeafe",
              borderTop: "3px solid #2563EB",
              borderRadius: "50%",
              margin: "0 auto 1rem",
              animation: "spin 1s linear infinite"
            }} />
            <p>Loading products...</p>
          </div>
        ) : featured.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9ca3af" }}>
            <HiOutlineShoppingBag size={48} style={{ margin: "0 auto 1rem" }} />
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

      {/* ── WHY SHOP WITH US ── */}
      <div style={{
        background: "#f0f7ff",
        padding: "4rem 2rem"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{
              color: "#2563EB",
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 6
            }}>
              Why B-Com?
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem",
              fontWeight: 900,
              color: "#1a1a2e"
            }}>
              Shopping Made Simple
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem"
          }}>
            {[
              {
                icon: "🇧🇿",
                title: "Proudly Belizean",
                desc: "Born and built in Belize. We know what our customers need."
              },
              {
                icon: "🚚",
                title: "Fast Delivery",
                desc: "Belize City, Ladyville and Sandhill. Free delivery over BZ$200."
              },
              {
                icon: "🌐",
                title: "Global Access",
                desc: "Order from Amazon, Shein, Temu and Alibaba through us."
              },
              {
                icon: "💬",
                title: "WhatsApp Support",
                desc: "Real human support available Monday to Saturday 8am-6pm."
              },
            ].map(item => (
              <div key={item.title} style={{
                background: "white",
                borderRadius: 16,
                padding: "1.75rem",
                border: "1px solid #dbeafe",
                textAlign: "center",
                transition: "all 0.2s"
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                  color: "#1a1a2e"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GLOBAL STORES STRIP ── */}
      <div style={{
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
        padding: "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        flexWrap: "wrap",
        background: "white"
      }}>
        <p style={{
          color: "#9ca3af",
          fontSize: "0.82rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 1
        }}>
          Also shop from
        </p>
        {EXTERNAL_STORES.map(s => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "7px 20px",
              borderRadius: 20,
              border: `1.5px solid ${s.color}`,
              color: s.color,
              fontSize: "0.85rem",
              fontWeight: 700,
              transition: "all 0.2s",
              textDecoration: "none"
            }}
          >
            {s.emoji} {s.name}
          </a>
        ))}
      </div>

      {/* ── CTA BANNER ── */}
      <div style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #2563EB 50%, #3b82f6 100%)",
        padding: "5rem 2rem",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.85rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: "1rem"
          }}>
            Ready to Shop?
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            color: "white",
            fontWeight: 900,
            marginBottom: "1rem",
            lineHeight: 1.2
          }}>
            Belize's Fashion Store is Open
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "1rem",
            lineHeight: 1.7,
            marginBottom: "2rem"
          }}>
            Browse our collection or find items on Amazon, Shein, Temu and Alibaba.
            We'll handle the ordering and deliver right to your door.
          </p>
          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button
              style={{
                background: "white",
                color: "#2563EB",
                padding: "14px 32px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}
              onClick={() => setPage("featured")}
            >
              Shop Now →
            </button>
            <button
              style={{
                background: "transparent",
                color: "white",
                padding: "14px 32px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.95rem",
                border: "1.5px solid rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}
              onClick={() => setPage("online-stores")}
            >
              Browse Global Stores
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
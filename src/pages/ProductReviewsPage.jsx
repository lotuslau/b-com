import { useState, useEffect } from "react";
import { HiStar, HiOutlineStar, HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import { getReviews } from "../services/api";

export default function ProductReviewsPage({ product, setPage }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    if (!product) return;
    fetchReviews();
  }, [product]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(product.id);
      setReviews(data.reviews);
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedAndFiltered = reviews
    .filter(r => filterRating === 0 || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      if (sortBy === "helpful") return b.helpful_count - a.helpful_count;
      return 0;
    });

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <p>No product selected.</p>
        <button className="btn-primary" onClick={() => setPage("featured")}>
          Browse Products →
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>

      {/* BACK BUTTON */}
      <button
        onClick={() => setPage("featured")}
        style={{
          background: "none",
          border: "none",
          color: "#2563EB",
          fontWeight: 600,
          fontSize: "0.95rem",
          cursor: "pointer",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        ← Back to Products
      </button>

      {/* PRODUCT HEADER */}
      <div style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "center",
        background: "white",
        borderRadius: 16,
        padding: "1.5rem",
        border: "1px solid var(--border)",
        marginBottom: "2rem",
        flexWrap: "wrap"
      }}>
        {product.images && (
          <img
            src={product.images}
            alt={product.name}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 10
            }}
          />
        )}
        <div>
          <p style={{ color: "var(--muted)", fontSize: "0.78rem", marginBottom: 4 }}>
            {product.brand}
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            marginBottom: "0.5rem"
          }}>
            {product.name}
          </h1>
          <p style={{ color: "#2563EB", fontWeight: 700, fontSize: "1.1rem" }}>
            BZ$ {parseFloat(product.price_bzd || product.price || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* RATING SUMMARY */}
      {summary && parseInt(summary.total) > 0 && (
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: "1.5rem",
          border: "1px solid var(--border)",
          marginBottom: "2rem",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "2rem",
          alignItems: "center"
        }}>
          {/* OVERALL SCORE */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "3.5rem",
              fontWeight: 900,
              color: "var(--dark)",
              lineHeight: 1
            }}>
              {parseFloat(summary.average || 0).toFixed(1)}
            </div>
            <div style={{ display: "flex", gap: 2, justifyContent: "center", margin: "0.5rem 0" }}>
              {[...Array(5)].map((_, i) => (
                i < Math.round(summary.average || 0)
                  ? <HiStar key={i} size={16} color="#f59e0b" />
                  : <HiOutlineStar key={i} size={16} color="#ddd" />
              ))}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
              {summary.total} review{parseInt(summary.total) !== 1 ? "s" : ""}
            </div>
          </div>

          {/* RATING BARS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = parseInt(summary[`${["", "one", "two", "three", "four", "five"][star]}_star`] || 0);
              const pct = parseInt(summary.total) > 0
                ? Math.round((count / parseInt(summary.total)) * 100)
                : 0;
              return (
                <div
                  key={star}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer"
                  }}
                  onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                >
                  <span style={{
                    fontSize: "0.78rem",
                    color: filterRating === star ? "#2563EB" : "var(--muted)",
                    fontWeight: filterRating === star ? 700 : 400,
                    minWidth: 40
                  }}>
                    {star} ★
                  </span>
                  <div style={{
                    flex: 1,
                    height: 8,
                    background: "#f0f0f0",
                    borderRadius: 4,
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: filterRating === star ? "#2563EB" : "#f59e0b",
                      borderRadius: 4,
                      transition: "width 0.3s"
                    }} />
                  </div>
                  <span style={{
                    fontSize: "0.78rem",
                    color: "var(--muted)",
                    minWidth: 30
                  }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WRITE REVIEW TOGGLE */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: showForm ? "var(--dark)" : "#2563EB",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "12px 24px",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s"
          }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm
            ? <><HiOutlineChevronUp size={18} /> Hide Review Form</>
            : <><HiStar size={18} /> Write a Review</>
          }
        </button>
      </div>

      {/* REVIEW FORM */}
      {showForm && (
        <div style={{ marginBottom: "2rem" }}>
          <ReviewForm
            productId={product.id}
            productName={product.name}
            onReviewSubmitted={() => {
              setShowForm(false);
              fetchReviews();
            }}
          />
        </div>
      )}

      {/* SORT & FILTER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
        flexWrap: "wrap",
        gap: "0.75rem"
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.3rem"
        }}>
          {filterRating > 0
            ? `${filterRating}-Star Reviews (${sortedAndFiltered.length})`
            : `All Reviews (${reviews.length})`
          }
        </h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {filterRating > 0 && (
            <button
              style={{
                background: "#f0f7ff",
                border: "1px solid #dbeafe",
                borderRadius: 8,
                padding: "6px 12px",
                color: "#2563EB",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}
              onClick={() => setFilterRating(0)}
            >
              Clear Filter ✕
            </button>
          )}
          <select
            style={{
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: "0.85rem",
              fontFamily: "'DM Sans', sans-serif",
              background: "white",
              color: "var(--dark)",
              cursor: "pointer",
              outline: "none"
            }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* REVIEWS LIST */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⭐</div>
          <p>Loading reviews...</p>
        </div>
      ) : sortedAndFiltered.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          background: "white",
          borderRadius: 16,
          border: "1px solid var(--border)"
        }}>
          <h3 style={{ marginBottom: "0.5rem" }}>
            {filterRating > 0
              ? `No ${filterRating}-star reviews yet`
              : "No reviews yet"
            }
          </h3>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            Be the first to review {product.name}!
          </p>
          <button
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            Write the First Review →
          </button>
        </div>
      ) : (
        sortedAndFiltered.map(review => (
          <ReviewCard
            key={review.id}
            review={review}
          />
        ))
      )}
    </div>
  );
}
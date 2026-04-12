import { useState, useEffect } from "react";
import { HiStar, HiOutlineCheck, HiOutlineTrash, HiOutlinePhotograph } from "react-icons/hi";

export default function AdminReviews({ showNotification }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/api/admin/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/reviews/${id}/approve`, {
        method: "PUT"
      });
      fetchAllReviews();
      showNotification("Review approved and published!");
    } catch (err) {
      showNotification("Error approving review", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await fetch(`http://localhost:3001/api/reviews/${id}`, {
        method: "DELETE"
      });
      fetchAllReviews();
      showNotification("Review deleted");
    } catch (err) {
      showNotification("Error deleting review", "error");
    }
  };

  const filtered = reviews.filter(r => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.5rem"
        }}>
          Manage Reviews
        </h2>

        <div style={{ display: "flex", gap: 6 }}>
          {["all", "pending", "approved"].map(f => (
            <button
              key={f}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: "1.5px solid",
                borderColor: filter === f ? "#2563EB" : "var(--border)",
                background: filter === f ? "#f0f7ff" : "white",
                color: filter === f ? "#2563EB" : "var(--muted)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "capitalize"
              }}
              onClick={() => setFilter(f)}
            >
              {f} ({f === "all" ? reviews.length : reviews.filter(r => f === "pending" ? !r.approved : r.approved).length})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading reviews...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
          <p>No {filter} reviews</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map(review => (
            <div key={review.id} style={{
              background: "white",
              borderRadius: 16,
              padding: "1.25rem",
              border: `1px solid ${review.approved ? "#dbeafe" : "var(--border)"}`,
              borderLeft: `4px solid ${review.approved ? "#2563EB" : "#f59e0b"}`
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: "0.75rem"
              }}>
                <div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4
                  }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#f0f7ff",
                      color: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.9rem"
                    }}>
                      {review.customer_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        {review.customer_name}
                      </div>
                      <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                        {review.customer_email} · {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        size={16}
                        color={i < review.rating ? "#f59e0b" : "#ddd"}
                      />
                    ))}
                  </div>
                </div>

                <span style={{
                  background: review.approved ? "#f0fdf4" : "#fff8e1",
                  color: review.approved ? "#22c55e" : "#f59e0b",
                  padding: "3px 12px",
                  borderRadius: 20,
                  fontSize: "0.72rem",
                  fontWeight: 700
                }}>
                  {review.approved ? "Published" : "Pending Approval"}
                </span>
              </div>

              {review.review_text && (
                <p style={{
                  color: "var(--dark)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  marginBottom: review.images?.length > 0 ? "0.75rem" : 0
                }}>
                  {review.review_text}
                </p>
              )}

              {review.images && review.images.length > 0 && (
                <div style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginBottom: "0.75rem"
                }}>
                  {review.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Review ${i + 1}`}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid var(--border)"
                      }}
                    />
                  ))}
                </div>
              )}

              <div style={{
                display: "flex",
                gap: 8,
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--border)"
              }}>
                {!review.approved && (
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#f0fdf4",
                      border: "1px solid #22c55e",
                      borderRadius: 8,
                      padding: "6px 14px",
                      color: "#22c55e",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif"
                    }}
                    onClick={() => handleApprove(review.id)}
                  >
                    <HiOutlineCheck size={14} /> Approve & Publish
                  </button>
                )}
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#fff0f2",
                    border: "1px solid #e05c6a",
                    borderRadius: 8,
                    padding: "6px 14px",
                    color: "#e05c6a",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                  onClick={() => handleDelete(review.id)}
                >
                  <HiOutlineTrash size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
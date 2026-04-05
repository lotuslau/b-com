import { useState } from "react";
import { HiStar, HiOutlineStar, HiOutlineThumbUp, HiOutlinePhotograph, HiOutlineVideoCamera } from "react-icons/hi";
import { markHelpful } from "../services/api";

export default function ReviewCard({ review, onHelpful }) {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxVideo, setLightboxVideo] = useState(null);
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);

  const handleHelpful = async () => {
    if (helpfulClicked) return;
    try {
      await markHelpful(review.id);
      setHelpfulCount(c => c + 1);
      setHelpfulClicked(true);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-BZ", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <>
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "1.5rem",
        border: "1px solid var(--border)",
        marginBottom: "1rem"
      }}>
        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
          gap: 8
        }}>
          <div>
            {/* STARS */}
            <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
              {[...Array(5)].map((_, i) => (
                i < review.rating
                  ? <HiStar key={i} size={18} color="#f59e0b" />
                  : <HiOutlineStar key={i} size={18} color="#ddd" />
              ))}
            </div>
            {/* NAME */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#2563EB",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.9rem"
              }}>
                {review.customer_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {review.customer_name}
                </div>
                <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                  {formatDate(review.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* VERIFIED BADGE */}
          {review.verified && (
            <span style={{
              background: "#f0f7ff",
              color: "#2563EB",
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: "0.72rem",
              fontWeight: 600,
              border: "1px solid #dbeafe"
            }}>
              ✓ Verified Purchase
            </span>
          )}
        </div>

        {/* REVIEW TEXT */}
        {review.review_text && (
          <p style={{
            color: "var(--dark)",
            lineHeight: 1.7,
            fontSize: "0.92rem",
            marginBottom: "1rem"
          }}>
            {review.review_text}
          </p>
        )}

        {/* IMAGES */}
        {review.images && review.images.length > 0 && (
          <div style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: "1rem"
          }}>
            {review.images.map((img, i) => (
              <div
                key={i}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "2px solid var(--border)",
                  position: "relative"
                }}
                onClick={() => setLightboxImage(img)}
              >
                <img
                  src={img}
                  alt={`Review image ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s"
                }}>
                  <HiOutlinePhotograph size={20} color="white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIDEO */}
        {review.video_url && (
          <div style={{ marginBottom: "1rem" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#f0f7ff",
                border: "1px solid #dbeafe",
                borderRadius: 8,
                padding: "8px 16px",
                color: "#2563EB",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}
              onClick={() => setLightboxVideo(review.video_url)}
            >
              <HiOutlineVideoCamera size={16} />
              Watch Review Video
            </button>
          </div>
        )}

        {/* HELPFUL */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border)"
        }}>
          <span style={{
            color: "var(--muted)",
            fontSize: "0.8rem"
          }}>
            Was this helpful?
          </span>
          <button
            onClick={handleHelpful}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: helpfulClicked ? "#f0f7ff" : "transparent",
              border: `1px solid ${helpfulClicked ? "#2563EB" : "var(--border)"}`,
              borderRadius: 8,
              padding: "4px 12px",
              color: helpfulClicked ? "#2563EB" : "var(--muted)",
              fontSize: "0.8rem",
              cursor: helpfulClicked ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500
            }}
          >
            <HiOutlineThumbUp size={14} />
            Yes ({helpfulCount})
          </button>
        </div>
      </div>

      {/* IMAGE LIGHTBOX */}
      {lightboxImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
          }}
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Review"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 12
            }}
          />
          <button
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              width: 40,
              height: 40,
              borderRadius: "50%",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setLightboxImage(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* VIDEO LIGHTBOX */}
      {lightboxVideo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
          }}
          onClick={() => setLightboxVideo(null)}
        >
          <video
            src={lightboxVideo}
            controls
            autoPlay
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 12
            }}
            onClick={e => e.stopPropagation()}
          />
          <button
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              width: 40,
              height: 40,
              borderRadius: "50%",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setLightboxVideo(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
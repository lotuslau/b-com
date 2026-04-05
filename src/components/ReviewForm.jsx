import { useState, useRef } from "react";
import { HiStar, HiOutlineStar, HiOutlinePhotograph, HiOutlineVideoCamera, HiOutlineX, HiOutlineUpload } from "react-icons/hi";
import { submitReview } from "../services/api";

export default function ReviewForm({ productId, productName, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    text: ""
  });
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setImages(prev => [...prev, ...files]);
    const urls = files.map(f => URL.createObjectURL(f));
    setImagePreviewUrls(prev => [...prev, ...urls]);
    setError("");
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError("Video must be under 50MB");
      return;
    }
    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreviewUrl("");
    setVideoUrl("");
  };

  const handleSubmit = async () => {
    if (!form.name) {
      setError("Please enter your name");
      return;
    }
    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // In production: upload images/video to Cloudinary first
      // For now we use local preview URLs as placeholders
      const reviewData = {
        product_id: productId,
        customer_name: form.name,
        customer_email: form.email,
        rating,
        review_text: form.text,
        images: imagePreviewUrls,
        video_url: videoPreviewUrl || videoUrl || null
      };

      await submitReview(reviewData);
      setSubmitted(true);
      if (onReviewSubmitted) onReviewSubmitted();

    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        textAlign: "center",
        padding: "2rem",
        background: "#f0f7ff",
        borderRadius: 16,
        border: "1px solid #dbeafe"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🎉</div>
        <h3 style={{ marginBottom: "0.5rem", color: "var(--dark)" }}>
          Thank you for your review!
        </h3>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Your review has been submitted and will appear after approval.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      padding: "1.5rem",
      border: "1px solid var(--border)"
    }}>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.3rem",
        marginBottom: "1.25rem",
        color: "var(--dark)"
      }}>
        Write a Review
      </h3>

      {/* STAR RATING */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{
          display: "block",
          fontSize: "0.8rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "var(--muted)",
          marginBottom: "0.5rem"
        }}>
          Your Rating *
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 2,
                transition: "transform 0.1s"
              }}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              {star <= (hoveredRating || rating)
                ? <HiStar size={32} color="#f59e0b" />
                : <HiOutlineStar size={32} color="#ddd" />
              }
            </button>
          ))}
          {(hoveredRating || rating) > 0 && (
            <span style={{
              color: "#f59e0b",
              fontWeight: 600,
              fontSize: "0.9rem",
              marginLeft: 4
            }}>
              {STAR_LABELS[hoveredRating || rating]}
            </span>
          )}
        </div>
      </div>

      {/* NAME & EMAIL */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "1rem"
      }}>
        <div>
          <label className="form-label">Your Name *</label>
          <input
            className="form-input"
            type="text"
            placeholder="John Smith"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="form-label">Email (optional)</label>
          <input
            className="form-input"
            type="email"
            placeholder="john@email.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      {/* REVIEW TEXT */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label className="form-label">Your Review</label>
        <textarea
          className="form-input"
          style={{ height: 100, resize: "vertical" }}
          placeholder={`Share your experience with ${productName}...`}
          value={form.text}
          onChange={e => setForm({ ...form, text: e.target.value })}
        />
        <div style={{
          textAlign: "right",
          fontSize: "0.75rem",
          color: "var(--muted)",
          marginTop: 4
        }}>
          {form.text.length} characters
        </div>
      </div>

      {/* IMAGE UPLOAD */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label className="form-label">
          Add Photos (up to 5)
        </label>

        {imagePreviewUrls.length > 0 && (
          <div style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 8
          }}>
            {imagePreviewUrls.map((url, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img
                  src={url}
                  alt={`Preview ${i + 1}`}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "2px solid var(--border)"
                  }}
                />
                <button
                  onClick={() => removeImage(i)}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#e05c6a",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem"
                  }}
                >
                  <HiOutlineX size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {imagePreviewUrls.length < 5 && (
          <>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={imageInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#f9f9f9",
                border: "2px dashed var(--border)",
                borderRadius: 10,
                padding: "10px 20px",
                color: "var(--muted)",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                width: "100%",
                justifyContent: "center"
              }}
              onClick={() => imageInputRef.current.click()}
            >
              <HiOutlinePhotograph size={18} />
              Click to upload photos
            </button>
          </>
        )}
      </div>

      {/* VIDEO UPLOAD */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label className="form-label">
          Add a Video (optional, max 50MB)
        </label>

        {videoPreviewUrl ? (
          <div style={{ position: "relative", marginBottom: 8 }}>
            <video
              src={videoPreviewUrl}
              controls
              style={{
                width: "100%",
                maxHeight: 200,
                borderRadius: 10,
                border: "2px solid var(--border)"
              }}
            />
            <button
              onClick={removeVideo}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "#e05c6a",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 28,
                height: 28,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <HiOutlineX size={14} />
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              style={{ display: "none" }}
              onChange={handleVideoChange}
            />
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#f9f9f9",
                border: "2px dashed var(--border)",
                borderRadius: 10,
                padding: "10px 20px",
                color: "var(--muted)",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                width: "100%",
                justifyContent: "center",
                marginBottom: 8
              }}
              onClick={() => videoInputRef.current.click()}
            >
              <HiOutlineVideoCamera size={18} />
              Click to upload a video
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>or paste a video URL</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            <input
              className="form-input"
              style={{ marginTop: 8 }}
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
            />
          </>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div style={{
          background: "#fff0f2",
          border: "1px solid #e05c6a",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#e05c6a",
          fontSize: "0.85rem",
          marginBottom: "1rem"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* SUBMIT */}
      <button
        className="btn-primary"
        style={{
          width: "100%",
          opacity: loading ? 0.7 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8
        }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <>Submitting...</>
        ) : (
          <>
            <HiOutlineUpload size={16} />
            Submit Review
          </>
        )}
      </button>

      <p style={{
        textAlign: "center",
        color: "var(--muted)",
        fontSize: "0.75rem",
        marginTop: "0.75rem"
      }}>
        Reviews are moderated and appear after approval
      </p>
    </div>
  );
}
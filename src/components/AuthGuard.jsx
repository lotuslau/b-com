export default function AuthGuard({ customer, setPage, children }) {
  if (!customer) {
    return (
      <div style={{
        textAlign: "center",
        padding: "5rem 2rem"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔒</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.8rem",
          marginBottom: "0.75rem"
        }}>
          Sign In Required
        </h2>
        <p style={{
          color: "var(--muted)",
          marginBottom: "2rem",
          fontSize: "0.95rem"
        }}>
          Please sign in to access this page
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => setPage("login")}>
            Sign In →
          </button>
          <button className="btn-secondary" onClick={() => setPage("register")}>
            Create Account
          </button>
        </div>
      </div>
    );
  }
  return children;
}
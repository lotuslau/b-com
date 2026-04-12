import { useState, useEffect } from "react";
import { NAV_LINKS } from "../data/constants";
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineUser,
} from "react-icons/hi";

export default function Nav({ page, setPage, cartCount, setCartOpen, wishlist, searchQuery, setSearchQuery, customer }) {  
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  <Nav
        page={page}
        setPage={setPage}
        cartCount={cartCount}
        setCartOpen={setCartOpen}
        wishlist={wishlist}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        customer={customer}
      />

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <nav
        className="nav"
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.97)"
            : "rgba(255,255,255,0.85)",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <div className="nav-inner">

          {/* LOGO */}
          <div className="nav-logo" onClick={() => setPage("home")}>
            <img
              src="/images/logo.png"
              alt="B-Com Belize"
              style={{ height: 55, objectFit: "contain" }}
            />
          </div>

          {/* NAV LINKS — desktop */}
          <div className="nav-links">
            {NAV_LINKS.map(([p, l]) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="nav-link"
                style={{
                  color: page === p ? "#2563EB" : "var(--dark)",
                  borderBottom: page === p
                    ? "2px solid #2563EB"
                    : "2px solid transparent",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* SEARCH BAR */}
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <HiOutlineSearch
            size={18}
            color="var(--muted)"
            style={{
              position: "absolute",
              left: 12,
              pointerEvents: "none"
            }}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              if (e.target.value.length > 0) {
                setPage("featured");
              }
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                setPage("featured");
              }
            }}
            style={{
              border: "1.5px solid var(--border)",
              borderRadius: 24,
              padding: "8px 16px 8px 36px",
              fontSize: "0.85rem",
              fontFamily: "'DM Sans', sans-serif",
              background: "#f9f9f9",
              outline: "none",
              width: 200,
              transition: "all 0.2s",
              color: "var(--dark)"
            }}
            onFocus={e => {
              e.target.style.width = "260px";
              e.target.style.borderColor = "#2563EB";
              e.target.style.background = "white";
            }}
            onBlur={e => {
              e.target.style.width = "200px";
              e.target.style.borderColor = "var(--border)";
              e.target.style.background = "#f9f9f9";
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: 10,
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
            >
              <HiOutlineX size={14} />
            </button>
          )}
        </div>

          {/* ACTION ICONS */}
          <div className="nav-actions">

            {/* Wishlist */}
            <button
              className="nav-icon-btn"
              onClick={() => setPage("wishlist")}
              title="Wishlist"
              style={{ position: "relative" }}
            >
              <HiOutlineHeart size={24} color={wishlist.length > 0 ? "#e05c6a" : "var(--dark)"} />
              {wishlist.length > 0 && (
                <span
                  className="nav-badge"
                  style={{ background: "#e05c6a" }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>
          
          {/* Account */}
            <button
              className="nav-icon-btn"
              onClick={() => setPage(customer ? "account" : "login")}
              title={customer ? `My Account (${customer.name})` : "Sign In"}
              style={{ position: "relative" }}
            >
              <HiOutlineUser
                size={24}
                color={customer ? "#2563EB" : "var(--dark)"}
              />
              {customer && (
                <span style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#22c55e",
                  border: "2px solid white"
                }} />
              )}
            </button>

            {/* Cart */}
            <button
              className="nav-icon-btn"
              onClick={() => setCartOpen(true)}
              title="Cart"
              style={{ position: "relative" }}
            >
              <HiOutlineShoppingBag size={24} color="var(--dark)" />
              {cartCount > 0 && (
                <span
                  className="nav-badge"
                  style={{ background: "#2563EB" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="nav-icon-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: "none" }}
              id="mobile-menu-btn"
            >
              {mobileOpen
                ? <HiOutlineX size={24} color="var(--dark)" />
                : <HiOutlineMenu size={24} color="var(--dark)" />
              }
            </button>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div style={{
          position: "fixed",
          top: 72,
          left: 0,
          right: 0,
          background: "white",
          zIndex: 99,
          padding: "1rem 2rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          {NAV_LINKS.map(([p, l]) => (
            <button
              key={p}
              onClick={() => { setPage(p); setMobileOpen(false); }}
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "10px 0",
                fontSize: "1rem",
                fontWeight: page === p ? 600 : 400,
                color: page === p ? "#2563EB" : "var(--dark)",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
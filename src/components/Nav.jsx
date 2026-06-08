import { useState, useEffect } from "react";
import { NAV_LINKS } from "../data/constants";
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineUser
} from "react-icons/hi";

export default function Nav({
  page,
  setPage,
  cartCount,
  setCartOpen,
  wishlist,
  searchQuery,
  setSearchQuery,
  customer
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">

          {/* LOGO */}
          <div className="nav-logo" onClick={() => setPage("home")}>
            <img
              src="/images/bcomlogo.png"
              alt="B-Com Belize"
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
                  color: page === p ? "#93c5fd" : "white",
                  borderBottom: page === p
                    ? "2px solid #93c5fd"
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
            alignItems: "center",
            flexShrink: 0
          }}>
            <HiOutlineSearch
              size={16}
              color="rgba(255,255,255,0.6)"
              style={{
                position: "absolute",
                left: 10,
                pointerEvents: "none"
              }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (e.target.value.length > 0) {
                  setPage("featured");
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter") setPage("featured");
              }}
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 24,
                padding: "7px 14px 7px 32px",
                fontSize: "0.82rem",
                fontFamily: "'DM Sans', sans-serif",
                background: "rgba(255,255,255,0.1)",
                outline: "none",
                width: 150,
                transition: "all 0.2s",
                color: "white",
              }}
              onFocus={e => {
                e.target.style.width = "200px";
                e.target.style.background = "rgba(255,255,255,0.15)";
                e.target.style.borderColor = "#93c5fd";
              }}
              onBlur={e => {
                e.target.style.width = "150px";
                e.target.style.background = "rgba(255,255,255,0.1)";
                e.target.style.borderColor = "rgba(255,255,255,0.2)";
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 8,
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <HiOutlineX size={13} />
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
            >
              <HiOutlineHeart
                size={22}
                color={wishlist.length > 0 ? "#e05c6a" : "white"}
              />
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
              title={customer ? `My Account` : "Sign In"}
            >
              <HiOutlineUser
                size={22}
                color={customer ? "#93c5fd" : "white"}
              />
              {customer && (
                <span style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  border: "1.5px solid #102538"
                }} />
              )}
            </button>

            {/* Cart */}
            <button
              className="nav-icon-btn"
              onClick={() => setCartOpen(true)}
              title="Cart"
            >
              <HiOutlineShoppingBag size={22} color="white" />
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
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: "none" }}
            >
              {mobileOpen
                ? <HiOutlineX size={22} color="white" />
                : <HiOutlineMenu size={22} color="white" />
              }
            </button>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div style={{
          position: "fixed",
          top: 75,
          left: 0,
          right: 0,
          background: "#102538",
          zIndex: 99,
          padding: "1rem 2rem",
          borderBottom: "1px solid #1a3a52",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem"
        }}>
          {NAV_LINKS.map(([p, l]) => (
            <button
              key={p}
              onClick={() => { setPage(p); setMobileOpen(false); }}
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "12px 0",
                fontSize: "1rem",
                fontWeight: page === p ? 600 : 400,
                color: page === p ? "#93c5fd" : "white",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
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
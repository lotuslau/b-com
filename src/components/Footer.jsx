import { NAV_LINKS } from "../data/constants";
import {
  HiOutlineMail,
  HiOutlineLocationMarker
} from "react-icons/hi";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SOCIAL_LINKS } from "../data/constants";

export default function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* BRAND */}
        <div>
          <img
            src="/images/bcomlogo.png"
            alt="B-Com Belize"
            style={{
              height: 70,
              objectFit: "contain",
              marginBottom: "0.75rem"
            }}
          />
          <p className="footer-tagline">
            B-Com — Belize's premier online fashion hub.
          </p>
        </div>

        {/* PAGES */}
        <div>
          <h4 className="footer-link-title">Pages</h4>
          {NAV_LINKS.map(([p, l]) => (
            <button
              key={p}
              className="footer-link"
              onClick={() => setPage(p)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="footer-link-title">Contact</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.25rem" }}>
            {[
              { icon: <HiOutlineLocationMarker size={16} />, text: "Belize City, Belize" },
              { icon: <HiOutlineMail size={16} />, text: "hello@b-com.bz" },
              { icon: <FaWhatsapp size={16} />, text: SOCIAL_LINKS.whatsappDisplay },
            ].map(c => (
              <span key={c.text} className="footer-contact" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {c.icon} {c.text}
              </span>
            ))}
          </div>

          {/* SOCIAL ICONS */}
          <div style={{ display: "flex", gap: 10 }}>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noreferrer"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                transition: "all 0.2s"
              }}
            >
              <FaFacebook size={17} />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                transition: "all 0.2s"
              }}
            >
              <FaInstagram size={17} />
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noreferrer"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                transition: "all 0.2s"
              }}>
              <FaWhatsapp size={17} />
              </a>
            </div>
          </div>
        <div className="footer-bottom" style={{ flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          
          {[
            ["terms", "Terms & Conditions"],
            ["privacy", "Privacy Policy"],
            ["refund-policy", "Return & Refund Policy"],
            ["delivery-policy", "Delivery Policy"],
            ["security", "Security Statement"],
          ].map(([p, l]) => (

            <button
              key={p}
              className="footer-link"
              onClick={() => setPage(p)}
              style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.2)",
            fontSize: "0.7rem",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif"
          }}
          onClick={() => setPage("admin")}
        >
          Admin
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: "0.5rem" }}>
          <span>© 2026 B-Com Belize Ltd. All rights reserved. Belize City, Belize</span>
          <span>🔒 PCI DSS Compliant · Proudly Belizean</span>
        </div>
      </div>
      </div>
    </footer>
  );
}
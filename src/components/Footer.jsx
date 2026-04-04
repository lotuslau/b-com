import { NAV_LINKS } from "../data/constants";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineChatAlt2
} from "react-icons/hi";

export default function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* BRAND */}
        <div>
          <img
            src="/images/logofooter.png"
            alt="B-Com Belize"
            style={{
              height: 100,
              objectFit: "contain",
              marginBottom: "0.75rem"
            }}
          />
          <p className="footer-tagline">
            B-Com — Belize's premier online fashion marketplace,
            from local artisans to global brands.
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

        {/* SHOP */}
        <div>
          <h4 className="footer-link-title">Global Stores</h4>
          {[
            ["Amazon", "https://www.amazon.com"],
            ["Shein", "https://www.shein.com"],
            ["Temu", "https://www.temu.com"],
            ["Alibaba", "https://www.alibaba.com"],
          ].map(([name, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              {name}
            </a>
          ))}
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="footer-link-title">Contact</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: <HiOutlineLocationMarker size={16} />, text: "Belize City, Belize" },
              { icon: <HiOutlineMail size={16} />, text: "b-com@gmail.com"},
              { icon: <HiOutlinePhone size={16} />, text: "+501-614-1234" },
              { icon: <HiOutlineChatAlt2 size={16} />, text: "WhatsApp Support" },
            ].map(c => (
              <span key={c.text} className="footer-contact" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {c.icon} {c.text}
              </span>
            ))}
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <span>© 2026 B-Com Belize. All rights reserved.</span>
        <span> Secure Checkout · Proudly Belizean</span>
      </div>
    </footer>
  );
}
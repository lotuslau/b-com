import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SOCIAL_LINKS } from "../data/constants";

export default function SocialMediaSection() {
  const SOCIALS = [
    {
      name: "Facebook",
      icon: <FaFacebook size={28} />,
      url: SOCIAL_LINKS.facebook,
      color: "#1877F2",
      handle: "@BenguchesStore"
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={28} />,
      url: SOCIAL_LINKS.instagram,
      color: "#E4405F",
      handle: "@benguches"
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={28} />,
      url: SOCIAL_LINKS.whatsapp,
      color: "#25D366",
      handle: SOCIAL_LINKS.whatsappDisplay
    },
  ];

  return (
    <div style={{
      background: "white",
      padding: "4rem 2rem",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>

        <p style={{
          color: "#2563EB",
          fontSize: "0.82rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginBottom: 6
        }}>
          Stay Connected
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2rem",
          fontWeight: 900,
          color: "var(--dark)",
          marginBottom: "0.75rem"
        }}>
          Follow Us
        </h2>
        <p style={{
          color: "var(--muted)",
          fontSize: "0.95rem",
          marginBottom: "2.5rem",
          maxWidth: 480,
          margin: "0 auto 2.5rem"
        }}>
          Follow B-Com Belize on social media for the latest arrivals,
          exclusive deals and behind-the-scenes content.
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap"
        }}>
          {SOCIALS.map(social => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                padding: "1.5rem 2rem",
                borderRadius: 16,
                border: "1.5px solid var(--border)",
                transition: "all 0.2s",
                minWidth: 160
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `${social.color}15`,
                color: social.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {social.icon}
              </div>
              <div style={{
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "var(--dark)"
              }}>
                {social.name}
              </div>
              <div style={{
                fontSize: "0.78rem",
                color: "var(--muted)"
              }}>
                {social.handle}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
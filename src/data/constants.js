// ============================================================
// B-COM BELIZE — Shared Constants & Data
// ============================================================

export const DELIVERY_TO = [
  "Belize",
  "Ladyville",
  "Sandhill",
];

export const PAYMENT_METHODS = [
  {
    id: "belize_bank_card",
    label: "Belize Bank",
    desc: "Pay with your Belize Bank credit or debit card. Visa & Mastercard accepted. 3D Secure enabled.",
    badge: "Recommended",
    logos: ["visa", "mastercard"]
  },
  {
    id: "atlantic_bank_card",
    label: "Atlantic Bank",
    desc: "Pay with your Atlantic Bank credit or debit card. Visa & Mastercard accepted. CVV2 authentication.",
    badge: "",
    logos: ["visa", "mastercard"]
  },
  {
    id: "international_credit_card",
    label: "International Credit Card",
    desc: "Pay with your international credit or debit card. Visa & Mastercard accepted.",
    badge: "",
    logos: ["visa", "mastercard"]
  },
];

export const CATEGORIES = [
  { id: 1, key: "clothing", label: "Clothing", emoji: "👗" },
  { id: 2, key: "shoes", label: "Shoes", emoji: "👟" },
  { id: 3, key: "accessories", label: "Accessories", emoji: "📿" },
  { id: 4, key: "lifestyle", label: "Lifestyle", emoji: "⌚" },
];

export const NAV_LINKS = [
  ["home", "Home"],
  ["featured", "Featured"],
  ["orders", "Orders"],
  ["tracking", "Track Order"],
  ["about", "About"],
  ["customer-service", "Customer Service"],
];

export const SOCIAL_LINKS = {
  facebook: "https://m.facebook.com/BenguchesStore",
  instagram: "https://www.instagram.com/benguches?igsh=cDRyeDV1cWRtcGo2",
  whatsapp: "https://wa.me/5016206637",
  whatsappDisplay: "+501 620-6637"
};
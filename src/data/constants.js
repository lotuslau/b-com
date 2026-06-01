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
    icon: "🏦",
    desc: "Pay with your Belize Bank credit or debit card. Visa & Mastercard accepted. 3D Secure enabled.",
    badge: "Recommended",
    logos: ["visa", "mastercard"]
  },
  {
    id: "atlantic_bank_card",
    label: "Atlantic Bank",
    icon: "🏦",
    desc: "Pay with your Atlantic Bank credit or debit card. Visa & Mastercard accepted. CVV2 authentication.",
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
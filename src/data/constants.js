// ============================================================
// B-COM BELIZE — Shared Constants & Data
// ============================================================

export const STORE_LINKS = {
  amazon: "https://www.amazon.com",
  shein: "https://www.shein.com",
  temu: "https://www.temu.com",
  alibaba: "https://www.alibaba.com",
};

export const STORE_COLORS = {
  amazon: "#FF9900",
  shein: "#e74c3c",
  temu: "#e67e22",
  alibaba: "#FF6A00",
  own: "#2563EB",
};

export const DELIVERY_TO = [
  "Belize",
  "Ladyville",
  "Sandhill",
];

export const PAYMENT_METHODS = [
  {
    id: "belize_bank_card",
    label: "Belize Bank – Credit/Debit Card",
    desc: "Visa & Mastercard via Belize Bank hosted gateway. 3-D Secure enabled.",
    badge: "Recommended"
  },
  {
    id: "atlantic_bank_card",
    label: "Atlantic Bank – Credit/Debit Card",
    desc: "Secure card processing via Atlantic Bank. CVV2 authentication.",
    badge: ""
  },
  {
    id: "belize_bank_transfer",
    label: "Belize Bank – Online Transfer",
    desc: "Direct bank-to-bank transfer via Belize Bank Online Banking.",
    badge: ""
  },
  {
    id: "atlantic_bank_transfer",
    label: "Atlantic Bank – Online Transfer",
    desc: "Transfer via Atlantic Bank Corporate Online Banking.",
    badge: ""
  },
  {
    id: "paypal",
    label: "PayPal",
    desc: "Pay securely with your PayPal account or linked card.",
    badge: "Global"
  },
];

export const CATEGORIES = [
  { id: 1, key: "clothing", label: "Clothing", emoji: "👗" },
  { id: 2, key: "shoes", label: "Shoes", emoji: "👟" },
  { id: 3, key: "accessories", label: "Accessories", emoji: "📿" },
  { id: 4, key: "lifestyle", label: "Lifestyle", emoji: "⌚" },
];

export const EXTERNAL_STORES = [
  {
    name: "Amazon",
    url: STORE_LINKS.amazon,
    color: "#FF9900",
    desc: "World's largest online marketplace. Electronics, fashion, home and more.",
    tags: ["Electronics", "Fashion", "Home", "Books"]
  },
  {
    name: "Shein",
    url: STORE_LINKS.shein,
    color: "#e74c3c",
    desc: "Trendy fashion at affordable prices. Clothes, shoes and accessories.",
    tags: ["Women", "Men", "Kids", "Accessories"]
  },
  {
    name: "Temu",
    url: STORE_LINKS.temu,
    color: "#e67e22",
    desc: "Quality products at factory prices. Wide range of categories.",
    tags: ["Fashion", "Home", "Electronics", "Beauty"]
  },
  {
    name: "Alibaba",
    url: STORE_LINKS.alibaba,
    color: "#FF6A00",
    desc: "Global wholesale marketplace. Bulk orders and unique finds.",
    tags: ["Wholesale", "Fashion", "Accessories", "Footwear"]
  },
];

export const NAV_LINKS = [
  ["home", "Home"],
  ["featured", "Featured"],
  ["orders", "Orders"],
  ["about", "About"],
  ["customer-service", "Customer Service"],
  ["online-stores", "Online Stores"],
];
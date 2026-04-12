import { useState, useEffect } from "react";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePhotograph,
  HiOutlineEye,
  HiOutlineEyeOff
} from "react-icons/hi";
import { STORE_COLORS } from "../../data/constants";

export default function AdminProducts({ showNotification }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_bzd: "",
    stock_qty: "",
    brand: "",
    category_id: 1,
    external_store: "own",
    is_active: true,
    featured: false,
    sizes: "",
    colors: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await fetch(`http://localhost:3001/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !product.is_active })
      });
      fetchProducts();
      showNotification(`Product ${product.is_active ? "hidden" : "activated"}!`);
    } catch (err) {
      showNotification("Error updating product", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE"
      });
      fetchProducts();
      showNotification("Product deleted");
    } catch (err) {
      showNotification("Error deleting product", "error");
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price_bzd) {
      showNotification("Name and price are required", "error");
      return;
    }
    try {
      const method = editProduct ? "PUT" : "POST";
      const url = editProduct
        ? `http://localhost:3001/api/products/${editProduct.id}`
        : "http://localhost:3001/api/products";

      const body = {
        ...form,
        price_bzd: parseFloat(form.price_bzd),
        stock_qty: parseInt(form.stock_qty) || 0,
        sizes: form.sizes ? JSON.stringify(form.sizes.split(",").map(s => s.trim())) : "[]",
        colors: form.colors ? JSON.stringify(form.colors.split(",").map(c => c.trim())) : "[]"
      };

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      fetchProducts();
      setShowForm(false);
      setEditProduct(null);
      showNotification(editProduct ? "Product updated!" : "Product added!");
      setForm({
        name: "", description: "", price_bzd: "", stock_qty: "",
        brand: "", category_id: 1, external_store: "own",
        is_active: true, featured: false, sizes: "", colors: ""
      });
    } catch (err) {
      showNotification("Error saving product", "error");
    }
  };

  const filtered = products.filter(p =>
    !searchQuery ||
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CATEGORIES = [
    { id: 1, label: "Clothing" },
    { id: 2, label: "Shoes" },
    { id: 3, label: "Accessories" },
    { id: 4, label: "Lifestyle" }
  ];

  return (
    <div>
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.5rem"
        }}>
          Manage Products
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <HiOutlineSearch
              size={16}
              color="var(--muted)"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)"
              }}
            />
            <input
              style={{
                border: "1.5px solid var(--border)",
                borderRadius: 8,
                padding: "8px 12px 8px 32px",
                fontSize: "0.85rem",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                width: 200
              }}
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: "0.85rem" }}
            onClick={() => { setShowForm(true); setEditProduct(null); }}
          >
            <HiOutlinePlus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* ADD/EDIT FORM */}
      {showForm && (
        <div style={{
          background: "#f0f7ff",
          border: "1px solid #dbeafe",
          borderRadius: 16,
          padding: "1.5rem",
          marginBottom: "1.5rem"
        }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>
            {editProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem"
          }}>
            {[
              ["Product Name *", "name", "text"],
              ["Brand", "brand", "text"],
              ["Price (BZD) *", "price_bzd", "number"],
              ["Stock Quantity", "stock_qty", "number"],
              ["Sizes (comma separated)", "sizes", "text"],
              ["Colors (comma separated)", "colors", "text"],
            ].map(([label, field, type]) => (
              <div key={field}>
                <label className="form-label">{label}</label>
                <input
                  className="form-input"
                  type={type}
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  placeholder={label}
                />
              </div>
            ))}

            <div>
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: parseInt(e.target.value) })}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Store</label>
              <select
                className="form-input"
                value={form.external_store}
                onChange={e => setForm({ ...form, external_store: e.target.value })}
              >
                {["own", "amazon", "shein", "temu", "alibaba"].map(s => (
                  <option key={s} value={s}>
                    {s === "own" ? "B-Com Original" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              style={{ height: 80 }}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Product description..."
            />
          </div>

          <div style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: "1rem",
            marginBottom: "1rem"
          }}>
            {[
              ["Active", "is_active"],
              ["Featured", "featured"]
            ].map(([label, field]) => (
              <label key={field} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500
              }}>
                <input
                  type="checkbox"
                  checked={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.checked })}
                  style={{ accentColor: "#2563EB" }}
                />
                {label}
              </label>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" onClick={handleSubmit}>
              {editProduct ? "Update Product" : "Add Product"}
            </button>
            <button
              className="btn-secondary"
              onClick={() => { setShowForm(false); setEditProduct(null); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS TABLE */}
      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading products...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Image", "Name", "Price", "Stock", "Store", "Status", "Actions"].map(h => (
                  <th key={h} style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "var(--muted)",
                    borderBottom: "2px solid var(--border)",
                    whiteSpace: "nowrap"
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr
                  key={product.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    opacity: product.is_active ? 1 : 0.5
                  }}
                >
                  <td style={{ padding: "10px 12px" }}>
                    {product.images ? (
                      <img
                        src={product.images}
                        alt={product.name}
                        style={{
                          width: 44,
                          height: 44,
                          objectFit: "cover",
                          borderRadius: 8
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 44,
                        height: 44,
                        background: "var(--border)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <HiOutlinePhotograph size={20} color="var(--muted)" />
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{product.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{product.brand}</div>
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>
                    BZ$ {parseFloat(product.price_bzd || 0).toFixed(2)}
                  </td>
                  <td style={{
                    padding: "10px 12px",
                    color: product.stock_qty === 0 ? "#e05c6a" : "inherit",
                    fontWeight: product.stock_qty === 0 ? 700 : 400
                  }}>
                    {product.stock_qty === 0 ? "⚠️ Out" : product.stock_qty}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      background: (STORE_COLORS[product.external_store || "own"] + "22"),
                      color: STORE_COLORS[product.external_store || "own"],
                      padding: "2px 8px",
                      borderRadius: 8,
                      fontSize: "0.72rem",
                      fontWeight: 700
                    }}>
                      {product.external_store || "own"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      background: product.is_active ? "#f0fdf4" : "#fff0f2",
                      color: product.is_active ? "#22c55e" : "#e05c6a",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: "0.72rem",
                      fontWeight: 700
                    }}>
                      {product.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        style={{
                          background: "#f0f7ff",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px",
                          cursor: "pointer",
                          color: "#2563EB",
                          display: "flex",
                          alignItems: "center"
                        }}
                        onClick={() => {
                          setEditProduct(product);
                          setForm({
                            name: product.name || "",
                            description: product.description || "",
                            price_bzd: product.price_bzd || "",
                            stock_qty: product.stock_qty || "",
                            brand: product.brand || "",
                            category_id: product.category_id || 1,
                            external_store: product.external_store || "own",
                            is_active: product.is_active,
                            featured: product.featured,
                            sizes: product.sizes ? JSON.parse(product.sizes).join(", ") : "",
                            colors: product.colors ? JSON.parse(product.colors).join(", ") : ""
                          });
                          setShowForm(true);
                        }}
                        title="Edit"
                      >
                        <HiOutlinePencil size={14} />
                      </button>
                      <button
                        style={{
                          background: product.is_active ? "#fff8e1" : "#f0fdf4",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px",
                          cursor: "pointer",
                          color: product.is_active ? "#f59e0b" : "#22c55e",
                          display: "flex",
                          alignItems: "center"
                        }}
                        onClick={() => handleToggleActive(product)}
                        title={product.is_active ? "Hide" : "Show"}
                      >
                        {product.is_active
                          ? <HiOutlineEyeOff size={14} />
                          : <HiOutlineEye size={14} />
                        }
                      </button>
                      <button
                        style={{
                          background: "#fff0f2",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px",
                          cursor: "pointer",
                          color: "#e05c6a",
                          display: "flex",
                          alignItems: "center"
                        }}
                        onClick={() => handleDelete(product.id)}
                        title="Delete"
                      >
                        <HiOutlineTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
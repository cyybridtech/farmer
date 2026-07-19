import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface SellProduceModalProps {
  currentUser: { id: number; name: string; role: string } | null;
  onClose: () => void;
  onSuccess: () => void;
  onRegisterClick: () => void;
}

export default function SellProduceModal({
  currentUser,
  onClose,
  onSuccess,
  onRegisterClick,
}: SellProduceModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    categoryId: "",
    title: "",
    description: "",
    pricePerUnit: "",
    unit: "kg",
    quantityAvailable: "",
    location: "",
    organic: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId: currentUser.id,
          ...form,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => onSuccess(), 2000);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to list product");
      }
    } catch (e) {
      console.error("Error listing product:", e);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const units = ["kg", "gram", "ton", "bunch", "piece", "crate", "bag", "liter", "dozen"];

  if (!currentUser || currentUser.role !== "farmer") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            maxWidth: "380px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: "50px", marginBottom: "16px" }}>🌾</div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
            Farmers Only
          </h3>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>
            You need to be registered as a farmer to list produce on the marketplace.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button onClick={onClose} style={{ padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", fontWeight: 600 }}>
              Cancel
            </button>
            <button
              onClick={() => { onClose(); onRegisterClick(); }}
              style={{ padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700 }}
            >
              Register as Farmer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #14532d, #16a34a)",
            padding: "24px 28px",
            borderRadius: "20px 20px 0 0",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "2px" }}>
              🌾 List Your Produce
            </h2>
            <p style={{ fontSize: "13px", opacity: 0.85 }}>
              Fill in the details to list your produce for sale
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>

        {success ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#16a34a", marginBottom: "8px" }}>
              Listed Successfully!
            </h3>
            <p style={{ color: "#64748b" }}>
              Your produce has been added to the marketplace. Buyers can now find and order it.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: "28px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Category */}
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>
                  Category *
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                    background: "white",
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Tomatoes, Sweet Mangoes"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe your produce — quality, how it was grown, harvest date..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              {/* Price and Unit */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>
                    Price (GH₵) *
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: "13px", fontWeight: 600 }}>
                      GH₵
                    </span>
                    <input
                      type="number"
                      required
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      value={form.pricePerUnit}
                      onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px 10px 44px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>
                    Unit *
                  </label>
                  <select
                    required
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "14px",
                      outline: "none",
                      background: "white",
                    }}
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>
                  Quantity Available *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step="0.1"
                  placeholder={`How many ${form.unit} do you have?`}
                  value={form.quantityAvailable}
                  onChange={(e) => setForm({ ...form, quantityAvailable: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              {/* Location */}
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>
                  📍 Farm Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kumasi, Ghana"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              {/* Organic toggle */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  padding: "14px",
                  border: `2px solid ${form.organic ? "#16a34a" : "#e2e8f0"}`,
                  borderRadius: "12px",
                  background: form.organic ? "#f0fdf4" : "white",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.organic}
                  onChange={(e) => setForm({ ...form, organic: e.target.checked })}
                  style={{ accentColor: "#16a34a", width: "18px", height: "18px" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: form.organic ? "#16a34a" : "#1e293b" }}>
                    🌿 Organically Grown
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Check this if your produce is grown without synthetic pesticides/fertilizers
                  </div>
                </div>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: loading
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #16a34a, #22c55e)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 15px rgba(22, 163, 74, 0.3)",
                  marginTop: "4px",
                }}
              >
                {loading ? "Listing Produce..." : "🌾 List on Marketplace"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

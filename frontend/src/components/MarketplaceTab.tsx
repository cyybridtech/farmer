import { useState, useEffect, useCallback } from "react";
import OrderModal from "./OrderModal";

interface Product {
  id: number;
  title: string;
  description: string;
  pricePerUnit: string;
  unit: string;
  quantityAvailable: string;
  location: string;
  imageUrl: string;
  organic: boolean;
  farmerName: string;
  farmerPhone: string;
  farmerInitials: string;
  categoryName: string;
  categoryIcon: string;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface MarketplaceTabProps {
  currentUser: { id: number; name: string; role: string; avatarInitials: string } | null;
  onSellClick: () => void;
  onRegisterClick: () => void;
}

export default function MarketplaceTab({
  currentUser,
  onSellClick,
  onRegisterClick,
}: MarketplaceTabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (search) params.set("search", search);
      if (organicOnly) params.set("organic", "true");

      const res = await fetch(`/api/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to fetch products", e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, organicOnly]);

  useEffect(() => {
    let active = true;
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok && active) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (e) {
        console.error("Failed to fetch categories", e);
      }
    }
    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div id="marketplace-content">
      {/* Filters */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "16px",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search produce, farmer, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 38px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "10px 14px",
              border: "2px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "14px",
              outline: "none",
              background: "white",
              cursor: "pointer",
              minWidth: "160px",
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          {/* Organic toggle */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "10px 14px",
              border: `2px solid ${organicOnly ? "#16a34a" : "#e2e8f0"}`,
              borderRadius: "10px",
              background: organicOnly ? "#f0fdf4" : "white",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              style={{ accentColor: "#16a34a", width: "16px", height: "16px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: 600, color: organicOnly ? "#16a34a" : "#64748b" }}>
              🌿 Organic Only
            </span>
          </label>

          {/* Sell button */}
          {currentUser?.role === "farmer" && (
            <button
              onClick={onSellClick}
              style={{
                background: "linear-gradient(135deg, #16a34a, #22c55e)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)",
              }}
            >
              + List Produce
            </button>
          )}
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedCategory("all")}
            style={{
              padding: "5px 14px",
              borderRadius: "20px",
              border: "none",
              background: selectedCategory === "all" ? "#16a34a" : "#f1f5f9",
              color: selectedCategory === "all" ? "white" : "#64748b",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                padding: "5px 14px",
                borderRadius: "20px",
                border: "none",
                background: selectedCategory === cat.name ? "#16a34a" : "#f1f5f9",
                color: selectedCategory === cat.name ? "white" : "#64748b",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontSize: "15px", color: "#64748b" }}>
          {loading ? "Loading..." : `${products.length} listing${products.length !== 1 ? "s" : ""} found`}
        </div>
        {!currentUser && (
          <button
            onClick={onRegisterClick}
            style={{
              background: "#f0fdf4",
              color: "#16a34a",
              border: "1px solid #bbf7d0",
              padding: "7px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            👨‍🌾 Are you a farmer? Register to sell
          </button>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
          <div className="spinner" />
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "#94a3b8",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>🌾</div>
          <div style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
            No produce found
          </div>
          <div>Try adjusting your filters or search terms</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentUser={currentUser}
              onOrder={() => setOrderProduct(product)}
              onRegisterClick={onRegisterClick}
            />
          ))}
        </div>
      )}

      {orderProduct && currentUser && (
        <OrderModal
          product={orderProduct}
          currentUser={currentUser}
          onClose={() => setOrderProduct(null)}
          onSuccess={() => {
            setOrderProduct(null);
            fetchProducts();
          }}
        />
      )}

      {orderProduct && !currentUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOrderProduct(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              maxWidth: "360px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "50px", marginBottom: "16px" }}>🔐</div>
            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
              Login Required
            </h3>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>
              Please register/login to place an order.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => setOrderProduct(null)}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setOrderProduct(null);
                  onRegisterClick();
                }}
                style={{
                  padding: "10px 20px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Register / Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  currentUser,
  onOrder,
  onRegisterClick,
}: {
  product: Product;
  currentUser: { id: number; name: string; role: string } | null;
  onOrder: () => void;
  onRegisterClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="card-hover animate-fadeIn"
      style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "180px", background: "#f0fdf4" }}>
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "60px",
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
            }}
          >
            {product.categoryIcon}
          </div>
        )}
        {product.organic && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "#16a34a",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "20px",
            }}
          >
            🌿 Organic
          </span>
        )}
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            fontSize: "11px",
            padding: "3px 10px",
            borderRadius: "20px",
            backdropFilter: "blur(4px)",
          }}
        >
          {product.categoryIcon} {product.categoryName}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px", color: "#1e293b" }}>
          {product.title}
        </h3>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px", lineHeight: 1.5 }}>
          {product.description?.slice(0, 80)}
          {(product.description?.length || 0) > 80 ? "..." : ""}
        </p>

        {/* Price */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
            padding: "10px 12px",
            background: "#f0fdf4",
            borderRadius: "10px",
          }}
        >
          <div>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#16a34a" }}>
              GH₵ {parseFloat(product.pricePerUnit).toFixed(0)}
            </span>
            <span style={{ fontSize: "13px", color: "#64748b" }}>/{product.unit}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Available</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
              {parseFloat(product.quantityAvailable).toFixed(0)} {product.unit}
            </div>
          </div>
        </div>

        {/* Farmer info */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #16a34a, #4ade80)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            {product.farmerInitials || product.farmerName?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
              {product.farmerName}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>📍 {product.location}</div>
          </div>
        </div>

        {/* Order button */}
        <button
          onClick={currentUser ? onOrder : onRegisterClick}
          style={{
            width: "100%",
            padding: "10px",
            background:
              currentUser?.role === "farmer"
                ? "#f1f5f9"
                : "linear-gradient(135deg, #16a34a, #22c55e)",
            color: currentUser?.role === "farmer" ? "#94a3b8" : "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: currentUser?.role === "farmer" ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
          disabled={currentUser?.role === "farmer"}
        >
          {currentUser?.role === "farmer"
            ? "Switch to Buyer to Order"
            : currentUser
            ? "🛒 Place Order"
            : "🔐 Login to Order"}
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";

interface Product {
  id: number;
  title: string;
  pricePerUnit: string;
  unit: string;
  quantityAvailable: string;
  farmerName: string;
  farmerPhone: string;
}

interface OrderModalProps {
  product: Product;
  currentUser: { id: number; name: string; role: string };
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderModal({
  product,
  currentUser,
  onClose,
  onSuccess,
}: OrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = parseFloat(product.pricePerUnit) * quantity;
  const maxQty = parseFloat(product.quantityAvailable);

  const handleOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: currentUser.id,
          productId: product.id,
          quantity,
          deliveryAddress,
          notes,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to place order");
      }
    } catch (e) {
      console.error("Order error:", e);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          padding: "32px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>✅</div>
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#16a34a", marginBottom: "8px" }}>
              Order Placed!
            </h3>
            <p style={{ color: "#64748b" }}>
              Your order has been sent to {product.farmerName}. They will contact you at your delivery address.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b" }}>
                🛒 Place Order
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Product summary */}
            <div
              style={{
                background: "#f0fdf4",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
                border: "1px solid #bbf7d0",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>
                {product.title}
              </div>
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                Farmer: {product.farmerName} • GH₵ {parseFloat(product.pricePerUnit).toFixed(0)}/{product.unit}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "8px" }}>
                Quantity ({product.unit})
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    background: "white",
                    fontSize: "18px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={maxQty}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(maxQty, Math.max(1, Number(e.target.value))))
                  }
                  style={{
                    width: "80px",
                    textAlign: "center",
                    padding: "8px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 700,
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    background: "white",
                    fontSize: "18px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  +
                </button>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Max: {maxQty} {product.unit}
                </span>
              </div>
            </div>

            {/* Delivery address */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "8px" }}>
                📍 Delivery Address *
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                rows={2}
                style={{
                  width: "100%",
                  padding: "10px 12px",
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

            {/* Notes */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "8px" }}>
                📝 Special Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or instructions..."
                rows={2}
                style={{
                  width: "100%",
                  padding: "10px 12px",
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

            {/* Total */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "#94a3b8", fontSize: "13px" }}>Total Amount</div>
                <div style={{ color: "white", fontSize: "24px", fontWeight: 800 }}>
                  GH₵ {total.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                  {quantity} {product.unit} × GH₵ {parseFloat(product.pricePerUnit).toFixed(0)}
                </div>
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleOrder}
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
              }}
            >
              {loading ? "Placing Order..." : "✅ Confirm Order"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

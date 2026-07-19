import { useState, useEffect } from "react";

interface Order {
  id: number;
  quantity: string;
  totalPrice: string;
  status: string;
  deliveryAddress: string;
  notes: string;
  createdAt: string;
  productTitle: string;
  productUnit: string;
  productImage: string;
  farmerName: string;
  farmerPhone: string;
}

interface OrdersTabProps {
  currentUser: { id: number; name: string; role: string; avatarInitials: string } | null;
  onRegisterClick: () => void;
}

export default function OrdersTab({ currentUser, onRegisterClick }: OrdersTabProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = currentUser ? `?buyerId=${currentUser.id}` : "";
        const res = await fetch(`/api/orders${params}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error("Failed to fetch orders", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string; icon: string }> = {
      pending: { bg: "#fef9c3", color: "#a16207", icon: "⏳" },
      confirmed: { bg: "#dbeafe", color: "#1d4ed8", icon: "✅" },
      delivered: { bg: "#dcfce7", color: "#15803d", icon: "🚚" },
      cancelled: { bg: "#fee2e2", color: "#dc2626", icon: "❌" },
    };
    return styles[status] || styles.pending;
  };

  if (!currentUser) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>
          Track Your Orders
        </h2>
        <p style={{ color: "#64748b", marginBottom: "24px", maxWidth: "360px", margin: "0 auto 24px" }}>
          Login or register to view your order history and track deliveries from farmers.
        </p>
        <button
          onClick={onRegisterClick}
          style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            color: "white",
            border: "none",
            padding: "12px 28px",
            borderRadius: "20px",
            fontWeight: 700,
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          🔐 Login / Register
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b, #334155)",
          borderRadius: "20px",
          padding: "28px 32px",
          marginBottom: "24px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "4px" }}>
            📦 My Orders
          </h2>
          <p style={{ opacity: 0.8, fontSize: "14px" }}>
            Welcome back, {currentUser.name} — {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["pending", "confirmed", "delivered"].map((status) => (
            <div
              key={status}
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,0.1)",
                padding: "8px 14px",
                borderRadius: "10px",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 800 }}>
                {orders.filter((o) => o.status === status).length}
              </div>
              <div style={{ fontSize: "10px", opacity: 0.7, textTransform: "capitalize" }}>
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "white",
            borderRadius: "20px",
            color: "#94a3b8",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>📋</div>
          <div style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
            No orders yet
          </div>
          <div>Browse the marketplace to place your first order</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => {
            const statusStyle = getStatusStyle(order.status);
            return (
              <div
                key={order.id}
                className="card-hover animate-fadeIn"
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {/* Left color stripe */}
                <div
                  style={{
                    width: "6px",
                    background: statusStyle.color,
                    flexShrink: 0,
                  }}
                />

                <div style={{ padding: "20px", flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1e293b" }}>
                          {order.productTitle}
                        </h3>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: "12px",
                            background: statusStyle.bg,
                            color: statusStyle.color,
                          }}
                        >
                          {statusStyle.icon} {order.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                        Order #{order.id} • {new Date(order.createdAt).toLocaleDateString("en-GH", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: "#16a34a" }}>
                        GH₵ {parseFloat(order.totalPrice).toLocaleString("en-GH")}
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        {parseFloat(order.quantity).toFixed(0)} {order.productUnit}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: "10px",
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "2px" }}>
                        FARMER
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>
                        👨‍🌾 {order.farmerName}
                      </div>
                      {order.farmerPhone && (
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          📞 {order.farmerPhone}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: "10px",
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "2px" }}>
                        DELIVERY ADDRESS
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 600 }}>
                        📍 {order.deliveryAddress || "Not specified"}
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div
                      style={{
                        marginTop: "10px",
                        background: "#fffbeb",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        fontSize: "13px",
                        color: "#92400e",
                        border: "1px solid #fef3c7",
                      }}
                    >
                      📝 {order.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

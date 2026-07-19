import { useState, useEffect } from "react";

import type { Tab } from "@/types";

interface Farmer {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarInitials: string;
  createdAt: string;
}

interface FarmersTabProps {
  setActiveTab?: (tab: Tab) => void;
}

export default function FarmersTab({ setActiveTab }: FarmersTabProps) {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await fetch("/api/users?role=farmer");
        if (res.ok) {
          const data = await res.json();
          setFarmers(data);
        }
      } catch (e) {
        console.error("Failed to fetch farmers", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  const avatarColors = [
    "linear-gradient(135deg, #16a34a, #4ade80)",
    "linear-gradient(135deg, #1d4ed8, #60a5fa)",
    "linear-gradient(135deg, #7c3aed, #a78bfa)",
    "linear-gradient(135deg, #d97706, #fcd34d)",
    "linear-gradient(135deg, #dc2626, #f87171)",
    "linear-gradient(135deg, #0891b2, #67e8f9)",
  ];

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
          background: "linear-gradient(135deg, #14532d, #16a34a)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "24px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "220px",
            height: "220px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "50%",
          }}
        />
        <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "8px", position: "relative" }}>
          👨‍🌾 Our Farmer Partners
        </h2>
        <p style={{ opacity: 0.9, fontSize: "15px", position: "relative" }}>
          Meet the dedicated farmers powering our marketplace with fresh, quality produce
        </p>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "20px",
            position: "relative",
          }}
        >
          <div style={{ background: "rgba(255,255,255,0.15)", padding: "10px 20px", borderRadius: "12px" }}>
            <div style={{ fontSize: "24px", fontWeight: 800 }}>{farmers.length}</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Active Farmers</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", padding: "10px 20px", borderRadius: "12px" }}>
            <div style={{ fontSize: "24px", fontWeight: 800 }}>
              {new Set(farmers.map((f) => f.location?.split(",")[1]?.trim() || f.location)).size}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Counties Covered</div>
          </div>
        </div>
      </div>

      {/* Farmer Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {farmers.map((farmer, i) => (
          <div
            key={farmer.id}
            className="card-hover animate-fadeIn"
            style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Card header with gradient */}
            <div
              style={{
                background: avatarColors[i % avatarColors.length],
                padding: "30px 24px 50px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  background: "rgba(255,255,255,0.25)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "white",
                  border: "3px solid rgba(255,255,255,0.5)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {farmer.avatarInitials || farmer.name.slice(0, 2).toUpperCase()}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(255,255,255,0.2)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                ✓ Verified Farmer
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "24px", marginTop: "-20px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#1e293b",
                  marginBottom: "4px",
                }}
              >
                {farmer.name}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                {farmer.location && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#64748b",
                    }}
                  >
                    <span
                      style={{
                        width: "28px",
                        height: "28px",
                        background: "#f0fdf4",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      📍
                    </span>
                    {farmer.location}
                  </div>
                )}
                {farmer.phone && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#64748b",
                    }}
                  >
                    <span
                      style={{
                        width: "28px",
                        height: "28px",
                        background: "#f0fdf4",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      📞
                    </span>
                    {farmer.phone}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: "#64748b",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      background: "#f0fdf4",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    📅
                  </span>
                  Joined{" "}
                  {new Date(farmer.createdAt).toLocaleDateString("en-GH", {
                    year: "numeric",
                    month: "long",
                  })}
                </div>
              </div>

              {/* Star rating display */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "16px",
                  padding: "10px",
                  background: "#fffbeb",
                  borderRadius: "10px",
                }}
              >
                <span style={{ fontSize: "14px" }}>⭐⭐⭐⭐⭐</span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#92400e",
                    fontWeight: 600,
                    marginLeft: "4px",
                  }}
                >
                  5.0 Rating
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "auto" }}>
                  Trusted Seller
                </span>
              </div>

              <button
                onClick={() => {
                  if (setActiveTab) {
                    setActiveTab("marketplace");
                    setTimeout(() => {
                      const el = document.getElementById("marketplace-content");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }
                }}
                style={{
                  marginTop: "14px",
                  width: "100%",
                  padding: "10px",
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "2px solid #bbf7d0",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = "#16a34a";
                  (e.target as HTMLButtonElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = "#f0fdf4";
                  (e.target as HTMLButtonElement).style.color = "#16a34a";
                }}
              >
                View Listings →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

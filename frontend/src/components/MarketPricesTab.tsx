import { useState, useEffect } from "react";

interface MarketPrice {
  id: number;
  productName: string;
  minPrice: string;
  maxPrice: string;
  avgPrice: string;
  unit: string;
  region: string;
  trend: string;
  updatedAt: string;
  categoryName: string;
  categoryIcon: string;
}

export default function MarketPricesTab() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/market-prices");
        if (res.ok) {
          const data = await res.json();
          setPrices(data);
          if (data.length > 0) {
            setLastUpdated(new Date(data[0].updatedAt).toLocaleString());
          }
        }
      } catch (e) {
        console.error("Failed to fetch prices", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "↑";
    if (trend === "down") return "↓";
    return "→";
  };

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "#16a34a";
    if (trend === "down") return "#dc2626";
    return "#64748b";
  };

  const getTrendBg = (trend: string) => {
    if (trend === "up") return "#f0fdf4";
    if (trend === "down") return "#fef2f2";
    return "#f8fafc";
  };

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
          background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
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
            top: "-30px",
            right: "-30px",
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.15)",
              padding: "5px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                background: "#4ade80",
                borderRadius: "50%",
                display: "inline-block",
              }}
              className="pulse-green"
            />
            Live Market Data • Accra Region
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "8px" }}>
            📊 Current Market Prices
          </h2>
          <p style={{ opacity: 0.85, fontSize: "15px" }}>
            Real-time wholesale prices to help farmers and buyers make informed decisions
          </p>
          {lastUpdated && (
            <div style={{ marginTop: "12px", fontSize: "12px", opacity: 0.7 }}>
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      </div>

      {/* Price summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
        className="price-summary-grid"
      >
        {[
          {
            label: "Rising Prices",
            count: prices.filter((p) => p.trend === "up").length,
            icon: "📈",
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            label: "Falling Prices",
            count: prices.filter((p) => p.trend === "down").length,
            icon: "📉",
            color: "#dc2626",
            bg: "#fef2f2",
          },
          {
            label: "Stable Prices",
            count: prices.filter((p) => p.trend === "stable").length,
            icon: "📊",
            color: "#64748b",
            bg: "#f8fafc",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: "14px",
              padding: "20px",
              textAlign: "center",
              border: `1px solid ${s.color}25`,
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>
              {s.count}
            </div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Prices Table */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: "16px" }}>Price Board — All Commodities</h3>
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            GH₵ per unit
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Commodity", "Category", "Min Price", "Avg Price", "Max Price", "Unit", "Trend"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {prices.map((price, i) => (
                <tr
                  key={price.id}
                  style={{
                    background: i % 2 === 0 ? "white" : "#fafafa",
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background = "#f0fdf4")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      i % 2 === 0 ? "white" : "#fafafa")
                  }
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>
                      {price.productName}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "#f1f5f9",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#475569",
                      }}
                    >
                      {price.categoryIcon} {price.categoryName}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#64748b", fontSize: "14px" }}>
                    GH₵ {parseFloat(price.minPrice).toFixed(0)}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "16px",
                        color: getTrendColor(price.trend),
                      }}
                    >
                      GH₵ {parseFloat(price.avgPrice).toFixed(0)}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#64748b", fontSize: "14px" }}>
                    GH₵ {parseFloat(price.maxPrice).toFixed(0)}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#64748b", fontSize: "13px" }}>
                    per {price.unit}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        background: getTrendBg(price.trend),
                        color: getTrendColor(price.trend),
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: `1px solid ${getTrendColor(price.trend)}30`,
                      }}
                    >
                      {getTrendIcon(price.trend)}{" "}
                      {price.trend.charAt(0).toUpperCase() + price.trend.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price chart bars (visual) */}
      <div
        style={{
          marginTop: "24px",
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: "16px", marginBottom: "20px" }}>
          📊 Price Range Visualization
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {prices.slice(0, 8).map((price) => {
            const max = parseFloat(price.maxPrice);
            const min = parseFloat(price.minPrice);
            const avg = parseFloat(price.avgPrice);
            const globalMax = Math.max(...prices.map((p) => parseFloat(p.maxPrice)));
            const barWidth = (avg / globalMax) * 100;

            return (
              <div key={price.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>
                    {price.categoryIcon} {price.productName}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    GH₵ {min}–{max} / {price.unit}
                  </span>
                </div>
                <div
                  style={{
                    height: "10px",
                    background: "#f1f5f9",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${getTrendColor(price.trend)}80, ${getTrendColor(price.trend)})`,
                      borderRadius: "6px",
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .price-summary-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

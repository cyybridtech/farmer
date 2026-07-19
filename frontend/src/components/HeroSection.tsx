import type { Tab } from "@/types";

interface HeroSectionProps {
  setActiveTab: (tab: Tab) => void;
}

export default function HeroSection({ setActiveTab }: HeroSectionProps) {
  const handleBrowse = () => {
    setActiveTab("marketplace");
    setTimeout(() => {
      const el = document.getElementById("marketplace-content");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handlePrices = () => {
    setActiveTab("prices");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #14532d 0%, #15803d 40%, #16a34a 70%, #22c55e 100%)",
        color: "white",
        padding: "60px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-40px",
          width: "250px",
          height: "250px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
        className="hero-grid"
      >
        {/* Text */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.15)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "20px",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ width: "8px", height: "8px", background: "#4ade80", borderRadius: "50%", display: "inline-block" }} className="pulse-green" />
            Live Marketplace • Real-Time Prices • 🇬🇭 Ghana
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "20px",
              letterSpacing: "-1px",
            }}
          >
            Fresh Produce,
            <br />
            <span style={{ color: "#86efac" }}>Fair Prices,</span>
            <br />
            Direct from Farmers
          </h1>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              opacity: 0.9,
              marginBottom: "32px",
              maxWidth: "460px",
            }}
          >
            AgriConnect bridges the gap between Ghanaian farmers and buyers. No middlemen,
            no hidden fees — just fair trade and fresh produce delivered straight
            from the farm to your table.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={handleBrowse}
              style={{
                background: "#4ade80",
                color: "#14532d",
                border: "none",
                padding: "14px 28px",
                borderRadius: "30px",
                fontWeight: 800,
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(74, 222, 128, 0.4)",
              }}
            >
              🛒 Browse Marketplace
            </button>
            <button
              onClick={handlePrices}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                border: "2px solid rgba(255,255,255,0.4)",
                padding: "14px 28px",
                borderRadius: "30px",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
              }}
            >
              📊 View Prices
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            { icon: "🌱", title: "Organic Produce", desc: "Certified fresh & natural" },
            { icon: "💰", title: "Fair Prices", desc: "No middleman markup" },
            { icon: "📡", title: "Live Market Data", desc: "Real-time price updates" },
            { icon: "🚚", title: "Fast Delivery", desc: "Farm to doorstep" },
          ].map((feat) => (
            <div
              key={feat.title}
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: "16px",
                padding: "20px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "transform 0.2s",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{feat.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>
                {feat.title}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

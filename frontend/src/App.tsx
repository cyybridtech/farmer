import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarketplaceTab from "@/components/MarketplaceTab";
import MarketPricesTab from "@/components/MarketPricesTab";
import OrdersTab from "@/components/OrdersTab";
import FarmersTab from "@/components/FarmersTab";
import SellProduceModal from "@/components/SellProduceModal";
import RegisterModal from "@/components/RegisterModal";
import Footer from "@/components/Footer";
import type { Tab } from "@/types";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("marketplace");
  const [showSellModal, setShowSellModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    name: string;
    role: string;
    avatarInitials: string;
  } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductListed = () => {
    setRefreshKey((k) => k + 1);
    setShowSellModal(false);
  };

  const handleRegistered = (user: {
    id: number;
    name: string;
    role: string;
    avatarInitials: string;
  }) => {
    setCurrentUser(user);
    setShowRegisterModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0fdf4" }}>
      <Navbar
        currentUser={currentUser}
        onSellClick={() => setShowSellModal(true)}
        onRegisterClick={() => setShowRegisterModal(true)}
        onLogout={() => setCurrentUser(null)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "marketplace" && (
        <HeroSection setActiveTab={setActiveTab} />
      )}

      {/* Tab Navigation */}
      <div
        style={{
          background: "white",
          borderBottom: "2px solid #e2e8f0",
          position: "sticky",
          top: "64px",
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            gap: "0",
            overflowX: "auto",
          }}
        >
          {(
            [
              { key: "marketplace", label: "🛒 Marketplace", desc: "Buy Produce" },
              { key: "prices", label: "📊 Market Prices", desc: "Live Rates" },
              { key: "orders", label: "📦 Orders", desc: "Track Orders" },
              { key: "farmers", label: "👨‍🌾 Farmers", desc: "Our Partners" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "16px 24px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: activeTab === tab.key ? 700 : 500,
                fontSize: "14px",
                color: activeTab === tab.key ? "#16a34a" : "#64748b",
                borderBottom:
                  activeTab === tab.key
                    ? "3px solid #16a34a"
                    : "3px solid transparent",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <span>{tab.label}</span>
              <span style={{ fontSize: "11px", opacity: 0.7 }}>{tab.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "24px 16px", width: "100%" }}>
        {activeTab === "marketplace" && (
          <MarketplaceTab
            key={`marketplace-${refreshKey}`}
            currentUser={currentUser}
            onSellClick={() => setShowSellModal(true)}
            onRegisterClick={() => setShowRegisterModal(true)}
          />
        )}
        {activeTab === "prices" && <MarketPricesTab key={`prices-${refreshKey}`} />}
        {activeTab === "orders" && (
          <OrdersTab
            key={`orders-${refreshKey}`}
            currentUser={currentUser}
            onRegisterClick={() => setShowRegisterModal(true)}
          />
        )}
        {activeTab === "farmers" && (
          <FarmersTab key={`farmers-${refreshKey}`} setActiveTab={setActiveTab} />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />

      {showSellModal && (
        <SellProduceModal
          currentUser={currentUser}
          onClose={() => setShowSellModal(false)}
          onSuccess={handleProductListed}
          onRegisterClick={() => {
            setShowSellModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={handleRegistered}
        />
      )}
    </div>
  );
}

import type { Tab } from "@/types";

interface NavbarProps {
  currentUser: { id: number; name: string; role: string; avatarInitials: string } | null;
  onSellClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function Navbar({
  currentUser,
  onSellClick,
  onRegisterClick,
  onLogout,
}: NavbarProps) {
  return (
    <nav
      style={{
        background: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 4px 20px rgba(21, 128, 61, 0.3)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 16px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              backdropFilter: "blur(10px)",
            }}
          >
            🌾
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px" }}>
              AgriConnect
            </div>
            <div style={{ fontSize: "11px", opacity: 0.8, letterSpacing: "0.5px" }}>
              Farm-to-Table Marketplace
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {currentUser ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.1)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    background: "#4ade80",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#14532d",
                  }}
                >
                  {currentUser.avatarInitials}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{currentUser.name}</div>
                  <div style={{ fontSize: "10px", opacity: 0.8, textTransform: "capitalize" }}>
                    {currentUser.role}
                  </div>
                </div>
              </div>
              {currentUser.role === "farmer" && (
                <button
                  onClick={onSellClick}
                  style={{
                    background: "#4ade80",
                    color: "#14532d",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  + Sell Produce
                </button>
              )}
              <button
                onClick={onLogout}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "8px 14px",
                  borderRadius: "20px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onRegisterClick}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.4)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                }}
              >
                Register
              </button>
              <button
                onClick={onRegisterClick}
                style={{
                  background: "#4ade80",
                  color: "#14532d",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

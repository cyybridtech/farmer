import type { Tab } from "@/types";

interface FooterProps {
  setActiveTab?: (tab: Tab) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const goToTab = (tab: Tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const marketplaceLinks: { label: string; tab?: Tab }[] = [
    { label: "Browse Produce", tab: "marketplace" },
    { label: "Market Prices", tab: "prices" },
    { label: "Track Orders", tab: "orders" },
    { label: "Meet Farmers", tab: "farmers" },
    { label: "Sell Produce", tab: "marketplace" },
  ];

  const supportLinks = ["Help Center", "Contact Us", "Report Issue", "Privacy Policy", "Terms of Service"];

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
        marginTop: "48px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "48px 16px 24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
            marginBottom: "40px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", cursor: "pointer" }}
              onClick={scrollToTop}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #16a34a, #4ade80)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                🌾
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "18px" }}>AgriConnect</div>
                <div style={{ fontSize: "11px", opacity: 0.6 }}>Farm-to-Table 🇬🇭</div>
              </div>
            </div>
            <p style={{ fontSize: "14px", opacity: 0.7, lineHeight: 1.7 }}>
              Connecting farmers directly with buyers across Ghana. No middlemen, fair prices, fresh produce.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              {["📘", "🐦", "", "▶️"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)")}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 style={headingStyle}>Marketplace</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {marketplaceLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => link.tab && goToTab(link.tab)}
                  style={linkStyle}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
                >
                  → {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={headingStyle}>Support</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {supportLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    if (link === "Contact Us") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      alert(`${link} page coming soon!`);
                    }
                  }}
                  style={linkStyle}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
                >
                  → {link}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={headingStyle}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "📞", text: "+233 30 000 1234", href: "tel:+233300001234" },
                { icon: "📧", text: "hello@agriconnect.com.gh", href: "mailto:hello@agriconnect.com.gh" },
                { icon: "📍", text: "Accra, Ghana" },
                { icon: "⏰", text: "Mon–Fri, 8am–6pm GMT" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span>{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: "13px", opacity: 0.8, color: "white", textDecoration: "none" }}>
                      {item.text}
                    </a>
                  ) : (
                    <span style={{ fontSize: "13px", opacity: 0.8 }}>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "13px", opacity: 0.6 }}>
            © {new Date().getFullYear()} AgriConnect. Empowering farmers across Ghana 🇬🇭
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(22, 163, 74, 0.2)",
              padding: "6px 14px",
              borderRadius: "20px",
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
            <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: 600 }}>
              System Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const headingStyle: React.CSSProperties = {
  fontWeight: 700,
  marginBottom: "16px",
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  opacity: 0.6,
};

const linkStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "white",
  fontSize: "14px",
  opacity: 0.75,
  cursor: "pointer",
  textAlign: "left",
  padding: 0,
  fontFamily: "inherit",
  transition: "opacity 0.2s",
};

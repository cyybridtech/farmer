import { useState } from "react";

interface RegisterModalProps {
  onClose: () => void;
  onSuccess: (user: {
    id: number;
    name: string;
    role: string;
    avatarInitials: string;
  }) => void;
}

// Country phone codes (African focus + international)
const COUNTRY_CODES = [
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+225", flag: "🇨", name: "Côte d'Ivoire" },
  { code: "+221", flag: "🇸🇳", name: "Senegal" },
  { code: "+237", flag: "🇨🇲", name: "Cameroon" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+256", flag: "🇺🇬", name: "Uganda" },
  { code: "+255", flag: "🇹", name: "Tanzania" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+228", flag: "🇹🇬", name: "Togo" },
  { code: "+229", flag: "🇧🇯", name: "Benin" },
  { code: "+226", flag: "🇧", name: "Burkina Faso" },
  { code: "+223", flag: "🇲🇱", name: "Mali" },
  { code: "+227", flag: "🇳", name: "Niger" },
  { code: "+220", flag: "🇬🇲", name: "Gambia" },
  { code: "+232", flag: "🇸🇱", name: "Sierra Leone" },
  { code: "+231", flag: "🇱🇷", name: "Liberia" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
];

const COUNTRIES = [
  "Ghana", "Nigeria", "Côte d'Ivoire", "Senegal", "Cameroon", "Kenya",
  "Uganda", "Tanzania", "South Africa", "Togo", "Benin", "Burkina Faso",
  "Mali", "Niger", "Gambia", "Sierra Leone", "Liberia", "United Kingdom",
  "United States", "Other",
];

const GHANA_CITIES = [
  "Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast", "Sunyani",
  "Koforidua", "Ho", "Bolgatanga", "Wa", "Tema", "Obuasi", "Teshie",
  "Nungua", "Madina", "Ashaiman",
];

export default function RegisterModal({ onClose, onSuccess }: RegisterModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [countryCode, setCountryCode] = useState("+233");
  const [countryCodeOpen, setCountryCodeOpen] = useState(false);

  // Registration fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "buyer" as "farmer" | "buyer",
    country: "Ghana",
    city: "",
    customLocation: "",
  });

  // Login fields
  const [loginPhone, setLoginPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fullPhone = countryCode + loginPhone.replace(/\s/g, "").replace(/^\+/, "");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) {
      setError("Please enter your mobile number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users");
      const users = await res.json();
      const normalized = fullPhone.replace(/\s/g, "");
      const found = users.find((u: { phone: string }) => {
        const storedPhone = (u.phone || "").replace(/\s/g, "");
        return storedPhone === normalized;
      });
      if (found) {
        onSuccess({
          id: found.id,
          name: found.name,
          role: found.role,
          avatarInitials: found.avatarInitials || found.name.slice(0, 2).toUpperCase(),
        });
      } else {
        setError(`No account found for ${fullPhone}. Please register or check your number.`);
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fullRegisterPhone = countryCode + form.phone.replace(/\s/g, "").replace(/^\+/, "");
      const locationParts = [];
      if (form.city) locationParts.push(form.city);
      if (form.country) locationParts.push(form.country);
      if (form.customLocation) locationParts.push(form.customLocation);
      const location = locationParts.join(", ");

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: fullRegisterPhone,
          role: form.role,
          location,
        }),
      });

      if (res.ok) {
        const user = await res.json();
        onSuccess({
          id: user.id,
          name: user.name,
          role: user.role,
          avatarInitials: user.avatarInitials || user.name.slice(0, 2).toUpperCase(),
        });
      } else if (res.status === 500) {
        setError("This email or phone is already registered. Try logging in instead.");
      } else {
        const err = await res.json();
        setError(err.error || "Registration failed.");
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCode = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
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
          borderRadius: "24px",
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #14532d, #15803d)",
            padding: "28px",
            color: "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>🌾</div>
              <h2 style={{ fontSize: "22px", fontWeight: 900 }}>
                {isLogin ? "Welcome Back!" : "Join AgriConnect"}
              </h2>
              <p style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>
                {isLogin
                  ? "Sign in with your mobile number"
                  : "Connect with farmers and buyers across Ghana 🇬"}
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
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Toggle tabs */}
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "4px",
            }}
          >
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              style={{
                flex: 1,
                padding: "8px",
                border: "none",
                borderRadius: "8px",
                background: !isLogin ? "white" : "transparent",
                color: !isLogin ? "#16a34a" : "rgba(255,255,255,0.8)",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Register
            </button>
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              style={{
                flex: 1,
                padding: "8px",
                border: "none",
                borderRadius: "8px",
                background: isLogin ? "white" : "transparent",
                color: isLogin ? "#16a34a" : "rgba(255,255,255,0.8)",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "14px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {isLogin ? (
            <>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>
                  📱 Mobile Number *
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {/* Country code dropdown */}
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => setCountryCodeOpen(!countryCodeOpen)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 12px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        background: "white",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 600,
                        minWidth: "90px",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{selectedCode.flag} {selectedCode.code}</span>
                      <span style={{ fontSize: "10px" }}>▼</span>
                    </button>
                    {countryCodeOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          marginTop: "4px",
                          background: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "10px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                          maxHeight: "240px",
                          overflowY: "auto",
                          zIndex: 20,
                          width: "220px",
                        }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setCountryCode(c.code);
                              setCountryCodeOpen(false);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "100%",
                              padding: "10px 14px",
                              border: "none",
                              background: c.code === countryCode ? "#f0fdf4" : "white",
                              cursor: "pointer",
                              textAlign: "left",
                              fontSize: "13px",
                            }}
                          >
                            <span style={{ fontSize: "18px" }}>{c.flag}</span>
                            <span style={{ flex: 1 }}>{c.name}</span>
                            <span style={{ fontWeight: 700, color: "#16a34a" }}>{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Phone number */}
                  <input
                    type="tel"
                    required
                    placeholder="24 123 4567"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>
                  Full number: <strong>{fullPhone}</strong>
                </div>
              </div>

              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "10px",
                  padding: "12px",
                  fontSize: "12px",
                  color: "#166534",
                }}
              >
                <strong>Demo numbers:</strong><br />
                🇬🇭 +233 244123456 (farmer — Kwame)<br />
                🇬🇭 +233 244567890 (buyer — Yaw)
              </div>
            </>
          ) : (
            <>
              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Kwame Mensah"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              {/* Phone with country code */}
              <div>
                <label style={labelStyle}>📱 Mobile Number *</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => setCountryCodeOpen(!countryCodeOpen)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 12px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        background: "white",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 600,
                        minWidth: "90px",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{selectedCode.flag} {selectedCode.code}</span>
                      <span style={{ fontSize: "10px" }}>▼</span>
                    </button>
                    {countryCodeOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          marginTop: "4px",
                          background: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "10px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                          maxHeight: "240px",
                          overflowY: "auto",
                          zIndex: 20,
                          width: "220px",
                        }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setCountryCode(c.code);
                              setCountryCodeOpen(false);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "100%",
                              padding: "10px 14px",
                              border: "none",
                              background: c.code === countryCode ? "#f0fdf4" : "white",
                              cursor: "pointer",
                              textAlign: "left",
                              fontSize: "13px",
                            }}
                          >
                            <span style={{ fontSize: "18px" }}>{c.flag}</span>
                            <span style={{ flex: 1 }}>{c.name}</span>
                            <span style={{ fontWeight: 700, color: "#16a34a" }}>{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="24 123 4567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d\s]/g, "") })}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
              </div>

              {/* Role selection */}
              <div>
                <label style={labelStyle}>I am a... *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { value: "farmer", label: "Farmer", icon: "👨‍🌾", desc: "I sell produce" },
                    { value: "buyer", label: "Buyer", icon: "🛒", desc: "I buy produce" },
                  ].map((r) => (
                    <label
                      key={r.value}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "16px",
                        border: `2px solid ${form.role === r.value ? "#16a34a" : "#e2e8f0"}`,
                        borderRadius: "14px",
                        cursor: "pointer",
                        background: form.role === r.value ? "#f0fdf4" : "white",
                        transition: "all 0.2s",
                        gap: "6px",
                      }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={form.role === r.value}
                        onChange={() => setForm({ ...form, role: r.value as "farmer" | "buyer" })}
                        style={{ display: "none" }}
                      />
                      <span style={{ fontSize: "28px" }}>{r.icon}</span>
                      <span style={{ fontWeight: 700, color: form.role === r.value ? "#16a34a" : "#1e293b" }}>
                        {r.label}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{r.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div>
                <label style={labelStyle}>🌍 Country *</label>
                <select
                  required
                  value={form.country}
                  onChange={(e) => {
                    const newCountry = e.target.value;
                    setForm({ ...form, country: newCountry, city: "" });
                    // Auto-select country code for matching country
                    const matched = COUNTRY_CODES.find((c) => c.name === newCountry);
                    if (matched) setCountryCode(matched.code);
                  }}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* City selector — only for Ghana */}
              {form.country === "Ghana" ? (
                <div>
                  <label style={labelStyle}> City / Town *</label>
                  <select
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select your city</option>
                    {GHANA_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>📍 City / Region</label>
                  <input
                    type="text"
                    placeholder="Your city or region"
                    value={form.customLocation}
                    onChange={(e) => setForm({ ...form, customLocation: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#94a3b8" : "linear-gradient(135deg, #16a34a, #22c55e)",
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
            {loading
              ? isLogin ? "Signing In..." : "Creating Account..."
              : isLogin ? "🔐 Sign In" : "🌾 Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "2px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  fontSize: "14px",
  marginBottom: "6px",
};

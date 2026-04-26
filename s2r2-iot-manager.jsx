import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   S2R2 IoT Manager – Single File React App
   Pages: Login · Dashboard · Raw Materials · Finished Products · Client Base
   Storage: localStorage  |  Auth: hardcoded credentials
───────────────────────────────────────────────────────── */

// ── Brand colors ─────────────────────────────────────────
const BRAND = {
  primary: "#005bea",
  accent: "#00c6fb",
  sidebar: "#0a1628",
  sidebarHover: "#162040",
  active: "#0e7fde",
};

// ── Default sample data ───────────────────────────────────
const SAMPLE_RAW = [
  { id: 1, name: "PLC Controller", category: "Electronics", description: "Programmable Logic Controller for automation", quantity: 48, unit: "pcs", min_stock: 10, supplier: "Siemens India", location: "Rack A1", unit_price: 12500, status: "active", last_updated: "2025-04-20" },
  { id: 2, name: "RFID Antenna", category: "Sensors", description: "High-frequency RFID antenna 13.56MHz", quantity: 12, unit: "pcs", min_stock: 15, supplier: "Zebra Tech", location: "Rack B2", unit_price: 3200, status: "low_stock", last_updated: "2025-04-18" },
  { id: 3, name: "ESP32 Module", category: "Electronics", description: "WiFi + Bluetooth microcontroller", quantity: 87, unit: "pcs", min_stock: 20, supplier: "Espressif", location: "Rack A3", unit_price: 450, status: "active", last_updated: "2025-04-22" },
  { id: 4, name: "Power Supply 24V", category: "Electronics", description: "Industrial 24V DC power supply 10A", quantity: 5, unit: "pcs", min_stock: 8, supplier: "Phoenix Contact", location: "Rack C1", unit_price: 4800, status: "low_stock", last_updated: "2025-04-15" },
  { id: 5, name: "Temperature Sensor", category: "Sensors", description: "PT100 RTD temperature sensor -50 to 200°C", quantity: 156, unit: "pcs", min_stock: 30, supplier: "Honeywell", location: "Rack B1", unit_price: 850, status: "active", last_updated: "2025-04-21" },
  { id: 6, name: "LED Strip 5m", category: "Electronics", description: "Addressable RGB LED strip 60LEDs/m", quantity: 34, unit: "m", min_stock: 10, supplier: "Local Supplier", location: "Rack D2", unit_price: 220, status: "active", last_updated: "2025-04-19" },
];

const SAMPLE_FINISHED = [
  { id: 1, name: "Temperature Sensor Unit", type: "Sensor", serial_number: "TSU-2025-001", batch_number: "B-001", stock: 45, location: "Warehouse A", unit_price: 4500, quality_status: "passed", mfg_date: "2025-04-01", specs: "Range: -50 to 200°C, Accuracy: ±0.1°C, IP67" },
  { id: 2, name: "Smart Lighting Unit", type: "Actuator", serial_number: "SLU-2025-002", batch_number: "B-001", stock: 32, location: "Warehouse A", unit_price: 8200, quality_status: "passed", mfg_date: "2025-04-05", specs: "RGB, 0-10V dimming, Zigbee 3.0" },
  { id: 3, name: "Access Control Unit", type: "Controller", serial_number: "ACU-2025-003", batch_number: "B-002", stock: 12, location: "Warehouse B", unit_price: 22000, quality_status: "testing", mfg_date: "2025-04-10", specs: "RFID + Fingerprint, 10000 users" },
  { id: 4, name: "Surveillance Camera", type: "Sensor", serial_number: "SVC-2025-004", batch_number: "B-002", stock: 28, location: "Warehouse A", unit_price: 15000, quality_status: "passed", mfg_date: "2025-04-08", specs: "4MP, IR Night Vision, IP66, H.265" },
  { id: 5, name: "Motion Sensor Pro", type: "Sensor", serial_number: "MSP-2025-005", batch_number: "B-003", stock: 67, location: "Warehouse C", unit_price: 2800, quality_status: "passed", mfg_date: "2025-04-12", specs: "PIR + Microwave, 12m range, 110° FOV" },
  { id: 6, name: "Smart Relay Module", type: "Actuator", serial_number: "SRM-2025-006", batch_number: "B-003", stock: 41, location: "Warehouse B", unit_price: 1800, quality_status: "passed", mfg_date: "2025-04-15", specs: "8-channel, 10A/250VAC, Modbus RTU" },
];

const SAMPLE_CLIENTS = [
  { id: 1, client_name: "Tata Group", area: "Mumbai", contact_person: "Rajesh Sharma", email: "rajesh@tata.com", phone: "9876543210", status: "active", created_at: "2025-01-15" },
  { id: 2, client_name: "Cummins India", area: "Pune", contact_person: "Priya Mehta", email: "priya@cummins.com", phone: "9765432109", status: "active", created_at: "2025-02-10" },
  { id: 3, client_name: "Hoerbiger", area: "Pune", contact_person: "Amit Kulkarni", email: "amit@hoerbiger.com", phone: "9654321098", status: "active", created_at: "2025-02-20" },
  { id: 4, client_name: "Kalyani Technoforge", area: "Pune", contact_person: "Suresh Patil", email: "suresh@kalyani.com", phone: "9543210987", status: "active", created_at: "2025-03-01" },
  { id: 5, client_name: "JBM Group", area: "Delhi", contact_person: "Neha Singh", email: "neha@jbm.com", phone: "9432109876", status: "active", created_at: "2025-03-15" },
  { id: 6, client_name: "BRS Precision", area: "Pune", contact_person: "Vikram Joshi", email: "vikram@brs.com", phone: "9321098765", status: "inactive", created_at: "2025-04-01" },
  { id: 7, client_name: "Antolin", area: "Pune", contact_person: "Meera Desai", email: "meera@antolin.com", phone: "9210987654", status: "active", created_at: "2025-04-10" },
  { id: 8, client_name: "Cybernetik", area: "Pune", contact_person: "Ravi Nair", email: "ravi@cybernetik.com", phone: "9109876543", status: "active", created_at: "2025-04-20" },
];

const VALID_USERS = { admin: "admin123", user: "user123", s2r2: "s2r2@2025" };

// ── localStorage helpers ──────────────────────────────────
const store = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ── Icons (inline SVG) ────────────────────────────────────
const Icon = ({ name, size = 16, className = "" }) => {
  const paths = {
    dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    truck: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
    cube: "M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9z",
    users: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    plus: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    trash: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    search: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    chevronLeft: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
    chevronRight: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
    chevronDown: "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z",
    moon: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
    sun: "M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z",
    warning: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
    upload: "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z",
    menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    filter: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z",
    excel: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 3l-2.5 4 2.5 4h-2l-1.5-2.5L12 14h-2l2.5-4L10 6h2l1.5 2.5L15 6h2z",
    print: "M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z",
    save: "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z",
    alert: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
      <path d={paths[name] || paths.alert} />
    </svg>
  );
};

// ── Notification toast ────────────────────────────────────
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return { toasts, show };
};

const ToastContainer = ({ toasts }) => (
  <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        padding: "12px 20px", borderRadius: 10, fontWeight: 500, fontSize: 14, minWidth: 220,
        background: t.type === "success" ? "#10b981" : t.type === "error" ? "#ef4444" : "#3b82f6",
        color: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,.18)",
        animation: "slideIn .3s ease",
      }}>{t.msg}</div>
    ))}
  </div>
);

// ── Modal ─────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, wide = false }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: wide ? 720 : 500, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4, borderRadius: 6 }}><Icon name="close" size={20} /></button>
        </div>
        <div style={{ padding: "16px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
};

// ── Form field ────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: .5 }}>{label}</label>
    {children}
  </div>
);
const Input = (props) => (
  <input {...props} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box", ...props.style }}
    onFocus={e => e.target.style.borderColor = BRAND.primary} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
);
const Select = ({ children, ...props }) => (
  <select {...props} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, color: "#1e293b", background: "#f8fafc", outline: "none", ...props.style }}>
    {children}
  </select>
);

// ── Badge ─────────────────────────────────────────────────
const Badge = ({ label, color }) => {
  const colors = {
    green: { bg: "#d1fae5", text: "#065f46" },
    amber: { bg: "#fef3c7", text: "#92400e" },
    red: { bg: "#fee2e2", text: "#991b1b" },
    blue: { bg: "#dbeafe", text: "#1e40af" },
    gray: { bg: "#f1f5f9", text: "#475569" },
  };
  const c = colors[color] || colors.gray;
  return <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{label}</span>;
};

// ── Sidebar ───────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "raw-materials", label: "Raw Materials", icon: "truck" },
  { key: "finished-products", label: "Finished Products", icon: "cube" },
  { key: "client-base", label: "Client Base", icon: "users" },
];

const Sidebar = ({ page, setPage, collapsed, setCollapsed, onLogout, user, dark }) => (
  <>
    {/* Overlay for mobile */}
    {!collapsed && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 39, display: window.innerWidth < 768 ? "block" : "none" }} onClick={() => setCollapsed(true)} />}
    <aside style={{
      position: window.innerWidth < 768 ? "fixed" : "relative",
      left: window.innerWidth < 768 && collapsed ? "-100%" : 0,
      top: 0, bottom: 0, zIndex: 40,
      width: collapsed && window.innerWidth >= 768 ? 68 : 240,
      background: BRAND.sidebar,
      display: "flex", flexDirection: "column",
      transition: "width .25s ease, left .3s ease",
      minHeight: "100vh", flexShrink: 0,
      overflowX: "hidden",
    }}>
      {/* Logo area */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #005bea, #00c6fb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 13, letterSpacing: -1 }}>S2</span>
        </div>
        {(!collapsed || window.innerWidth < 768) && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: .5, whiteSpace: "nowrap" }}>S2R2 IoT</div>
            <div style={{ color: "rgba(255,255,255,.45)", fontSize: 10, whiteSpace: "nowrap" }}>Inventory Manager</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {NAV_ITEMS.map(item => {
          const active = page === item.key;
          return (
            <button key={item.key} onClick={() => { setPage(item.key); if (window.innerWidth < 768) setCollapsed(true); }}
              title={collapsed && window.innerWidth >= 768 ? item.label : ""}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: collapsed && window.innerWidth >= 768 ? "10px 0" : "10px 14px",
                justifyContent: collapsed && window.innerWidth >= 768 ? "center" : "flex-start",
                borderRadius: 10, marginBottom: 4, border: "none", cursor: "pointer",
                background: active ? "rgba(0,91,234,.45)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,.6)",
                fontWeight: active ? 700 : 500, fontSize: 14,
                borderLeft: active ? `3px solid ${BRAND.accent}` : "3px solid transparent",
                transition: "all .18s",
              }}>
              <Icon name={item.icon} size={18} />
              {(!collapsed || window.innerWidth < 768) && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#005bea,#00c6fb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="user" size={16} className="" style={{ color: "#fff" }} />
          </div>
          {(!collapsed || window.innerWidth < 768) && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>{user}</div>
              <div style={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>Administrator</div>
            </div>
          )}
        </div>
        <button onClick={onLogout} title="Logout"
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: collapsed && window.innerWidth >= 768 ? "9px 0" : "9px 14px", justifyContent: collapsed && window.innerWidth >= 768 ? "center" : "flex-start", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(239,68,68,.12)", color: "#f87171", fontWeight: 600, fontSize: 13 }}>
          <Icon name="logout" size={16} />
          {(!collapsed || window.innerWidth < 768) && "Logout"}
        </button>
      </div>
    </aside>
  </>
);

// ── Top bar ───────────────────────────────────────────────
const TopBar = ({ title, collapsed, setCollapsed, dark, setDark }) => (
  <header style={{ background: `linear-gradient(90deg, ${BRAND.primary} 0%, ${BRAND.accent} 100%)`, color: "#fff", padding: "0 20px", height: 60, display: "flex", alignItems: "center", gap: 16, flexShrink: 0, boxShadow: "0 2px 12px rgba(0,91,234,.25)" }}>
    <button onClick={() => setCollapsed(c => !c)} style={{ background: "rgba(255,255,255,.15)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer", color: "#fff", display: "flex" }}>
      <Icon name="menu" size={18} />
    </button>
    <span style={{ fontSize: 16, fontWeight: 700, flex: 1, letterSpacing: .3 }}>{title}</span>
    <button onClick={() => { setDark(d => !d); }} style={{ background: "rgba(255,255,255,.15)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer", color: "#fff", display: "flex" }}>
      <Icon name={dark ? "sun" : "moon"} size={18} />
    </button>
  </header>
);

// ═══════════════════════════════════════════════════════════
// PAGE: LOGIN
// ═══════════════════════════════════════════════════════════
const LoginPage = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { setErr("Please enter both username and password"); return; }
    setLoading(true);
    setTimeout(() => {
      if (VALID_USERS[form.username] === form.password) {
        onLogin(form.username);
      } else {
        setErr("Invalid credentials. Try admin / admin123");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a1628 0%, #0e3060 50%, #005bea 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", padding: 20, position: "relative", overflow: "hidden" }}>
      {/* BG circles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: "absolute", borderRadius: "50%", background: `rgba(0,198,251,${.04 + i * .01})`, width: 100 + i * 120, height: 100 + i * 120, top: `${10 + i * 8}%`, left: `${-10 + i * 12}%`, pointerEvents: "none" }} />
      ))}
      <div style={{ background: "rgba(255,255,255,.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 24, padding: "48px 40px", width: "100%", maxWidth: 420, boxShadow: "0 32px 80px rgba(0,0,0,.4)", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#005bea,#00c6fb)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 8px 32px rgba(0,91,234,.4)" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: -1 }}>S2R2</span>
          </div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: .5 }}>IoT Manager</div>
          <div style={{ color: "rgba(255,255,255,.5)", fontSize: 13, marginTop: 4 }}>Inventory Management System</div>
        </div>

        <form onSubmit={submit}>
          {err && <div style={{ background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.35)", borderRadius: 10, padding: "10px 14px", color: "#fca5a5", fontSize: 13, marginBottom: 20 }}>{err}</div>}
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: "rgba(255,255,255,.7)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Username</label>
            <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="admin" autoFocus
              style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.15)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ color: "rgba(255,255,255,.7)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.15)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(90deg,#005bea,#00c6fb)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .7 : 1, letterSpacing: .5 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 24, color: "rgba(255,255,255,.35)", fontSize: 12 }}>
          Hint: admin / admin123 &nbsp;·&nbsp; s2r2 / s2r2@2025
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PAGE: DASHBOARD
// ═══════════════════════════════════════════════════════════
const StatCard = ({ icon, label, value, sub, subColor, onClick, color }) => (
  <button onClick={onClick} style={{ background: "#fff", border: "none", borderRadius: 16, padding: 22, textAlign: "left", cursor: onClick ? "pointer" : "default", boxShadow: "0 2px 12px rgba(0,0,0,.07)", transition: "transform .18s, box-shadow .18s", width: "100%", borderTop: `3px solid ${color}` }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)"; } }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.07)"; }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, color }}>
      <Icon name={icon} size={22} />
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: subColor || "#64748b", marginTop: 6, fontWeight: 600 }}>{sub}</div>}
  </button>
);

const DashboardPage = ({ setPage }) => {
  const raw = store.get("s2r2_raw", SAMPLE_RAW);
  const finished = store.get("s2r2_finished", SAMPLE_FINISHED);
  const clients = store.get("s2r2_clients", SAMPLE_CLIENTS);
  const lowStock = raw.filter(r => Number(r.quantity) <= Number(r.min_stock));
  const readyStock = finished.filter(f => f.quality_status === "passed").length;
  const now = new Date();
  const newClients = clients.filter(c => { const d = new Date(c.created_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;

  const activity = [
    ...raw.slice(0, 2).map(r => ({ icon: "truck", label: r.name, sub: `Updated: ${r.last_updated || "recently"}`, color: "#f59e0b" })),
    ...finished.slice(0, 2).map(f => ({ icon: "cube", label: f.name, sub: `Quality: ${f.quality_status}`, color: "#10b981" })),
    ...clients.slice(0, 2).map(c => ({ icon: "users", label: c.client_name, sub: c.area, color: "#3b82f6" })),
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0 }}>Dashboard Overview</h2>
        <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 14 }}>Live stats from local inventory data</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, marginBottom: 28 }}>
        <StatCard icon="truck" label="Raw Materials" value={raw.length} sub={`⚠ ${lowStock.length} Low Stock`} subColor="#f59e0b" onClick={() => setPage("raw-materials")} color="#f59e0b" />
        <StatCard icon="cube" label="Finished Products" value={finished.length} sub={`✓ ${readyStock} Ready`} subColor="#10b981" onClick={() => setPage("finished-products")} color="#10b981" />
        <StatCard icon="users" label="Clients" value={clients.length} sub={`+${newClients} This Month`} subColor="#3b82f6" onClick={() => setPage("client-base")} color="#3b82f6" />
        <StatCard icon="warning" label="Low Stock Alerts" value={lowStock.length} color="#ef4444" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {/* Low stock alerts */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 16px" }}>⚠ Low Stock Alerts</h3>
          {lowStock.length === 0 && <p style={{ color: "#64748b", fontSize: 13 }}>All materials are well-stocked!</p>}
          {lowStock.map(r => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{r.supplier}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: "#ef4444", fontSize: 14 }}>{r.quantity} {r.unit}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Min: {r.min_stock}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 16px" }}>Recent Activity</h3>
          {activity.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color + "18", display: "flex", alignItems: "center", justifyContent: "center", color: a.color, flexShrink: 0 }}>
                <Icon name={a.icon} size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{a.label}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{a.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 16px" }}>Quick Actions</h3>
          {NAV_ITEMS.filter(n => n.key !== "dashboard").map(n => (
            <button key={n.key} onClick={() => setPage(n.key)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", marginBottom: 8, textAlign: "left" }}>
              <Icon name={n.icon} size={18} style={{ color: BRAND.primary }} />
              <span style={{ fontWeight: 600, fontSize: 14, color: "#334155" }}>Go to {n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PAGE: RAW MATERIALS
// ═══════════════════════════════════════════════════════════
const defaultRaw = { name: "", category: "Electronics", description: "", quantity: 0, unit: "pcs", min_stock: 0, supplier: "", location: "", unit_price: 0, status: "active" };

const RawMaterialsPage = ({ toast }) => {
  const [items, setItems] = useState(() => store.get("s2r2_raw", SAMPLE_RAW));
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modal, setModal] = useState(null); // null | {mode: "add"|"edit", data}
  const [form, setForm] = useState(defaultRaw);

  useEffect(() => { store.set("s2r2_raw", items); }, [items]);

  const categories = [...new Set(items.map(i => i.category))];
  const filtered = items.filter(i =>
    (!search || i.name.toLowerCase().includes(search.toLowerCase()) || (i.supplier || "").toLowerCase().includes(search.toLowerCase())) &&
    (!catFilter || i.category === catFilter) &&
    (!statusFilter || i.status === statusFilter)
  );

  const openAdd = () => { setForm({ ...defaultRaw, id: Date.now() }); setModal({ mode: "add" }); };
  const openEdit = (item) => { setForm({ ...item }); setModal({ mode: "edit" }); };
  const save = () => {
    if (!form.name) { toast("Name is required", "error"); return; }
    if (modal.mode === "add") setItems(p => [...p, { ...form, last_updated: new Date().toISOString().slice(0, 10) }]);
    else setItems(p => p.map(i => i.id === form.id ? { ...form, last_updated: new Date().toISOString().slice(0, 10) } : i));
    toast(modal.mode === "add" ? "Material added!" : "Material updated!", "success");
    setModal(null);
  };
  const remove = (id) => { setItems(p => p.filter(i => i.id !== id)); toast("Material deleted", "info"); };

  const statusBadge = (s) => ({ active: ["Active", "green"], low_stock: ["Low Stock", "amber"], out_of_stock: ["Out of Stock", "red"] }[s] || [s, "gray"]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0 }}>Raw Materials</h2>
          <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 14 }}>{filtered.length} of {items.length} materials</p>
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: `linear-gradient(90deg,${BRAND.primary},${BRAND.accent})`, border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          <Icon name="plus" size={16} /> Add Material
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Icon name="search" size={16} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search materials..." style={{ width: "100%", padding: "8px 12px 8px 34px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <Select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ flex: "0 1 160px" }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </Select>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ flex: "0 1 160px" }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </Select>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {filtered.map(item => {
          const [bl, bc] = statusBadge(item.status);
          const isLow = Number(item.quantity) <= Number(item.min_stock);
          return (
            <div key={item.id} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,.07)", borderLeft: `4px solid ${isLow ? "#f59e0b" : "#10b981"}`, transition: "box-shadow .2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.07)"}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{item.category}</div>
                </div>
                <Badge label={bl} color={bc} />
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14, lineHeight: 1.5 }}>{item.description}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontSize: 13 }}>
                {[["Quantity", `${item.quantity} ${item.unit}`], ["Min Stock", item.min_stock], ["Supplier", item.supplier], ["Location", item.location], ["Unit Price", `₹${Number(item.unit_price).toLocaleString("en-IN")}`], ["Last Updated", item.last_updated]].map(([k, v]) => (
                  <div key={k}><span style={{ color: "#94a3b8", fontSize: 11 }}>{k}</span><br /><span style={{ fontWeight: 600, color: "#334155" }}>{v}</span></div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => openEdit(item)} style={{ flex: 1, padding: "8px", background: "#eff6ff", border: "none", borderRadius: 8, color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Edit</button>
                <button onClick={() => remove(item.id)} style={{ padding: "8px 14px", background: "#fef2f2", border: "none", borderRadius: 8, color: "#dc2626", cursor: "pointer", fontSize: 13 }}>
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: "#94a3b8" }}>No materials found.</div>}
      </div>

      {/* Modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Add Raw Material" : "Edit Raw Material"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Name"><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Material name" /></Field>
          <Field label="Category"><Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}><option>Electronics</option><option>Sensors</option><option>Mechanical</option><option>Consumables</option></Select></Field>
          <div style={{ gridColumn: "1/-1" }}><Field label="Description"><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" /></Field></div>
          <Field label="Quantity"><Input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} /></Field>
          <Field label="Unit"><Select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}><option>pcs</option><option>m</option><option>kg</option><option>L</option><option>set</option></Select></Field>
          <Field label="Min Stock"><Input type="number" value={form.min_stock} onChange={e => setForm(f => ({ ...f, min_stock: e.target.value }))} /></Field>
          <Field label="Unit Price (₹)"><Input type="number" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} /></Field>
          <Field label="Supplier"><Input value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} /></Field>
          <Field label="Location"><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></Field>
          <Field label="Status"><Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="low_stock">Low Stock</option><option value="out_of_stock">Out of Stock</option></Select></Field>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={() => setModal(null)} style={{ padding: "10px 22px", background: "#f1f5f9", border: "none", borderRadius: 9, cursor: "pointer", fontWeight: 600, color: "#64748b" }}>Cancel</button>
          <button onClick={save} style={{ padding: "10px 22px", background: `linear-gradient(90deg,${BRAND.primary},${BRAND.accent})`, border: "none", borderRadius: 9, cursor: "pointer", fontWeight: 700, color: "#fff" }}>Save</button>
        </div>
      </Modal>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PAGE: FINISHED PRODUCTS
// ═══════════════════════════════════════════════════════════
const defaultFP = { name: "", type: "Sensor", serial_number: "", batch_number: "", stock: 0, location: "", unit_price: 0, quality_status: "testing", mfg_date: "", specs: "" };

const FinishedProductsPage = ({ toast }) => {
  const [items, setItems] = useState(() => store.get("s2r2_finished", SAMPLE_FINISHED));
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [qualFilter, setQualFilter] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(defaultFP);

  useEffect(() => { store.set("s2r2_finished", items); }, [items]);

  const filtered = items.filter(i =>
    (!search || i.name.toLowerCase().includes(search.toLowerCase()) || (i.serial_number || "").toLowerCase().includes(search.toLowerCase())) &&
    (!typeFilter || i.type === typeFilter) &&
    (!qualFilter || i.quality_status === qualFilter)
  );

  const openAdd = () => { setForm({ ...defaultFP, id: Date.now() }); setModal({ mode: "add" }); };
  const openEdit = (item) => { setForm({ ...item }); setModal({ mode: "edit" }); };
  const save = () => {
    if (!form.name) { toast("Name is required", "error"); return; }
    if (modal.mode === "add") setItems(p => [...p, form]);
    else setItems(p => p.map(i => i.id === form.id ? form : i));
    toast(modal.mode === "add" ? "Product added!" : "Product updated!", "success");
    setModal(null);
  };
  const remove = (id) => { setItems(p => p.filter(i => i.id !== id)); toast("Product deleted", "info"); };

  const qualBadge = (q) => ({ passed: ["Passed", "green"], testing: ["Testing", "blue"], failed: ["Failed", "red"] }[q] || [q, "gray"]);
  const typeIcon = (t) => ({ Sensor: "🔬", Actuator: "⚡", Controller: "🖥️" }[t] || "📦");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0 }}>Finished Products</h2>
          <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 14 }}>{filtered.length} of {items.length} products</p>
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: `linear-gradient(90deg,${BRAND.primary},${BRAND.accent})`, border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          <Icon name="plus" size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Icon name="search" size={16} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width: "100%", padding: "8px 12px 8px 34px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ flex: "0 1 160px" }}>
          <option value="">All Types</option>
          <option>Sensor</option><option>Actuator</option><option>Controller</option>
        </Select>
        <Select value={qualFilter} onChange={e => setQualFilter(e.target.value)} style={{ flex: "0 1 160px" }}>
          <option value="">All Quality</option>
          <option value="passed">Passed</option><option value="testing">Testing</option><option value="failed">Failed</option>
        </Select>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {filtered.map(item => {
          const [ql, qc] = qualBadge(item.quality_status);
          return (
            <div key={item.id} style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.07)", transition: "box-shadow .2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.07)"}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                  {typeIcon(item.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{item.type} · {item.serial_number}</div>
                </div>
                <Badge label={ql} color={qc} />
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14, lineHeight: 1.6, background: "#f8fafc", borderRadius: 8, padding: 10 }}>{item.specs}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontSize: 13 }}>
                {[["Batch", item.batch_number], ["Stock", item.stock + " units"], ["Location", item.location], ["Price", `₹${Number(item.unit_price).toLocaleString("en-IN")}`], ["Mfg Date", item.mfg_date]].map(([k, v]) => (
                  <div key={k}><span style={{ color: "#94a3b8", fontSize: 11 }}>{k}</span><br /><span style={{ fontWeight: 600, color: "#334155" }}>{v}</span></div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => openEdit(item)} style={{ flex: 1, padding: "8px", background: "#eff6ff", border: "none", borderRadius: 8, color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Edit</button>
                <button onClick={() => remove(item.id)} style={{ padding: "8px 14px", background: "#fef2f2", border: "none", borderRadius: 8, color: "#dc2626", cursor: "pointer" }}><Icon name="trash" size={15} /></button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: "#94a3b8" }}>No products found.</div>}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Add Finished Product" : "Edit Product"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div style={{ gridColumn: "1/-1" }}><Field label="Product Name"><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field></div>
          <Field label="Type"><Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}><option>Sensor</option><option>Actuator</option><option>Controller</option></Select></Field>
          <Field label="Quality Status"><Select value={form.quality_status} onChange={e => setForm(f => ({ ...f, quality_status: e.target.value }))}><option value="passed">Passed</option><option value="testing">Testing</option><option value="failed">Failed</option></Select></Field>
          <Field label="Serial Number"><Input value={form.serial_number} onChange={e => setForm(f => ({ ...f, serial_number: e.target.value }))} /></Field>
          <Field label="Batch Number"><Input value={form.batch_number} onChange={e => setForm(f => ({ ...f, batch_number: e.target.value }))} /></Field>
          <Field label="Stock"><Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} /></Field>
          <Field label="Unit Price (₹)"><Input type="number" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} /></Field>
          <Field label="Location"><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></Field>
          <Field label="Mfg Date"><Input type="date" value={form.mfg_date} onChange={e => setForm(f => ({ ...f, mfg_date: e.target.value }))} /></Field>
          <div style={{ gridColumn: "1/-1" }}><Field label="Specifications"><textarea value={form.specs} onChange={e => setForm(f => ({ ...f, specs: e.target.value }))} rows={3} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, color: "#1e293b", background: "#f8fafc", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} /></Field></div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={() => setModal(null)} style={{ padding: "10px 22px", background: "#f1f5f9", border: "none", borderRadius: 9, cursor: "pointer", fontWeight: 600, color: "#64748b" }}>Cancel</button>
          <button onClick={save} style={{ padding: "10px 22px", background: `linear-gradient(90deg,${BRAND.primary},${BRAND.accent})`, border: "none", borderRadius: 9, cursor: "pointer", fontWeight: 700, color: "#fff" }}>Save</button>
        </div>
      </Modal>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PAGE: CLIENT BASE
// ═══════════════════════════════════════════════════════════
const defaultClient = { client_name: "", area: "", contact_person: "", email: "", phone: "", status: "active" };

const ClientBasePage = ({ toast }) => {
  const [clients, setClients] = useState(() => store.get("s2r2_clients", SAMPLE_CLIENTS));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(defaultClient);
  const [view, setView] = useState("table"); // "table" | "cards"
  const fileRef = useRef();

  useEffect(() => { store.set("s2r2_clients", clients); }, [clients]);

  const filtered = clients.filter(c =>
    (!search || c.client_name.toLowerCase().includes(search.toLowerCase()) || (c.area || "").toLowerCase().includes(search.toLowerCase()) || (c.contact_person || "").toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || c.status === statusFilter)
  );

  const openAdd = () => { setForm({ ...defaultClient, id: Date.now(), created_at: new Date().toISOString().slice(0, 10) }); setModal({ mode: "add" }); };
  const openEdit = (c) => { setForm({ ...c }); setModal({ mode: "edit" }); };
  const save = () => {
    if (!form.client_name) { toast("Client name required", "error"); return; }
    if (modal.mode === "add") setClients(p => [...p, form]);
    else setClients(p => p.map(c => c.id === form.id ? form : c));
    toast(modal.mode === "add" ? "Client added!" : "Client updated!", "success");
    setModal(null);
  };
  const remove = (id) => { setClients(p => p.filter(c => c.id !== id)); toast("Client removed", "info"); };

  const exportCSV = () => {
    const header = "No.,Name,Area,Contact,Email,Phone,Status,Since\n";
    const rows = filtered.map((c, i) => `${i + 1},"${c.client_name}","${c.area}","${c.contact_person}","${c.email}","${c.phone}","${c.status}","${c.created_at}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "s2r2-clients.csv"; a.click();
    toast("CSV exported!", "success");
  };

  const handleImport = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").slice(1).filter(Boolean);
      const imported = lines.map((line, i) => {
        const [, name, area, contact, email, phone, status] = line.split(",").map(s => s.replace(/"/g, "").trim());
        return { id: Date.now() + i, client_name: name, area, contact_person: contact, email, phone, status: status || "active", created_at: new Date().toISOString().slice(0, 10) };
      }).filter(c => c.client_name);
      setClients(p => [...p, ...imported]);
      toast(`${imported.length} clients imported!`, "success");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const thStyle = { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, borderBottom: "2px solid #f1f5f9", whiteSpace: "nowrap" };
  const tdStyle = { padding: "14px 16px", fontSize: 14, color: "#334155", borderBottom: "1px solid #f8fafc" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0 }}>Client Base</h2>
          <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 14 }}>{filtered.length} clients · {clients.filter(c => c.status === "active").length} active</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: `linear-gradient(90deg,${BRAND.primary},${BRAND.accent})`, border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}><Icon name="plus" size={15} />Add Client</button>
          <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#10b981", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}><Icon name="download" size={15} />Export CSV</button>
          <button onClick={() => fileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#3b82f6", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}><Icon name="upload" size={15} />Import CSV</button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleImport} />
          <button onClick={() => setView(v => v === "table" ? "cards" : "table")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#f1f5f9", border: "none", borderRadius: 10, color: "#475569", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>{view === "table" ? "Card View" : "Table View"}</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Icon name="search" size={16} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, area, contact..." style={{ width: "100%", padding: "8px 12px 8px 34px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ flex: "0 1 160px" }}>
          <option value="">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </Select>
      </div>

      {/* Table view */}
      {view === "table" && (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,.07)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["No.", "Client Name", "Area", "Contact Person", "Email", "Phone", "Status", "Since", "Actions"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafbff" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f7ff"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafbff"}>
                  <td style={{ ...tdStyle, color: "#94a3b8", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{c.client_name}</td>
                  <td style={tdStyle}>{c.area}</td>
                  <td style={tdStyle}>{c.contact_person}</td>
                  <td style={{ ...tdStyle, color: "#3b82f6" }}>{c.email}</td>
                  <td style={tdStyle}>{c.phone}</td>
                  <td style={tdStyle}><Badge label={c.status === "active" ? "Active" : "Inactive"} color={c.status === "active" ? "green" : "gray"} /></td>
                  <td style={{ ...tdStyle, color: "#94a3b8", fontSize: 12 }}>{c.created_at}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(c)} style={{ padding: "5px 12px", background: "#eff6ff", border: "none", borderRadius: 7, color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>Edit</button>
                      <button onClick={() => remove(c.id)} style={{ padding: "5px 10px", background: "#fef2f2", border: "none", borderRadius: 7, color: "#dc2626", cursor: "pointer" }}><Icon name="trash" size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>No clients found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Card view */}
      {view === "cards" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map((c, i) => (
            <div key={c.id} style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.07)", borderTop: `3px solid ${c.status === "active" ? "#10b981" : "#94a3b8"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${BRAND.primary},${BRAND.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 17, flexShrink: 0 }}>
                  {c.client_name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{c.client_name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{c.area}</div>
                </div>
                <div style={{ marginLeft: "auto" }}><Badge label={c.status === "active" ? "Active" : "Inactive"} color={c.status === "active" ? "green" : "gray"} /></div>
              </div>
              {[["👤", c.contact_person], ["📧", c.email], ["📞", c.phone], ["📅", c.created_at]].map(([icon, val]) => (
                <div key={icon} style={{ fontSize: 13, color: "#64748b", marginBottom: 5 }}>{icon} {val}</div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => openEdit(c)} style={{ flex: 1, padding: "8px", background: "#eff6ff", border: "none", borderRadius: 8, color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Edit</button>
                <button onClick={() => remove(c.id)} style={{ padding: "8px 14px", background: "#fef2f2", border: "none", borderRadius: 8, color: "#dc2626", cursor: "pointer" }}><Icon name="trash" size={15} /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: "#94a3b8" }}>No clients found.</div>}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Add Client" : "Edit Client"}>
        <Field label="Client Name"><Input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} placeholder="Company or client name" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Area"><Input value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="City/Region" /></Field>
          <Field label="Status"><Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field>
          <Field label="Contact Person"><Input value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></Field>
          <div style={{ gridColumn: "1/-1" }}><Field label="Email"><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field></div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={() => setModal(null)} style={{ padding: "10px 22px", background: "#f1f5f9", border: "none", borderRadius: 9, cursor: "pointer", fontWeight: 600, color: "#64748b" }}>Cancel</button>
          <button onClick={save} style={{ padding: "10px 22px", background: `linear-gradient(90deg,${BRAND.primary},${BRAND.accent})`, border: "none", borderRadius: 9, cursor: "pointer", fontWeight: 700, color: "#fff" }}>Save</button>
        </div>
      </Modal>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [auth, setAuth] = useState(() => store.get("s2r2_auth", null));
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const { toasts, show: toast } = useToast();

  const login = (user) => { store.set("s2r2_auth", user); setAuth(user); toast(`Welcome, ${user}!`, "success"); };
  const logout = () => { store.set("s2r2_auth", null); setAuth(null); setPage("dashboard"); toast("Logged out", "info"); };

  const PAGE_TITLES = { dashboard: "Dashboard Overview", "raw-materials": "Raw Materials", "finished-products": "Finished Products", "client-base": "Client Base" };

  const bg = dark ? "#0f172a" : "#f0f4f8";
  const contentBg = dark ? "#0f172a" : "#f0f4f8";

  if (!auth) return (
    <>
      <style>{`@keyframes slideIn{from{transform:translateX(120px);opacity:0}to{transform:translateX(0);opacity:1}} *{box-sizing:border-box}`}</style>
      <ToastContainer toasts={toasts} />
      <LoginPage onLogin={login} />
    </>
  );

  return (
    <>
      <style>{`
        @keyframes slideIn{from{transform:translateX(120px);opacity:0}to{transform:translateX(0);opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Segoe UI',system-ui,sans-serif}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:8px}
      `}</style>
      <ToastContainer toasts={toasts} />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: bg, filter: dark ? "invert(0)" : "none" }}>
        <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} user={auth} dark={dark} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <TopBar title={PAGE_TITLES[page]} collapsed={collapsed} setCollapsed={setCollapsed} dark={dark} setDark={setDark} />
          <main style={{ flex: 1, overflowY: "auto", padding: 24, background: contentBg }}>
            {page === "dashboard" && <DashboardPage setPage={setPage} />}
            {page === "raw-materials" && <RawMaterialsPage toast={toast} />}
            {page === "finished-products" && <FinishedProductsPage toast={toast} />}
            {page === "client-base" && <ClientBasePage toast={toast} />}
          </main>
          <footer style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "10px 24px", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
            © 2025 S2R2 IoT Solutions · Designed & Developed by Dorge Patil Group Teams
          </footer>
        </div>
      </div>
    </>
  );
}

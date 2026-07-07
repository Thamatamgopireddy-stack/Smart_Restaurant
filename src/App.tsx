import { useState, useEffect } from "react";

/* ════════════════════════════════════════
   BRIGHT "FOOD-TECH" THEME
   Inspired by the energy of Swiggy/Zomato but
   built on a warm cream base with a coral →
   amber gradient identity instead of their
   flat orange/red, plus its own cyan accent
   for the delivery fleet.
════════════════════════════════════════ */
const C = {
  bg: "#FFF8F0", // warm cream page background
  card: "#FFFFFF", // white cards
  border: "#FFE3C2", // soft peach hairline
  accent: "#FF5A3C", // vivid coral-orange (primary brand)
  accent2: "#FFB100", // golden amber (gradient partner)
  pink: "#FF2D78", // hot pink (used sparingly for emphasis)
  green: "#00C48C", // fresh mint green (success / free / ready)
  red: "#FF3B5C", // vivid red (alerts / occupied)
  yellow: "#FFC93C", // warm yellow (pending)
  blue: "#3D8BFF", // bright blue (preparing / waiter brand)
  purple: "#8B5CF6", // violet (reserved tables / online order type)
  cyan: "#00C2CB", // teal-cyan (delivery fleet brand)
  text: "#241C1C", // near-black warm ink
  muted: "#948A83", // warm grey for secondary text
  dark: "#2B1B3D", // deep plum for sidebars / high-contrast nav
};

const GRAD = `linear-gradient(90deg, ${C.accent}, ${C.accent2})`;

const sColor: Record<string, string> = {
  pending: C.yellow,
  preparing: C.blue,
  ready: C.green,
  served: C.muted,
};
// darker, accessible text tones for pastel status chips
const sText: Record<string, string> = {
  pending: "#B45309",
  preparing: "#1D4ED8",
  ready: "#047857",
  served: "#6B6560",
};
const sBg: Record<string, string> = {
  pending: "#FFF3D6",
  preparing: "#E4EFFF",
  ready: "#DEFBF0",
  served: "#F1EEEC",
};

// how long (roughly) each stage takes, used only to render a friendly ETA
const STAGE_ETA_MIN: Record<string, [number, number]> = {
  pending: [25, 35],
  preparing: [18, 25],
  ready: [10, 15],
  served: [0, 0],
};

/* ── SHARED DATA ── */
const MENU_CATS = [
  "All",
  "Starters",
  "Main Course",
  "Rice",
  "Bread",
  "Beverages",
  "Desserts",
];

const MENU = [
  {
    id: 1,
    name: "Paneer Tikka",
    cat: "Starters",
    price: 220,
    emoji: "🥘",
    popular: true,
    veg: true,
  },
  {
    id: 2,
    name: "Chicken 65",
    cat: "Starters",
    price: 240,
    emoji: "🍗",
    popular: true,
    veg: false,
  },
  {
    id: 3,
    name: "Butter Chicken",
    cat: "Main Course",
    price: 280,
    emoji: "🍛",
    popular: true,
    veg: false,
  },
  {
    id: 4,
    name: "Shahi Paneer",
    cat: "Main Course",
    price: 260,
    emoji: "🧆",
    popular: false,
    veg: true,
  },
  {
    id: 5,
    name: "Dal Makhani",
    cat: "Main Course",
    price: 180,
    emoji: "🫕",
    popular: false,
    veg: true,
  },
  {
    id: 6,
    name: "Chicken Biryani",
    cat: "Rice",
    price: 320,
    emoji: "🍚",
    popular: true,
    veg: false,
  },
  {
    id: 7,
    name: "Veg Fried Rice",
    cat: "Rice",
    price: 180,
    emoji: "🍳",
    popular: false,
    veg: true,
  },
  {
    id: 8,
    name: "Butter Naan",
    cat: "Bread",
    price: 45,
    emoji: "🫓",
    popular: false,
    veg: true,
  },
  {
    id: 9,
    name: "Tandoori Roti",
    cat: "Bread",
    price: 30,
    emoji: "🫓",
    popular: false,
    veg: true,
  },
  {
    id: 10,
    name: "Mango Lassi",
    cat: "Beverages",
    price: 90,
    emoji: "🥛",
    popular: true,
    veg: true,
  },
  {
    id: 11,
    name: "Filter Coffee",
    cat: "Beverages",
    price: 60,
    emoji: "☕",
    popular: false,
    veg: true,
  },
  {
    id: 12,
    name: "Gulab Jamun",
    cat: "Desserts",
    price: 80,
    emoji: "🍮",
    popular: false,
    veg: true,
  },
];

const TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: `T-${i + 1}`,
  seats: [2, 4, 4, 6, 4, 2, 6, 4, 8, 4, 2, 6][i],
}));

type Reservation = {
  name: string;
  phone: string;
  partySize: number;
  time: string;
};

type DeliveryInfo = {
  pincode: string;
  address: string;
  coords: { lat: number; lng: number } | null;
};

/* ── HELPERS ── */
const Badge = ({ status }: { status: string }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: sBg[status],
      color: sText[status],
      border: `1px solid ${sColor[status]}55`,
    }}
  >
    {status}
  </span>
);

const Btn = ({
  children,
  color = C.accent,
  gradient,
  outline,
  full,
  sm,
  onClick,
  disabled,
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled
        ? "#E7E2DC"
        : outline
        ? "transparent"
        : gradient
        ? GRAD
        : color,
      border: `1.5px solid ${disabled ? "#E7E2DC" : color}`,
      color: disabled ? "#B4ACA3" : outline ? color : "#fff",
      padding: sm ? "5px 12px" : "10px 18px",
      borderRadius: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: sm ? 11.5 : 13.5,
      fontWeight: 800,
      width: full ? "100%" : undefined,
      transition: "all .15s",
      boxShadow: !disabled && !outline ? `0 4px 14px ${color}33` : "none",
      letterSpacing: 0.2,
    }}
  >
    {children}
  </button>
);

const Card = ({ children, style = {} }: any) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: 16,
      boxShadow: "0 2px 12px rgba(43,27,61,0.05)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Bar = ({ pct, color }: { pct: number; color: string }) => (
  <div
    style={{
      height: 7,
      background: "#F2ECE4",
      borderRadius: 4,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${pct}%`,
        background: color,
        borderRadius: 4,
        transition: "width .5s",
      }}
    />
  </div>
);

const inputStyle = {
  width: "100%",
  background: "#FFFCF8",
  border: `1.5px solid ${C.border}`,
  borderRadius: 10,
  padding: "9px 12px",
  color: C.text,
  fontSize: 13,
  boxSizing: "border-box" as const,
};

/* ════════════════════════════════════════
   LIVE ORDER TRACKER
   A Swiggy/Zomato-style horizontal stepper.
   Works for dine-in, takeaway & online, but
   online orders get delivery-specific copy
   (Out for Delivery / Delivered) + an ETA.
════════════════════════════════════════ */
const TRACK_KEYFRAMES = `
@keyframes fc-pulse-ring {
  0%   { box-shadow: 0 0 0 0 rgba(255,90,60,0.45); }
  70%  { box-shadow: 0 0 0 10px rgba(255,90,60,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,90,60,0); }
}
@keyframes fc-dot-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
@keyframes fc-scooter-move {
  0%   { transform: translateX(-2px); }
  50%  { transform: translateX(2px); }
  100% { transform: translateX(-2px); }
}
`;

const STAGE_ORDER = ["pending", "preparing", "ready", "served"];

function trackerSteps(type: string) {
  if (type === "online") {
    return [
      { key: "pending", label: "Order Placed", icon: "📝" },
      { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
      { key: "ready", label: "Out for Delivery", icon: "🛵" },
      { key: "served", label: "Delivered", icon: "🏠" },
    ];
  }
  if (type === "takeaway") {
    return [
      { key: "pending", label: "Order Placed", icon: "📝" },
      { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
      { key: "ready", label: "Ready for Pickup", icon: "🔔" },
      { key: "served", label: "Picked Up", icon: "🥡" },
    ];
  }
  return [
    { key: "pending", label: "Order Placed", icon: "📝" },
    { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
    { key: "ready", label: "Ready", icon: "🔔" },
    { key: "served", label: "Served", icon: "🍽️" },
  ];
}

function OrderTracker({ status, type }: { status: string; type: string }) {
  const steps = trackerSteps(type);
  const currentIdx = STAGE_ORDER.indexOf(status);
  const isDone = status === "served";
  const [lo, hi] = STAGE_ETA_MIN[status] || [0, 0];

  return (
    <div>
      <style>{TRACK_KEYFRAMES}</style>

      {/* live status strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          padding: "6px 2px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {!isDone && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.green,
                display: "inline-block",
                animation: "fc-dot-blink 1.2s infinite",
              }}
            />
          )}
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 800,
              color: isDone ? C.muted : C.green,
            }}
          >
            {isDone ? "COMPLETED" : "LIVE"}
          </span>
        </div>
        {!isDone && (type === "online" || type === "takeaway") && (
          <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>
            ⏱️ Est. {lo}-{hi} min
          </span>
        )}
      </div>

      {/* stepper */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {steps.map((s, i) => {
          const done = i < currentIdx || (isDone && i <= currentIdx);
          const active = i === currentIdx && !isDone;
          const finalActive = i === currentIdx && isDone;
          return (
            <div
              key={s.key}
              style={{
                display: "flex",
                alignItems: "flex-start",
                flex: i < steps.length - 1 ? 1 : "0 0 auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 56,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      done || finalActive ? C.green : active ? GRAD : "#F2ECE4",
                    color: done || active || finalActive ? "#fff" : C.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                    animation: active ? "fc-pulse-ring 1.6s infinite" : "none",
                  }}
                >
                  {done || finalActive ? (
                    "✓"
                  ) : (
                    <span
                      style={{
                        display: "inline-block",
                        animation:
                          active && s.key === "ready" && type === "online"
                            ? "fc-scooter-move 0.8s ease-in-out infinite"
                            : "none",
                      }}
                    >
                      {s.icon}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 9.5,
                    marginTop: 5,
                    textAlign: "center",
                    lineHeight: 1.25,
                    fontWeight: active ? 800 : 600,
                    color: active
                      ? C.accent
                      : done || finalActive
                      ? C.green
                      : C.muted,
                  }}
                >
                  {s.label}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    marginTop: 15,
                    borderRadius: 2,
                    background: i < currentIdx ? C.green : "#F2ECE4",
                    transition: "background .4s",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   LOGIN SCREEN (Strict Segregation)
════════════════════════════════════════ */
function LoginScreen({
  onLogin,
}: {
  onLogin: (role: string, extra: any) => void;
}) {
  const [portal, setPortal] = useState("customer"); // customer | staff
  const [staffRole, setStaffRole] = useState<string | null>(null); // waiter | kitchen | owner | delivery
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const [orderType, setOrderType] = useState<string | null>(null);
  const [table, setTable] = useState("T-1");
  const [name, setName] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Online delivery details
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locStatus, setLocStatus] = useState<
    "idle" | "loading" | "granted" | "denied" | "unsupported"
  >("idle");

  const STAFF_CREDS: Record<string, string> = {
    waiter: "1111",
    kitchen: "2222",
    owner: "9999",
    delivery: "3333",
  };

  const staffRoles = [
    {
      id: "waiter",
      icon: "🙋",
      label: "Waiter",
      desc: "Floor & Table Control",
      color: C.blue,
    },
    {
      id: "kitchen",
      icon: "👨‍🍳",
      label: "Kitchen Staff",
      desc: "Production Queue",
      color: C.yellow,
    },
    {
      id: "delivery",
      icon: "🛵",
      label: "Delivery Agent",
      desc: "Live Order Dispatch",
      color: C.cyan,
    },
    {
      id: "owner",
      icon: "👑",
      label: "Owner / Manager",
      desc: "Business Analytics",
      color: C.accent,
    },
  ];

  const orderTypes = [
    {
      id: "dine-in",
      icon: "🍽️",
      label: "Dine-In",
      desc: "Table Seating",
      color: C.green,
    },
    {
      id: "takeaway",
      icon: "🥡",
      label: "Take Away",
      desc: "Pick up counter",
      color: C.blue,
    },
    {
      id: "online",
      icon: "📱",
      label: "Online Order",
      desc: "Home Delivery",
      color: C.purple,
    },
  ];

  const handleStaffLogin = () => {
    if (staffRole && STAFF_CREDS[staffRole] === passcode) {
      setError("");
      onLogin(staffRole, {
        name: staffRoles.find((r) => r.id === staffRole)?.label,
      });
      setPasscode("");
    } else {
      setError("Invalid security passcode!");
    }
  };

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocStatus("unsupported");
      return;
    }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("granted");
      },
      () => setLocStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const pincodeValid = /^[0-9]{6}$/.test(pincode);
  const canContinue =
    !!orderType &&
    name.trim().length > 0 &&
    (orderType !== "online" || pincodeValid);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 15% 0%, #FFE9D6 0%, ${C.bg} 45%), radial-gradient(circle at 100% 100%, #FFE1EC 0%, transparent 40%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'Segoe UI',sans-serif",
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 22,
            margin: "0 auto 10px",
            background: GRAD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            boxShadow: `0 10px 26px ${C.accent}55`,
          }}
        >
          🍴
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: C.text,
            letterSpacing: -0.5,
          }}
        >
          Food
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Core
          </span>
        </div>
        <div
          style={{
            color: C.muted,
            fontSize: 13,
            marginTop: 2,
            fontWeight: 600,
          }}
        >
          Fast. Fresh. Fully in your control.
        </div>
      </div>

      {/* Portal Isolation Switcher */}
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: 460,
          background: C.dark,
          padding: 5,
          borderRadius: 14,
          marginBottom: 20,
          boxShadow: "0 8px 20px rgba(43,27,61,0.25)",
        }}
      >
        <button
          onClick={() => {
            setPortal("customer");
            setError("");
          }}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 12.5,
            background: portal === "customer" ? GRAD : "transparent",
            color: portal === "customer" ? "#fff" : "#C9BEDB",
            border: "none",
            transition: "all .15s",
          }}
        >
          👤 Guest Order Terminal
        </button>
        <button
          onClick={() => {
            setPortal("staff");
            setError("");
          }}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 12.5,
            background: portal === "staff" ? "#fff" : "transparent",
            color: portal === "staff" ? C.dark : "#C9BEDB",
            border: "none",
            transition: "all .15s",
          }}
        >
          🔑 Authorized Staff Only
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* ── CUSTOMER PORTAL FLOW ── */}
        {portal === "customer" && (
          <>
            {!orderType ? (
              <Card style={{ marginBottom: 16 }}>
                <div
                  style={{
                    color: C.text,
                    fontWeight: 700,
                    fontSize: 13,
                    marginBottom: 14,
                    textAlign: "center",
                  }}
                >
                  Select fulfillment method to begin
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 10,
                  }}
                >
                  {orderTypes.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => setOrderType(o.id)}
                      onMouseEnter={() => setHoveredCard(o.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        background:
                          hoveredCard === o.id ? `${o.color}1c` : "#FFFCF8",
                        border: `2px solid ${
                          hoveredCard === o.id ? o.color : C.border
                        }`,
                        boxShadow:
                          hoveredCard === o.id
                            ? `0 6px 16px ${o.color}33`
                            : "none",
                        borderRadius: 14,
                        padding: "18px 4px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all .2s",
                      }}
                    >
                      <div style={{ fontSize: 26, marginBottom: 6 }}>
                        {o.icon}
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          color: o.color,
                          fontSize: 12,
                        }}
                      >
                        {o.label}
                      </div>
                      <div
                        style={{ fontSize: 10, color: C.muted, marginTop: 2 }}
                      >
                        {o.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <div style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>
                    {orderType === "online"
                      ? "Delivery Details"
                      : "Guest Information"}
                  </div>
                  <span
                    onClick={() => setOrderType(null)}
                    style={{
                      fontSize: 11,
                      color: C.accent,
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    {orderTypes.find((o) => o.id === orderType)?.icon}{" "}
                    {" Change Mode"}
                  </span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      marginBottom: 5,
                      fontWeight: 600,
                    }}
                  >
                    Customer Name
                  </div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={inputStyle}
                  />
                </div>

                {orderType === "dine-in" && (
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: C.muted,
                        marginBottom: 5,
                        fontWeight: 600,
                      }}
                    >
                      Select Allocated Table
                    </div>
                    <select
                      value={table}
                      onChange={(e) => setTable(e.target.value)}
                      style={inputStyle}
                    >
                      {TABLES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.id} ({t.seats} Seats)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {orderType === "online" && (
                  <>
                    {/* Live location */}
                    <div style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.muted,
                          marginBottom: 5,
                          fontWeight: 600,
                        }}
                      >
                        Delivery Location
                      </div>
                      <div
                        onClick={detectLocation}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          background:
                            locStatus === "granted"
                              ? `${C.green}14`
                              : `${C.purple}14`,
                          border: `1.5px dashed ${
                            locStatus === "granted" ? C.green : C.purple
                          }`,
                          borderRadius: 10,
                          padding: "10px 12px",
                          cursor: "pointer",
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: locStatus === "granted" ? "#047857" : C.purple,
                        }}
                      >
                        {locStatus === "loading" &&
                          "📡 Detecting your location..."}
                        {locStatus === "granted" &&
                          coords &&
                          `📍 Location shared (${coords.lat.toFixed(
                            4
                          )}, ${coords.lng.toFixed(4)})`}
                        {locStatus === "idle" && "📍 Share My Live Location"}
                        {locStatus === "denied" &&
                          "⚠️ Location access denied — enter address manually"}
                        {locStatus === "unsupported" &&
                          "⚠️ Location not supported on this device"}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 12,
                            color: C.muted,
                            marginBottom: 5,
                            fontWeight: 600,
                          }}
                        >
                          Pincode *
                        </div>
                        <input
                          value={pincode}
                          onChange={(e) =>
                            setPincode(
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                          }
                          placeholder="e.g. 500081"
                          inputMode="numeric"
                          style={{
                            ...inputStyle,
                            border: `1.5px solid ${
                              pincode && !pincodeValid ? C.red : C.border
                            }`,
                          }}
                        />
                        {pincode.length > 0 && !pincodeValid && (
                          <div
                            style={{
                              fontSize: 10,
                              color: C.red,
                              marginTop: 4,
                              fontWeight: 600,
                            }}
                          >
                            Enter a valid 6-digit pincode
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.muted,
                          marginBottom: 5,
                          fontWeight: 600,
                        }}
                      >
                        Address / Landmark (optional)
                      </div>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Flat / House no., street, landmark"
                        style={inputStyle}
                      />
                    </div>
                  </>
                )}
              </Card>
            )}

            <Btn
              full
              gradient
              color={C.green}
              disabled={!canContinue}
              onClick={() =>
                onLogin("customer", {
                  table:
                    orderType === "dine-in" ? table : orderType!.toUpperCase(),
                  name,
                  orderType,
                  ...(orderType === "online"
                    ? { pincode, address, coords }
                    : {}),
                })
              }
            >
              {orderType
                ? "🟢 Browse Digital Menu & Order"
                : "Select Fulfillment Method Above"}
            </Btn>
          </>
        )}

        {/* ── SECURE STAFF PORTAL FLOW ── */}
        {portal === "staff" && (
          <Card>
            <div
              style={{
                color: C.text,
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Select System Department
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {staffRoles.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    setStaffRole(r.id);
                    setError("");
                  }}
                  style={{
                    background: staffRole === r.id ? `${r.color}16` : "#FFFCF8",
                    border: `2px solid ${
                      staffRole === r.id ? r.color : C.border
                    }`,
                    borderRadius: 14,
                    padding: 14,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all .15s",
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{r.icon}</div>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: staffRole === r.id ? r.color : C.text,
                    }}
                  >
                    {r.label}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
                    {r.desc}
                  </div>
                </div>
              ))}
            </div>

            {staffRole && (
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    marginBottom: 6,
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  Passcode Required for{" "}
                  {staffRoles.find((r) => r.id === staffRole)?.label} Access
                </div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  style={{
                    ...inputStyle,
                    fontSize: 18,
                    textAlign: "center",
                    letterSpacing: 10,
                    marginBottom: 10,
                  }}
                />

                {error && (
                  <div
                    style={{
                      color: C.red,
                      fontSize: 11,
                      marginBottom: 10,
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {error}
                  </div>
                )}

                <Btn
                  full
                  gradient
                  onClick={handleStaffLogin}
                  disabled={passcode.length < 4}
                >
                  🔓 Verify Credentials
                </Btn>
                <div
                  style={{
                    textAlign: "center",
                    color: C.muted,
                    fontSize: 10,
                    marginTop: 12,
                  }}
                >
                  Dev System Pins -&gt; Waiter: 1111 | Kitchen: 2222 | Delivery:
                  3333 | Owner: 9999
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

/* ── CUSTOMER VIEW ── */
function CustomerView({ user, orders, addOrder, onLogout, isMobile }: any) {
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [view, setView] = useState("menu");
  const [placed, setPlaced] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = MENU.filter(
    (m) =>
      (cat === "All" || m.cat === cat) &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );
  const cartItems = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ ...MENU.find((m) => m.id === +id)!, qty }));
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const myOrders = orders.filter(
    (o: any) => o.table === user.table && o.customerName === user.name
  );
  const activeOrdersCount = myOrders.filter(
    (o: any) => o.status !== "served"
  ).length;

  const placeOrder = () => {
    if (!cartItems.length) return;
    addOrder({
      id: `ORD-${String(Date.now()).slice(-4)}`,
      table: user.table,
      customerName: user.name,
      items: cartItems.map((i) => `${i.name}${i.qty > 1 ? ` x${i.qty}` : ""}`),
      itemsDetail: cartItems,
      status: "pending",
      time: "Just now",
      total,
      type: user.orderType || "dine-in",
      delivery:
        user.orderType === "online"
          ? {
              pincode: user.pincode,
              address: user.address,
              coords: user.coords,
            }
          : undefined,
    });
    setCart({});
    setPlaced(true);
    setView("orders");
    setTimeout(() => setPlaced(false), 3000);
  };

  const nav = [
    { id: "menu", icon: "🍽️", label: "Menu" },
    {
      id: "cart",
      icon: "🛒",
      label: `Cart${cartCount > 0 ? ` (${cartCount})` : ""}`,
    },
    {
      id: "orders",
      icon: "📋",
      label: `Track Order${
        activeOrdersCount > 0 ? ` (${activeOrdersCount})` : ""
      }`,
    },
  ];

  return (
    <div
      style={{
        height: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Segoe UI',sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: GRAD,
          padding: "14px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          boxShadow: "0 4px 14px rgba(255,90,60,0.25)",
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 16, color: "#fff" }}>
            🍴 FoodCore
          </div>
          <div style={{ fontSize: 11, color: "#FFEDE3" }}>
            👤 {user.name} · {user.table}
            {user.orderType === "online" && user.pincode
              ? ` · 📍 ${user.pincode}`
              : ""}
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.5)",
            color: "#fff",
            padding: "5px 12px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          ← Exit
        </button>
      </div>

      {placed && (
        <div
          style={{
            background: C.green,
            color: "#fff",
            padding: "10px 16px",
            textAlign: "center",
            fontWeight: 800,
            fontSize: 13,
          }}
        >
          ✅ Order placed! Track it live under "Track Order" below.
        </div>
      )}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding:
            cartCount > 0 && view === "menu"
              ? "14px 14px 140px"
              : "14px 14px 80px",
        }}
      >
        {view === "menu" && (
          <>
            {user.orderType === "online" && (
              <Card
                style={{
                  marginBottom: 12,
                  padding: 10,
                  borderLeft: `4px solid ${C.purple}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.purple,
                    marginBottom: 2,
                  }}
                >
                  🛵 Delivering to
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>
                  PIN {user.pincode || "—"}
                  {user.address ? ` · ${user.address}` : ""}
                  {user.coords ? ` · 📍 GPS shared` : ""}
                </div>
              </Card>
            )}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search dishes..."
              style={{ ...inputStyle, marginBottom: 12, padding: "10px 14px" }}
            />
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 8,
                marginBottom: 14,
              }}
            >
              {MENU_CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  style={{
                    background: cat === c ? GRAD : "#FFFCF8",
                    border: `1.5px solid ${
                      cat === c ? "transparent" : C.border
                    }`,
                    color: cat === c ? "#fff" : C.muted,
                    padding: "6px 14px",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 10,
              }}
            >
              {filtered.map((item) => (
                <Card key={item.id} style={{ padding: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontSize: 22 }}>{item.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted }}>
                            {item.cat}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 800,
                            color: C.green,
                            fontSize: 14,
                          }}
                        >
                          ₹{item.price}
                        </span>
                        {item.popular && (
                          <span
                            style={{
                              fontSize: 10,
                              background: `${C.accent}18`,
                              color: C.accent,
                              padding: "1px 6px",
                              borderRadius: 10,
                              fontWeight: 700,
                            }}
                          >
                            🔥 Popular
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 10,
                            color: item.veg ? C.green : C.red,
                          }}
                        >
                          {item.veg ? "🟢" : "🔴"}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                      }}
                    >
                      {(cart[item.id] || 0) > 0 ? (
                        <>
                          <button
                            onClick={() =>
                              setCart((c) => ({
                                ...c,
                                [item.id]: Math.max(0, (c[item.id] || 0) - 1),
                              }))
                            }
                            style={{
                              background: "#F2ECE4",
                              border: "none",
                              color: C.text,
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              cursor: "pointer",
                              fontWeight: 800,
                              fontSize: 16,
                            }}
                          >
                            −
                          </button>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: 14,
                              minWidth: 16,
                              textAlign: "center",
                            }}
                          >
                            {cart[item.id]}
                          </span>
                          <button
                            onClick={() =>
                              setCart((c) => ({
                                ...c,
                                [item.id]: (c[item.id] || 0) + 1,
                              }))
                            }
                            style={{
                              background: GRAD,
                              border: "none",
                              color: "#fff",
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              cursor: "pointer",
                              fontWeight: 800,
                              fontSize: 16,
                            }}
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            setCart((c) => ({ ...c, [item.id]: 1 }))
                          }
                          style={{
                            background: GRAD,
                            border: "none",
                            color: "#fff",
                            padding: "6px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: 800,
                            fontSize: 12,
                          }}
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {view === "cart" && (
          <>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>
              🛒 Your Cart
            </div>
            {cartItems.length === 0 ? (
              <Card style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🛒</div>
                <div style={{ color: C.muted, fontSize: 14 }}>
                  Your cart is empty
                </div>
              </Card>
            ) : (
              <>
                {cartItems.map((item) => (
                  <Card key={item.id} style={{ padding: 12, marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{item.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: 12, color: C.muted }}>
                            ₹{item.price} × {item.qty}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontWeight: 800, color: C.green }}>
                          ₹{item.price * item.qty}
                        </span>
                        <button
                          onClick={() =>
                            setCart((c) => ({ ...c, [item.id]: 0 }))
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            color: C.red,
                            cursor: "pointer",
                            fontSize: 16,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
                <Card style={{ marginTop: 4 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: C.muted }}>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <span style={{ color: C.muted }}>GST (5%)</span>
                    <span>₹{Math.round(total * 0.05)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 800,
                      fontSize: 16,
                      borderTop: `1px solid ${C.border}`,
                      paddingTop: 10,
                      marginBottom: 14,
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: C.green }}>
                      ₹{total + Math.round(total * 0.05)}
                    </span>
                  </div>
                  <Btn full gradient onClick={placeOrder}>
                    🍽️ Place Order · ₹{total + Math.round(total * 0.05)}
                  </Btn>
                </Card>
              </>
            )}
          </>
        )}

        {view === "orders" && (
          <>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>
              📋 Track Your Order
            </div>
            {myOrders.length === 0 ? (
              <Card style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 34, marginBottom: 10 }}>🍽️</div>
                <div style={{ color: C.muted }}>No orders found yet.</div>
              </Card>
            ) : (
              [...myOrders].reverse().map((o: any) => (
                <Card
                  key={o.id}
                  style={{
                    borderLeft: `4px solid ${sColor[o.status]}`,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontWeight: 800, color: C.accent }}>
                      {o.id}
                    </span>
                    <Badge status={o.status} />
                  </div>
                  <div
                    style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}
                  >
                    {o.time}
                  </div>

                  {/* live visual tracker */}
                  <OrderTracker status={o.status} type={o.type} />

                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      margin: "14px 0 10px",
                    }}
                  >
                    {o.items.map((item: string, i: number) => (
                      <span
                        key={i}
                        style={{
                          background: "#FFF6EC",
                          border: `1px solid ${C.border}`,
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {o.delivery && (
                    <div
                      style={{
                        fontSize: 11,
                        color: C.purple,
                        marginBottom: 8,
                        fontWeight: 600,
                      }}
                    >
                      🛵 PIN {o.delivery.pincode}
                      {o.delivery.address ? ` · ${o.delivery.address}` : ""}
                      {o.delivery.coords ? " · 📍 GPS shared" : ""}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: `1px solid ${C.border}`,
                      paddingTop: 10,
                    }}
                  >
                    <span style={{ color: C.muted, fontSize: 12 }}>
                      {o.status === "served"
                        ? o.type === "online"
                          ? "Delivered ✅"
                          : o.type === "takeaway"
                          ? "Picked up ✅"
                          : "Served ✅"
                        : o.type === "online"
                        ? "On its way to you 🛵"
                        : "Being taken care of 👨‍🍳"}
                    </span>
                    <span style={{ fontWeight: 800, color: C.green }}>
                      ₹{o.total}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </>
        )}
      </div>

      {/* Floating "order now" bar — stays visible while scrolling the menu, just like Swiggy/Zomato's sticky cart strip */}
      {cartCount > 0 && view === "menu" && (
        <div
          onClick={placeOrder}
          style={{
            position: "fixed",
            bottom: 58,
            left: 0,
            right: 0,
            background: GRAD,
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 99,
            boxShadow: "0 -6px 18px rgba(255,90,60,0.35)",
            cursor: "pointer",
          }}
        >
          <div style={{ color: "#fff" }}>
            <div style={{ fontWeight: 800, fontSize: 13 }}>
              {cartCount} item{cartCount > 1 ? "s" : ""} · ₹
              {total + Math.round(total * 0.05)}
            </div>
            <div style={{ fontSize: 11, color: "#FFEDE3" }}>
              {user.table} · Tap to place order
            </div>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setView("cart");
            }}
            style={{
              background: "rgba(255,255,255,0.25)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 12.5,
              padding: "9px 16px",
              borderRadius: 10,
              whiteSpace: "nowrap",
            }}
          >
            View Cart ➜
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: C.card,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          zIndex: 100,
        }}
      >
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              padding: "8px 2px 10px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: view === n.id ? C.accent : C.muted,
            }}
          >
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span
              style={{ fontSize: 10, fontWeight: view === n.id ? 800 : 500 }}
            >
              {n.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── WAITER VIEW ── */
function WaiterView({
  orders,
  addOrder,
  advanceOrder,
  reservations,
  reserveTable,
  cancelReservation,
  onLogout,
  isMobile,
}: any) {
  const [tab, setTab] = useState("tables");
  const [selTable, setSelTable] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [custName, setCustName] = useState("");
  const [cat, setCat] = useState("All");

  // reservation form state
  const [resTable, setResTable] = useState<string | null>(null);
  const [resName, setResName] = useState("");
  const [resPhone, setResPhone] = useState("");
  const [resSize, setResSize] = useState(2);
  const [resTime, setResTime] = useState("");
  const [resError, setResError] = useState("");

  const tableOrders = (tid: string) =>
    orders.filter((o: any) => o.table === tid && o.status !== "served");
  const cartItems = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ ...MENU.find((m) => m.id === +id)!, qty }));
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const filtered = MENU.filter((m) => cat === "All" || m.cat === cat);

  const tableState = (tid: string): "occupied" | "reserved" | "free" => {
    if (tableOrders(tid).length > 0) return "occupied";
    if (reservations[tid]) return "reserved";
    return "free";
  };

  const placeForTable = () => {
    if (!cartItems.length || !selTable) return;
    addOrder({
      id: `ORD-${String(Date.now()).slice(-4)}`,
      table: selTable,
      customerName: custName || "Guest",
      items: cartItems.map((i) => `${i.name}${i.qty > 1 ? ` x${i.qty}` : ""}`),
      itemsDetail: cartItems,
      status: "pending",
      time: "Just now",
      total,
      type: "dine-in",
    });
    if (reservations[selTable]) cancelReservation(selTable);
    setCart({});
    setCustName("");
    setSelTable(null);
    setTab("tables");
  };

  const submitReservation = () => {
    if (!resTable) {
      setResError("Select a table first");
      return;
    }
    if (!resName.trim() || !resPhone.trim() || !resTime) {
      setResError("Fill in name, phone & time");
      return;
    }
    if (tableState(resTable) !== "free") {
      setResError("That table isn't free right now");
      return;
    }
    reserveTable(resTable, {
      name: resName.trim(),
      phone: resPhone.trim(),
      partySize: resSize,
      time: resTime,
    });
    setResTable(null);
    setResName("");
    setResPhone("");
    setResSize(2);
    setResTime("");
    setResError("");
  };

  const nav = [
    { id: "tables", icon: "🪑", label: "Tables" },
    { id: "reserve", icon: "📅", label: "Reserve" },
    { id: "orders", icon: "🧾", label: "Orders" },
    { id: "take", icon: "➕", label: "Take Order" },
  ];

  const stateColor = {
    occupied: C.red,
    reserved: C.purple,
    free: C.green,
  } as const;
  const stateLabel = {
    occupied: "Occupied",
    reserved: "Reserved",
    free: "Free",
  } as const;

  return (
    <div
      style={{
        height: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Segoe UI',sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: `linear-gradient(90deg, ${C.blue}, #6AA6FF)`,
          padding: "14px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          boxShadow: "0 4px 14px rgba(61,139,255,0.25)",
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 15, color: "#fff" }}>
            🙋 Waiter Panel
          </div>
          <div style={{ fontSize: 11, color: "#E6F0FF" }}>
            Table Management Hub
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.5)",
            color: "#fff",
            padding: "5px 12px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          ← Exit
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 80px" }}>
        {tab === "tables" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 12,
                fontSize: 11,
                color: C.muted,
                fontWeight: 600,
              }}
            >
              <span>🟢 Free</span>
              <span>🔴 Occupied</span>
              <span>🟣 Reserved</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
              }}
            >
              {TABLES.map((t) => {
                const st = tableState(t.id);
                const c = stateColor[st];
                const res = reservations[t.id] as Reservation | undefined;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      if (st === "occupied") return;
                      setSelTable(t.id);
                      setTab("take");
                    }}
                    style={{
                      background: `${c}12`,
                      border: `2px solid ${c}55`,
                      borderRadius: 12,
                      padding: 12,
                      textAlign: "center",
                      cursor: st === "occupied" ? "default" : "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{t.id}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>
                      👥{t.seats}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: c,
                        marginTop: 4,
                      }}
                    >
                      {stateLabel[st]}
                    </div>
                    {st === "reserved" && res && (
                      <div
                        style={{ fontSize: 9, color: C.muted, marginTop: 3 }}
                      >
                        {res.name} · {res.time}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "reserve" && (
          <>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
              📅 Reserve Table for Walk-in / Offline Guest
            </div>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 10 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: C.muted,
                    marginBottom: 5,
                    fontWeight: 600,
                  }}
                >
                  Table
                </div>
                <select
                  value={resTable || ""}
                  onChange={(e) => setResTable(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select a free table</option>
                  {TABLES.filter((t) => tableState(t.id) === "free").map(
                    (t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} ({t.seats} seats)
                      </option>
                    )
                  )}
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      marginBottom: 5,
                      fontWeight: 600,
                    }}
                  >
                    Guest Name
                  </div>
                  <input
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    placeholder="Customer name"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      marginBottom: 5,
                      fontWeight: 600,
                    }}
                  >
                    Phone
                  </div>
                  <input
                    value={resPhone}
                    onChange={(e) =>
                      setResPhone(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    placeholder="10-digit number"
                    inputMode="numeric"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      marginBottom: 5,
                      fontWeight: 600,
                    }}
                  >
                    Party Size
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={resSize}
                    onChange={(e) => setResSize(Math.max(1, +e.target.value))}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      marginBottom: 5,
                      fontWeight: 600,
                    }}
                  >
                    Arrival Time
                  </div>
                  <input
                    type="time"
                    value={resTime}
                    onChange={(e) => setResTime(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
              {resError && (
                <div
                  style={{
                    color: C.red,
                    fontSize: 11,
                    marginBottom: 10,
                    fontWeight: 700,
                  }}
                >
                  {resError}
                </div>
              )}
              <Btn
                full
                color={C.purple}
                gradient={false}
                onClick={submitReservation}
              >
                📌 Confirm Reservation
              </Btn>
            </Card>

            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>
              Current Reservations
            </div>
            {Object.keys(reservations).length === 0 ? (
              <Card
                style={{
                  textAlign: "center",
                  padding: 24,
                  color: C.muted,
                  fontSize: 13,
                }}
              >
                No active reservations
              </Card>
            ) : (
              Object.entries(reservations).map(([tid, res]: any) => (
                <Card
                  key={tid}
                  style={{
                    borderLeft: `4px solid ${C.purple}`,
                    marginBottom: 10,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontWeight: 800 }}>{tid}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>
                      👥{res.partySize} · ⏰{res.time}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}
                  >
                    {res.name} · {res.phone}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn
                      sm
                      color={C.blue}
                      onClick={() => {
                        setSelTable(tid);
                        setCustName(res.name);
                        setTab("take");
                      }}
                    >
                      🍽️ Seat Now
                    </Btn>
                    <Btn
                      sm
                      outline
                      color={C.red}
                      onClick={() => cancelReservation(tid)}
                    >
                      ✕ Cancel
                    </Btn>
                  </div>
                </Card>
              ))
            )}
          </>
        )}

        {tab === "orders" &&
          orders
            .filter((o: any) => o.status !== "served")
            .map((o: any) => (
              <Card
                key={o.id}
                style={{
                  borderLeft: `4px solid ${sColor[o.status]}`,
                  marginBottom: 10,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 800, color: C.accent }}>
                      {o.id}
                    </span>
                    <span
                      style={{ marginLeft: 8, color: C.muted, fontSize: 12 }}
                    >
                      {o.table}
                    </span>
                  </div>
                  <Badge status={o.status} />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 800, color: C.green }}>
                    ₹{o.total}
                  </span>
                  {o.status === "ready" && (
                    <Btn sm onClick={() => advanceOrder(o.id)}>
                      🍽️ Served
                    </Btn>
                  )}
                </div>
              </Card>
            ))}

        {tab === "take" && (
          <>
            {selTable && reservations[selTable] && (
              <Card
                style={{
                  marginBottom: 12,
                  borderLeft: `4px solid ${C.purple}`,
                  padding: 10,
                }}
              >
                <div style={{ fontSize: 12, color: C.purple, fontWeight: 800 }}>
                  📌 Seating reservation for {reservations[selTable].name}
                </div>
              </Card>
            )}
            <Card style={{ marginBottom: 12 }}>
              <select
                value={selTable || ""}
                onChange={(e) => setSelTable(e.target.value)}
                style={{ ...inputStyle, marginBottom: 10 }}
              >
                <option value="">Select table</option>
                {TABLES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id}
                  </option>
                ))}
              </select>
              <input
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="Customer Name"
                style={inputStyle}
              />
            </Card>

            <div
              style={{
                display: "flex",
                gap: 7,
                overflowX: "auto",
                paddingBottom: 8,
                marginBottom: 10,
              }}
            >
              {MENU_CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  style={{
                    background: cat === c ? C.blue : "#FFFCF8",
                    border: `1.5px solid ${cat === c ? C.blue : C.border}`,
                    color: cat === c ? "#fff" : C.muted,
                    padding: "4px 12px",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {filtered.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.green }}>
                      ₹{item.price}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {(cart[item.id] || 0) > 0 && (
                    <>
                      <button
                        onClick={() =>
                          setCart((c) => ({
                            ...c,
                            [item.id]: Math.max(0, (c[item.id] || 0) - 1),
                          }))
                        }
                        style={{
                          background: "#F2ECE4",
                          border: "none",
                          color: C.text,
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          cursor: "pointer",
                          fontWeight: 800,
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontWeight: 800,
                          minWidth: 16,
                          textAlign: "center",
                        }}
                      >
                        {cart[item.id]}
                      </span>
                    </>
                  )}
                  <button
                    onClick={() =>
                      setCart((c) => ({
                        ...c,
                        [item.id]: (c[item.id] || 0) + 1,
                      }))
                    }
                    style={{
                      background: C.blue,
                      border: "none",
                      color: "#fff",
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            {cartItems.length > 0 && (
              <Card style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 10 }}>
                  Order Summary
                </div>
                {cartItems.map((i) => (
                  <div
                    key={i.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      marginBottom: 6,
                    }}
                  >
                    <span>
                      {i.name} × {i.qty}
                    </span>
                    <span style={{ color: C.green }}>₹{i.price * i.qty}</span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 800,
                    borderTop: `1px solid ${C.border}`,
                    paddingTop: 10,
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: C.green }}>₹{total}</span>
                </div>
                <Btn
                  full
                  color={C.blue}
                  disabled={!selTable}
                  onClick={placeForTable}
                >
                  📤 Send to Kitchen
                </Btn>
              </Card>
            )}
          </>
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: C.card,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          zIndex: 100,
        }}
      >
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              padding: "8px 2px 10px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: tab === n.id ? C.blue : C.muted,
            }}
          >
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            <span style={{ fontSize: 10 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── KITCHEN VIEW ── */
function KitchenView({ orders, advanceOrder, onLogout }: any) {
  const stages = [
    {
      st: "pending",
      label: "🔔 New Tickets",
      color: C.yellow,
      action: "🔥 Start Preparing",
    },
    {
      st: "preparing",
      label: "🔥 In Progress",
      color: C.blue,
      action: "✅ Ready for Pickup",
    },
    { st: "ready", label: "✅ Waiting Run", color: C.green, action: null },
  ];
  return (
    <div
      style={{
        height: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Segoe UI',sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: `linear-gradient(90deg, #E8A800, ${C.yellow})`,
          padding: "14px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          boxShadow: "0 4px 14px rgba(255,201,60,0.3)",
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 15, color: "#3D2A00" }}>
            👨‍🍳 Kitchen Display (KDS)
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: "rgba(0,0,0,0.12)",
            border: "1px solid rgba(0,0,0,0.2)",
            color: "#3D2A00",
            padding: "5px 12px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          ← Exit
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
          }}
        >
          {stages.map(({ st, label, color, action }) => (
            <div
              key={st}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: 14,
                borderTop: `4px solid ${color}`,
                boxShadow: "0 2px 12px rgba(43,27,61,0.05)",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  color: sText[st] || C.text,
                  marginBottom: 12,
                }}
              >
                {label}
              </div>
              {orders
                .filter((o: any) => o.status === st)
                .map((o: any) => (
                  <div
                    key={o.id}
                    style={{
                      background: "#FFFCF8",
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontWeight: 800, color: C.accent }}>
                        {o.id}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          background: "#F2ECE4",
                          padding: "1px 6px",
                          borderRadius: 4,
                          fontWeight: 700,
                        }}
                      >
                        {o.table}
                      </span>
                    </div>
                    {o.items.map((item: string, i: number) => (
                      <div key={i} style={{ fontSize: 12, padding: "3px 0" }}>
                        ▸ {item}
                      </div>
                    ))}
                    {action && (
                      <button
                        onClick={() => advanceOrder(o.id)}
                        style={{
                          background: color,
                          border: "none",
                          color: "#26200A",
                          padding: "6px 0",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontWeight: 800,
                          fontSize: 11,
                          width: "100%",
                          marginTop: 8,
                        }}
                      >
                        {action}
                      </button>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── DELIVERY AGENT VIEW ── */
function DeliveryAgentView({ orders, advanceOrder, onLogout }: any) {
  const onlineOrders = orders.filter((o: any) => o.type === "online");
  const readyOrders = onlineOrders.filter((o: any) => o.status === "ready");
  const prepOrders = onlineOrders.filter(
    (o: any) => o.status === "pending" || o.status === "preparing"
  );
  const deliveredOrders = onlineOrders.filter(
    (o: any) => o.status === "served"
  );

  // Build the Google Maps URL for an order. Returns null if there's no
  // delivery info to map at all.
  const mapsUrl = (o: any) => {
    const d = o.delivery as DeliveryInfo | undefined;
    if (!d) return null;
    return d.coords
      ? `https://www.google.com/maps?q=${d.coords.lat},${d.coords.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${d.address || ""} ${d.pincode || ""}`.trim() || "restaurant"
        )}`;
  };

  // A real <a> link styled like a button. Native links aren't blocked by the
  // popup restrictions that a sandboxed preview (e.g. CodeSandbox) applies to
  // JS-triggered window.open() calls, so this is the reliable way to open Maps.
  const MapsLinkBtn = ({ url }: { url: string | null }) => {
    if (!url) {
      return (
        <span
          style={{
            background: "#E7E2DC",
            border: "1.5px solid #E7E2DC",
            color: "#B4ACA3",
            padding: "5px 12px",
            borderRadius: 10,
            fontSize: 11.5,
            fontWeight: 800,
          }}
        >
          📍 Open in Maps
        </span>
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: C.cyan,
          border: `1.5px solid ${C.cyan}`,
          color: "#fff",
          padding: "5px 12px",
          borderRadius: 10,
          fontSize: 11.5,
          fontWeight: 800,
          textDecoration: "none",
          display: "inline-block",
          cursor: "pointer",
          boxShadow: `0 4px 14px ${C.cyan}33`,
          letterSpacing: 0.2,
        }}
      >
        📍 Open in Maps
      </a>
    );
  };

  const OrderCard = ({ o, actionable }: { o: any; actionable: boolean }) => (
    <Card
      style={{ marginBottom: 12, borderLeft: `4px solid ${sColor[o.status]}` }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 800, color: C.cyan }}>{o.id}</span>
        <Badge status={o.status} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
        {o.customerName}
      </div>
      {o.delivery && (
        <div
          style={{
            fontSize: 12,
            color: C.muted,
            marginBottom: 8,
            lineHeight: 1.5,
          }}
        >
          📍 PIN {o.delivery.pincode || "—"}
          {o.delivery.address ? ` · ${o.delivery.address}` : ""}
          {o.delivery.coords ? " · GPS shared" : " · Approximate location only"}
        </div>
      )}
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}
      >
        {o.items.map((item: string, i: number) => (
          <span
            key={i}
            style={{
              background: "#F4FEFC",
              border: `1px solid ${C.cyan}33`,
              padding: "2px 8px",
              borderRadius: 6,
              fontSize: 11,
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 800, color: C.green }}>₹{o.total}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <MapsLinkBtn url={mapsUrl(o)} />
          {actionable && (
            <Btn sm gradient onClick={() => advanceOrder(o.id)}>
              ✅ Mark Delivered
            </Btn>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div
      style={{
        height: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Segoe UI',sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: `linear-gradient(90deg, ${C.cyan}, #4FE0D8)`,
          padding: "14px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          boxShadow: "0 4px 14px rgba(0,194,203,0.3)",
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 15, color: "#04302E" }}>
            🛵 Delivery Dispatch
          </div>
          <div style={{ fontSize: 11, color: "#0A4A47" }}>
            {readyOrders.length} ready for pickup
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: "rgba(0,0,0,0.12)",
            border: "1px solid rgba(0,0,0,0.2)",
            color: "#04302E",
            padding: "5px 12px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          ← Exit
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 24px" }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 15,
            marginBottom: 10,
            color: C.cyan,
          }}
        >
          🟢 Ready for Pickup ({readyOrders.length})
        </div>
        {readyOrders.length === 0 ? (
          <Card
            style={{
              textAlign: "center",
              padding: 24,
              color: C.muted,
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            No orders waiting for pickup right now
          </Card>
        ) : (
          <div style={{ marginBottom: 20 }}>
            {readyOrders.map((o: any) => (
              <OrderCard key={o.id} o={o} actionable />
            ))}
          </div>
        )}

        <div
          style={{
            fontWeight: 800,
            fontSize: 15,
            marginBottom: 10,
            color: C.muted,
          }}
        >
          👨‍🍳 Still in Kitchen ({prepOrders.length})
        </div>
        {prepOrders.length === 0 ? (
          <Card
            style={{
              textAlign: "center",
              padding: 20,
              color: C.muted,
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            Nothing being prepared right now
          </Card>
        ) : (
          <div style={{ marginBottom: 20, opacity: 0.85 }}>
            {prepOrders.map((o: any) => (
              <OrderCard key={o.id} o={o} actionable={false} />
            ))}
          </div>
        )}

        <div
          style={{
            fontWeight: 800,
            fontSize: 15,
            marginBottom: 10,
            color: C.muted,
          }}
        >
          ✅ Delivered ({deliveredOrders.length})
        </div>
        {deliveredOrders.length === 0 ? (
          <Card
            style={{
              textAlign: "center",
              padding: 20,
              color: C.muted,
              fontSize: 13,
            }}
          >
            No completed deliveries yet
          </Card>
        ) : (
          <div style={{ opacity: 0.7 }}>
            {deliveredOrders
              .slice(-5)
              .reverse()
              .map((o: any) => (
                <OrderCard key={o.id} o={o} actionable={false} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── OWNER VIEW ── */
const OWNER_NAV = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "orders", icon: "🧾", label: "Orders" },
  { id: "tables", icon: "🪑", label: "Tables" },
];

function OwnerView({ orders, reservations, onLogout, isMobile }: any) {
  const [tab, setTab] = useState("dashboard");
  const [revenue] = useState(24890);

  const pending = orders.filter((o: any) => o.status === "pending").length;
  const activeOrders = orders.filter((o: any) => o.status !== "served");
  const onlineCount = orders.filter((o: any) => o.type === "online").length;

  const tableState = (tid: string): "occupied" | "reserved" | "free" => {
    if (orders.some((o: any) => o.table === tid && o.status !== "served"))
      return "occupied";
    if (reservations[tid]) return "reserved";
    return "free";
  };
  const stateColor = {
    occupied: C.red,
    reserved: C.purple,
    free: C.green,
  } as const;

  const Pages = () => (
    <>
      {tab === "dashboard" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {[
              ["🧾", "Total Operations", orders.length, C.accent],
              ["⏳", "Pending Tickets", pending, C.yellow],
              ["🛵", "Online Deliveries", onlineCount, C.cyan],
              [
                "📅",
                "Reservations",
                Object.keys(reservations).length,
                C.purple,
              ],
              ["💰", "Gross Revenue", `₹${revenue}`, C.green],
            ].map(([icon, label, value, color]: any) => (
              <div
                key={label}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: 14,
                  borderTop: `4px solid ${color}`,
                  boxShadow: "0 2px 12px rgba(43,27,61,0.05)",
                  flex: 1,
                  minWidth: 130,
                }}
              >
                <div style={{ fontSize: 20 }}>{icon}</div>
                <div
                  style={{ fontSize: 18, fontWeight: 800, color, marginTop: 4 }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    marginTop: 3,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
          <Card>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>
              Live Operations Monitor
            </div>
            {activeOrders.map((o: any) => (
              <div
                key={o.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 13,
                }}
              >
                <span>
                  {o.id} ({o.table})
                </span>
                <span style={{ color: sText[o.status], fontWeight: 800 }}>
                  {o.status.toUpperCase()}
                </span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === "orders" && (
        <div>
          {orders.map((o: any) => (
            <Card key={o.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong>{o.id}</strong> - {o.customerName} (
                  {o.type.toUpperCase()})
                </div>
                <Badge status={o.status} />
              </div>
              {o.delivery && (
                <div
                  style={{
                    fontSize: 11,
                    color: C.purple,
                    marginTop: 6,
                    fontWeight: 600,
                  }}
                >
                  🛵 PIN {o.delivery.pincode}
                  {o.delivery.address ? ` · ${o.delivery.address}` : ""}
                  {o.delivery.coords ? " · 📍 GPS shared" : ""}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === "tables" && (
        <>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 12,
              fontSize: 11,
              color: C.muted,
              fontWeight: 600,
            }}
          >
            <span>🟢 Free</span>
            <span>🔴 Occupied</span>
            <span>🟣 Reserved</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {TABLES.map((t) => {
              const st = tableState(t.id);
              const c = stateColor[st];
              return (
                <div
                  key={t.id}
                  style={{
                    background: `${c}12`,
                    border: `1.5px solid ${c}`,
                    borderRadius: 10,
                    padding: 12,
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                >
                  {t.id}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Segoe UI',sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 200,
          background: C.dark,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: 16,
            fontWeight: 900,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
          }}
        >
          👑{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Admin
          </span>
        </div>
        <div style={{ flex: 1, paddingTop: 10 }}>
          {OWNER_NAV.map((n) => (
            <div
              key={n.id}
              onClick={() => setTab(n.id)}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                background:
                  tab === n.id ? "rgba(255,90,60,0.18)" : "transparent",
                color: tab === n.id ? "#FF9B7E" : "#C9BEDB",
                fontSize: 13,
                fontWeight: 600,
                borderLeft:
                  tab === n.id
                    ? `3px solid ${C.accent}`
                    : "3px solid transparent",
              }}
            >
              {n.icon} {n.label}
            </div>
          ))}
        </div>
        <div style={{ padding: 12 }}>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#C9BEDB",
              padding: "7px 0",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            ← System Lock
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: 14,
            borderBottom: `1px solid ${C.border}`,
            background: C.card,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: 700 }}>Management Engine</span>
          <span style={{ color: C.green, fontWeight: 800 }}>
            ● System Secure
          </span>
        </div>
        <div
          style={{ flex: 1, overflowY: "auto", padding: 20, background: C.bg }}
        >
          <Pages />
        </div>
      </div>
    </div>
  );
}

/* ── ROOT APP ── */
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [orders, setOrders] = useState([
    {
      id: "ORD-0001",
      table: "T-3",
      customerName: "Priya",
      items: ["Butter Chicken", "Naan x2"],
      status: "preparing",
      time: "8m ago",
      total: 370,
      type: "dine-in",
    },
    {
      id: "ORD-0002",
      table: "T-7",
      customerName: "Arjun",
      items: ["Chicken Biryani", "Mango Lassi"],
      status: "ready",
      time: "15m ago",
      total: 410,
      type: "dine-in",
    },
    {
      id: "ORD-0003",
      table: "ONLINE",
      customerName: "Neha",
      items: ["Paneer Tikka"],
      status: "ready",
      time: "2m ago",
      total: 220,
      type: "online",
      delivery: {
        pincode: "500081",
        address: "Flat 302, Vista Towers, Gachibowli",
        coords: { lat: 17.4401, lng: 78.3489 },
      },
    },
    {
      id: "ORD-0004",
      table: "ONLINE",
      customerName: "Rahul",
      items: ["Chicken Biryani", "Gulab Jamun x2"],
      status: "pending",
      time: "1m ago",
      total: 480,
      type: "online",
      delivery: {
        pincode: "500032",
        address: "Jubilee Hills Check Post",
        coords: null,
      },
    },
  ]);
  const [reservations, setReservations] = useState<Record<string, Reservation>>(
    {}
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const addOrder = (o: any) => setOrders((prev) => [...prev, o]);
  const advanceOrder = (id: string) => {
    const flow = ["pending", "preparing", "ready", "served"];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = flow[flow.indexOf(o.status) + 1];
        return next ? { ...o, status: next } : o;
      })
    );
  };
  const reserveTable = (tableId: string, res: Reservation) =>
    setReservations((prev) => ({ ...prev, [tableId]: res }));
  const cancelReservation = (tableId: string) =>
    setReservations((prev) => {
      const next = { ...prev };
      delete next[tableId];
      return next;
    });

  const onLogout = () => setSession(null);

  if (!session) {
    return (
      <LoginScreen onLogin={(role, extra) => setSession({ role, ...extra })} />
    );
  }

  const props = { orders, addOrder, advanceOrder, onLogout, isMobile };

  if (session.role === "customer")
    return <CustomerView {...props} user={session} />;
  if (session.role === "waiter")
    return (
      <WaiterView
        {...props}
        reservations={reservations}
        reserveTable={reserveTable}
        cancelReservation={cancelReservation}
      />
    );
  if (session.role === "kitchen") return <KitchenView {...props} />;
  if (session.role === "delivery") return <DeliveryAgentView {...props} />;
  if (session.role === "owner")
    return <OwnerView {...props} reservations={reservations} />;
  return null;
}

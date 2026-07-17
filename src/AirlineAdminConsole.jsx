import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

/* ---------------------------------------------------------
   Brand tokens — lifted from the SkyRoute booking prototype
   (style.scss): navy primary, amber ticket-stub accent,
   Sora display / Inter body / IBM Plex Mono for data.
--------------------------------------------------------- */
const NAVY = "#2b3a67";
const INK = "#1b2430";
const AMBER = "#f2a93b";
const PAPER = "#f8f9fc";
const SLATE = "#6b7690";
const SUCCESS = "#2f6b3a";
const DANGER = "#a13a3a";
const LINE = "rgba(27,36,48,0.1)";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

const AIRPORTS = [
  { code: "MNL", city: "Manila" },
  { code: "CEB", city: "Cebu" },
  { code: "DVO", city: "Davao" },
  { code: "ILO", city: "Iloilo" },
  { code: "PPS", city: "Puerto Princesa" },
];
const cityName = (code) => AIRPORTS.find((a) => a.code === code)?.city || code;

const AIRLINES = ["SkyRoute Air", "Pacific Wing", "IslandJet"];

/* ---------------------------------------------------------
   Deterministic mock data — a small seeded RNG so the
   dashboard renders the same numbers on every load.
--------------------------------------------------------- */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rand = seededRandom(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const ROUTE_PAIRS = [
  ["MNL", "CEB"], ["CEB", "MNL"], ["MNL", "DVO"], ["DVO", "MNL"],
  ["MNL", "ILO"], ["ILO", "MNL"], ["MNL", "PPS"], ["PPS", "MNL"],
  ["CEB", "DVO"], ["DVO", "CEB"],
];

const FLIGHT_STATUSES = ["On time", "Boarding", "Delayed", "Departed"];
const FLIGHT_TIMES = [
  ["06:15", "07:35", "1h 20m"], ["08:00", "09:20", "1h 20m"],
  ["10:40", "12:05", "1h 25m"], ["13:15", "14:45", "1h 30m"],
  ["16:20", "19:10", "2h 50m"], ["19:30", "20:55", "1h 25m"],
];

const flights = ROUTE_PAIRS.flatMap(([origin, destination], i) => {
  const airline = AIRLINES[i % AIRLINES.length];
  const [depart, arrive, duration] = FLIGHT_TIMES[i % FLIGHT_TIMES.length];
  const base = 1600 + Math.floor(rand() * 12) * 90;
  return [{
    id: `${origin}-${destination}-${i}`,
    flightNo: `${airline === "SkyRoute Air" ? "SR" : airline === "Pacific Wing" ? "PW" : "IJ"} ${100 + i * 7}`,
    airline,
    origin,
    destination,
    depart,
    arrive,
    duration,
    price: base,
    status: FLIGHT_STATUSES[Math.floor(rand() * FLIGHT_STATUSES.length)],
  }];
});

const FIRST_NAMES = ["Maria", "Jose", "Andres", "Liza", "Carlo", "Angelica", "Ramon", "Kristine", "Paolo", "Bea", "Miguel", "Trisha"];
const LAST_NAMES = ["Santos", "Reyes", "Cruz", "Bautista", "Garcia", "Torres", "Flores", "Mendoza", "Aquino", "Villanueva"];
const PNR_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makePnr() {
  let c = "";
  for (let i = 0; i < 6; i++) c += PNR_CHARS[Math.floor(rand() * PNR_CHARS.length)];
  return c;
}

const BOOKING_STATUSES = ["Confirmed", "Confirmed", "Confirmed", "Pending", "Cancelled"];
const TODAY = new Date("2026-07-16");

const bookings = Array.from({ length: 46 }, (_, i) => {
  const flight = pick(flights);
  const paxCount = 1 + Math.floor(rand() * 3);
  const daysAgo = Math.floor(rand() * 14);
  const date = new Date(TODAY);
  date.setDate(date.getDate() - daysAgo);
  const status = pick(BOOKING_STATUSES);
  return {
    pnr: makePnr(),
    passenger: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    flight,
    pax: paxCount,
    date: date.toISOString().split("T")[0],
    seat: `${12 + Math.floor(rand() * 15)}${["A", "B", "C", "D", "E", "F"][Math.floor(rand() * 6)]}`,
    price: flight.price * paxCount,
    status,
  };
});

/* ---------------------------------------------------------
   Derived analytics
--------------------------------------------------------- */
function useAnalytics() {
  return useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "Confirmed");
    const revenue = confirmed.reduce((sum, b) => sum + b.price, 0);
    const avgFare = confirmed.length ? Math.round(revenue / confirmed.length) : 0;
    const cancelled = bookings.filter((b) => b.status === "Cancelled").length;
    const cancellationRate = Math.round((cancelled / bookings.length) * 1000) / 10;

    const byDay = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(TODAY);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      byDay[key] = 0;
    }
    bookings.forEach((b) => {
      if (byDay[b.date] !== undefined) byDay[b.date] += 1;
    });
    const trend = Object.entries(byDay).map(([date, count]) => ({
      date: date.slice(5),
      count,
    }));

    const statusCounts = ["Confirmed", "Pending", "Cancelled"].map((s) => ({
      name: s,
      value: bookings.filter((b) => b.status === s).length,
    }));

    const revenueByRoute = {};
    confirmed.forEach((b) => {
      const key = `${b.flight.origin}–${b.flight.destination}`;
      revenueByRoute[key] = (revenueByRoute[key] || 0) + b.price;
    });
    const routeBars = Object.entries(revenueByRoute)
      .map(([route, value]) => ({ route, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return { revenue, avgFare, cancellationRate, trend, statusCounts, routeBars, totalBookings: bookings.length };
  }, []);
}

/* ---------------------------------------------------------
   UI atoms
--------------------------------------------------------- */
function StatusBadge({ status }) {
  const map = {
    Confirmed: { bg: "rgba(47,107,58,0.1)", fg: SUCCESS },
    Pending: { bg: "rgba(242,169,59,0.15)", fg: "#8a5a12" },
    Cancelled: { bg: "rgba(161,58,58,0.1)", fg: DANGER },
    "On time": { bg: "rgba(47,107,58,0.1)", fg: SUCCESS },
    Boarding: { bg: "rgba(43,58,103,0.1)", fg: NAVY },
    Delayed: { bg: "rgba(242,169,59,0.15)", fg: "#8a5a12" },
    Departed: { bg: "rgba(107,118,144,0.15)", fg: SLATE },
  };
  const c = map[status] || { bg: "#eee", fg: SLATE };
  return (
    <span
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.03em",
        padding: "3px 9px",
        borderRadius: 3,
        background: c.bg,
        color: c.fg,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function KpiCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${LINE}`,
        borderRadius: 6,
        padding: "18px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: accent || AMBER,
        }}
      />
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: SLATE,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 26, color: INK }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: SLATE, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

function ChartCard({ title, children, style }) {
  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${LINE}`,
        borderRadius: 6,
        padding: "18px 20px",
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: SLATE,
          marginBottom: 14,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------
   Views
--------------------------------------------------------- */
function DashboardView() {
  const a = useAnalytics();
  const pieColors = { Confirmed: SUCCESS, Pending: AMBER, Cancelled: DANGER };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <KpiCard label="Total bookings" value={a.totalBookings} sub="Last 14 days" />
        <KpiCard
          label="Confirmed revenue"
          value={`₱${a.revenue.toLocaleString()}`}
          sub="Confirmed bookings only"
          accent={NAVY}
        />
        <KpiCard label="Average fare" value={`₱${a.avgFare.toLocaleString()}`} sub="Per confirmed booking" />
        <KpiCard
          label="Cancellation rate"
          value={`${a.cancellationRate}%`}
          sub="Of all bookings"
          accent={DANGER}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14, marginBottom: 14 }}>
        <ChartCard title="Bookings — last 14 days">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={a.trend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: SLATE }} axisLine={{ stroke: LINE }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: SLATE }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, fontFamily: "Inter, sans-serif", border: `1px solid ${LINE}`, borderRadius: 4 }}
              />
              <Line type="monotone" dataKey="count" stroke={NAVY} strokeWidth={2} dot={{ r: 3, fill: NAVY }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Booking status">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={a.statusCounts}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
                stroke="white"
                strokeWidth={2}
              >
                {a.statusCounts.map((entry) => (
                  <Cell key={entry.name} fill={pieColors[entry.name]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, fontFamily: "Inter, sans-serif" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: -8, flexWrap: "wrap" }}>
            {a.statusCounts.map((s) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: SLATE }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: pieColors[s.name] }} />
                {s.name} · {s.value}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Revenue by route (confirmed bookings)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={a.routeBars} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
            <CartesianGrid stroke={LINE} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: SLATE }} axisLine={false} tickLine={false} />
            <YAxis
              dataKey="route"
              type="category"
              tick={{ fontSize: 12, fill: INK, fontFamily: "IBM Plex Mono, monospace" }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              formatter={(v) => `₱${v.toLocaleString()}`}
              contentStyle={{ fontSize: 12, fontFamily: "Inter, sans-serif", border: `1px solid ${LINE}`, borderRadius: 4 }}
            />
            <Bar dataKey="value" fill={AMBER} radius={[0, 3, 3, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function FlightsView() {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", ...FLIGHT_STATUSES];
  const rows = filter === "All" ? flights : flights.filter((f) => f.status === filter);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: 4,
              border: `1px solid ${filter === s ? NAVY : LINE}`,
              background: filter === s ? NAVY : "white",
              color: filter === s ? "white" : SLATE,
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ background: "white", border: `1px solid ${LINE}`, borderRadius: 6, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: PAPER }}>
              {["Flight", "Airline", "Route", "Depart", "Arrive", "Duration", "Price", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: SLATE,
                    borderBottom: `1px solid ${LINE}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} style={{ borderBottom: `1px solid ${LINE}` }}>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", color: INK }}>{f.flightNo}</td>
                <td style={{ padding: "10px 14px", color: INK }}>{f.airline}</td>
                <td style={{ padding: "10px 14px", color: INK }}>
                  {cityName(f.origin)} → {cityName(f.destination)}
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", color: SLATE }}>{f.depart}</td>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", color: SLATE }}>{f.arrive}</td>
                <td style={{ padding: "10px 14px", color: SLATE }}>{f.duration}</td>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", color: INK, fontWeight: 500 }}>
                  ₱{f.price.toLocaleString()}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <StatusBadge status={f.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookingsView() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const statuses = ["All", "Confirmed", "Pending", "Cancelled"];

  const rows = bookings
    .filter((b) => filter === "All" || b.status === filter)
    .filter((b) => b.passenger.toLowerCase().includes(query.toLowerCase()) || b.pnr.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 500,
                padding: "6px 12px",
                borderRadius: 4,
                border: `1px solid ${filter === s ? NAVY : LINE}`,
                background: filter === s ? NAVY : "white",
                color: filter === s ? "white" : SLATE,
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search passenger or PNR"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            padding: "7px 12px",
            borderRadius: 4,
            border: `1px solid ${LINE}`,
            minWidth: 220,
            outline: "none",
          }}
        />
      </div>

      <div style={{ background: "white", border: `1px solid ${LINE}`, borderRadius: 6, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: PAPER }}>
              {["PNR", "Passenger", "Route", "Flight", "Date", "Seat", "Price", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: SLATE,
                    borderBottom: `1px solid ${LINE}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.pnr} style={{ borderBottom: `1px solid ${LINE}` }}>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", color: AMBER === "#f2a93b" ? "#8a5a12" : NAVY, fontWeight: 600, letterSpacing: "0.06em" }}>
                  {b.pnr}
                </td>
                <td style={{ padding: "10px 14px", color: INK }}>{b.passenger}</td>
                <td style={{ padding: "10px 14px", color: INK }}>
                  {b.flight.origin} → {b.flight.destination}
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", color: SLATE }}>{b.flight.flightNo}</td>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", color: SLATE }}>{b.date}</td>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", color: SLATE }}>{b.seat}</td>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", color: INK, fontWeight: 500 }}>
                  ₱{b.price.toLocaleString()}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: "20px 14px", textAlign: "center", color: SLATE }}>
                  No bookings match this search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Shell — navy sidebar with a perforated ticket-stub edge,
   echoing the boarding-pass signature from the booking app.
--------------------------------------------------------- */
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", num: "01" },
  { key: "flights", label: "Flights", num: "02" },
  { key: "bookings", label: "Bookings", num: "03" },
];

export default function AirlineAdminConsole() {
  const [view, setView] = useState("dashboard");

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: PAPER, minHeight: 600, display: "flex" }}>
      <style>{FONTS}</style>

      <aside
        style={{
          width: 210,
          background: NAVY,
          color: "white",
          padding: "24px 0",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "0 22px 22px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>
            SkyRoute
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(244,246,251,0.55)",
              marginTop: 3,
            }}
          >
            Ops console
          </div>
        </div>

        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                marginBottom: 2,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                background: view === item.key ? "rgba(242,169,59,0.16)" : "transparent",
                color: view === item.key ? AMBER : "rgba(244,246,251,0.8)",
              }}
            >
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, opacity: 0.7 }}>{item.num}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500 }}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: "14px 22px 0", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: "rgba(244,246,251,0.45)" }}>
            Mark Anthony Estrecho
          </div>
        </div>

        {/* perforated ticket-stub edge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: -1,
            width: 1,
            backgroundImage: `repeating-linear-gradient(to bottom, rgba(255,255,255,0.35) 0, rgba(255,255,255,0.35) 6px, transparent 6px, transparent 12px)`,
          }}
        />
      </aside>

      <main style={{ flex: 1, padding: "26px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 21, color: INK, margin: 0 }}>
            {view === "dashboard" && "Operations overview"}
            {view === "flights" && "Flight schedule"}
            {view === "bookings" && "Bookings"}
          </h1>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: SLATE }}>
            {TODAY.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {view === "dashboard" && <DashboardView />}
        {view === "flights" && <FlightsView />}
        {view === "bookings" && <BookingsView />}
      </main>
    </div>
  );
}

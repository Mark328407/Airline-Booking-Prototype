# SkyRoute — Airline Booking Admin Console

A frontend-only operations dashboard prototype for an airline booking system. Built with React and Recharts, using deterministic seeded mock data so the dashboard renders consistent numbers on every load — no backend required.

**Live demo:** _add your Vercel URL here once deployed_

## Features

- **Dashboard** — KPI cards (total bookings, confirmed revenue, average fare, cancellation rate), a 14-day booking trend line chart, a booking-status pie chart, and a revenue-by-route bar chart
- **Flights** — filterable flight schedule table with live status badges (On time / Boarding / Delayed / Departed)
- **Bookings** — searchable, filterable bookings table (by passenger name or PNR) with per-status badges

## Design

Navy/amber "boarding pass" visual language shared with the companion SkyRoute booking prototype: Sora for display type, Inter for body text, IBM Plex Mono for flight codes, PNRs, and data. The sidebar's dashed edge echoes a perforated ticket stub.

## Tech Stack

- React 18 + Vite
- Recharts for all data visualization
- Plain inline styles (no CSS framework) — a self-contained single component

## Getting Started

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

## Author

**Mark Anthony Estrecho** — [Portfolio](https://my-portfolio-cilr.vercel.app/) · [GitHub](https://github.com/Mark328407)
# Airline-Booking-Admin-Console

# Airline Booking Prototype

**[Live Demo →](https://airline-booking-prototype.vercel.app/)**

A frontend-only airline booking flow prototype built with **Vue.js 3** and **Bootstrap 5** — search flights, pick a fare, enter passenger details, and get a boarding-pass-style confirmation with a generated PNR. No backend: flight data is mocked, so the whole flow runs entirely in the browser.

## Features

- **Flight search** — pick origin/destination airports, date, and passenger count
- **Results list** — mock flights with times, duration, stops, and fare
- **Passenger details** — dynamic form based on passenger count
- **Confirmation** — a boarding-pass-styled summary with a randomly generated PNR, gate, and seat
- **Step indicator** in the navbar tracking progress through the 4-step flow

## Tech Stack

- Vue 3 (Composition API, `<script setup>`)
- Vue Router
- Bootstrap 5 (customized via Sass variable overrides — not default Bootstrap blue)
- Vite

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Design Notes

Rather than using Bootstrap's default theme as-is, the primary/secondary/warning colors and typography were overridden via Sass variables (`src/style.scss`) before importing Bootstrap, giving it a deep sky-indigo and amber palette themed around flight/tickets. The confirmation screen's boarding-pass card — with its perforated edge and PNR stub — is the signature visual element, built with real generated booking data rather than as pure decoration.

## Author

**Mark Anthony Estrecho** — [GitHub](https://github.com/Mark328407)

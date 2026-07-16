import { reactive } from "vue";

function generatePNR() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const bookingStore = reactive({
  origin: "",
  destination: "",
  travelDate: "",
  passengers: 1,
  selectedFlight: null,
  passengerDetails: [],
  pnr: "",

  setSearch(origin, destination, travelDate, passengers) {
    this.origin = origin;
    this.destination = destination;
    this.travelDate = travelDate;
    this.passengers = passengers;
  },

  selectFlight(flight) {
    this.selectedFlight = flight;
    this.passengerDetails = Array.from({ length: this.passengers }, () => ({
      firstName: "",
      lastName: "",
    }));
  },

  setPassengerDetails(details) {
    this.passengerDetails = details;
  },

  confirmBooking() {
    this.pnr = generatePNR();
  },

  totalPrice() {
    if (!this.selectedFlight) return 0;
    return this.selectedFlight.price * this.passengers;
  },

  reset() {
    this.origin = "";
    this.destination = "";
    this.travelDate = "";
    this.passengers = 1;
    this.selectedFlight = null;
    this.passengerDetails = [];
    this.pnr = "";
  },
});

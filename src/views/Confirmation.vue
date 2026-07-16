<script setup>
import { useRouter } from "vue-router";
import { bookingStore } from "../store/booking";
import { airports } from "../data/flights";

const router = useRouter();

if (!bookingStore.pnr) {
  router.replace("/");
}

function cityName(code) {
  return airports.find((a) => a.code === code)?.city || code;
}

function startOver() {
  bookingStore.reset();
  router.push("/");
}

const gate = String.fromCharCode(65 + Math.floor(Math.random() * 6)) + (10 + Math.floor(Math.random() * 20));
const seat = `${12 + Math.floor(Math.random() * 15)}${["A", "B", "C", "D", "E", "F"][Math.floor(Math.random() * 6)]}`;
</script>

<template>
  <div class="container py-5">
    <div class="text-center mb-4">
      <h1 class="h3">You're booked! 🎉</h1>
      <p class="text-secondary">A confirmation has been generated below — save your PNR.</p>
    </div>

    <div v-if="bookingStore.selectedFlight" class="boarding-pass">
      <div class="boarding-pass-main">
        <div class="d-flex justify-content-between align-items-start mb-4">
          <div>
            <div class="boarding-pass-label">Airline</div>
            <div class="boarding-pass-value">{{ bookingStore.selectedFlight.airline }}</div>
          </div>
          <div class="text-end">
            <div class="boarding-pass-label">Flight</div>
            <div class="boarding-pass-value mono">{{ bookingStore.selectedFlight.flightNo }}</div>
          </div>
        </div>

        <div class="d-flex justify-content-between mb-4">
          <div>
            <div class="boarding-pass-label">From</div>
            <div class="boarding-pass-value">
              {{ cityName(bookingStore.origin) }} ({{ bookingStore.origin }})
            </div>
            <div class="mono small text-secondary">{{ bookingStore.selectedFlight.departTime }}</div>
          </div>
          <div class="text-end">
            <div class="boarding-pass-label">To</div>
            <div class="boarding-pass-value">
              {{ cityName(bookingStore.destination) }} ({{ bookingStore.destination }})
            </div>
            <div class="mono small text-secondary">{{ bookingStore.selectedFlight.arriveTime }}</div>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <div>
            <div class="boarding-pass-label">Passenger</div>
            <div class="boarding-pass-value">
              {{ bookingStore.passengerDetails[0]?.firstName }}
              {{ bookingStore.passengerDetails[0]?.lastName }}
              <span v-if="bookingStore.passengers > 1" class="text-secondary small">
                + {{ bookingStore.passengers - 1 }} more
              </span>
            </div>
          </div>
          <div class="text-end">
            <div class="boarding-pass-label">Date</div>
            <div class="boarding-pass-value mono">{{ bookingStore.travelDate }}</div>
          </div>
        </div>
      </div>

      <div class="boarding-pass-stub">
        <div>
          <div class="boarding-pass-label" style="color: rgba(244, 246, 251, 0.6)">Gate</div>
          <div class="boarding-pass-value" style="color: white">{{ gate }}</div>
          <div class="boarding-pass-label" style="color: rgba(244, 246, 251, 0.6)">Seat</div>
          <div class="boarding-pass-value" style="color: white">{{ seat }}</div>
        </div>
        <div>
          <div class="boarding-pass-label" style="color: rgba(244, 246, 251, 0.6)">PNR</div>
          <div class="boarding-pass-pnr">{{ bookingStore.pnr }}</div>
        </div>
      </div>
    </div>

    <div class="text-center mt-4">
      <div class="mono text-secondary mb-3">
        Total paid: ₱{{ bookingStore.totalPrice().toLocaleString() }}
      </div>
      <button class="btn btn-outline-secondary btn-sm" @click="startOver">Book another flight</button>
    </div>
  </div>
</template>

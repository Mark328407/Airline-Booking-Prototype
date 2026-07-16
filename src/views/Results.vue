<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { searchFlights, airports } from "../data/flights";
import { bookingStore } from "../store/booking";
import FlightCard from "../components/FlightCard.vue";

const router = useRouter();

if (!bookingStore.origin || !bookingStore.destination) {
  router.replace("/");
}

const flights = computed(() => searchFlights(bookingStore.origin, bookingStore.destination));

function cityName(code) {
  return airports.find((a) => a.code === code)?.city || code;
}

function handleSelect(flight) {
  bookingStore.selectFlight(flight);
  router.push("/passengers");
}
</script>

<template>
  <div class="container py-4">
    <div class="mb-4">
      <h1 class="h3">{{ cityName(bookingStore.origin) }} → {{ cityName(bookingStore.destination) }}</h1>
      <p class="text-secondary mono small">
        {{ bookingStore.travelDate }} · {{ bookingStore.passengers }}
        {{ bookingStore.passengers === 1 ? "passenger" : "passengers" }}
      </p>
    </div>

    <FlightCard
      v-for="flight in flights"
      :key="flight.id"
      :flight="flight"
      @select="handleSelect"
    />

    <p v-if="flights.length === 0" class="text-secondary">No flights found for this route.</p>

    <router-link to="/" class="btn btn-outline-secondary btn-sm mt-2">← Change search</router-link>
  </div>
</template>

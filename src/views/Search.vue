<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { airports } from "../data/flights";
import { bookingStore } from "../store/booking";

const router = useRouter();

const origin = ref(bookingStore.origin || "MNL");
const destination = ref(bookingStore.destination || "CEB");
const travelDate = ref(bookingStore.travelDate || new Date().toISOString().split("T")[0]);
const passengers = ref(bookingStore.passengers || 1);
const error = ref("");

function handleSearch() {
  if (origin.value === destination.value) {
    error.value = "Origin and destination can't be the same.";
    return;
  }
  error.value = "";
  bookingStore.setSearch(origin.value, destination.value, travelDate.value, Number(passengers.value));
  router.push("/results");
}

function swap() {
  const temp = origin.value;
  origin.value = destination.value;
  destination.value = temp;
}
</script>

<template>
  <div>
    <section class="hero-sky">
      <div class="container">
        <span class="eyebrow">Book a flight</span>
        <h1 class="mb-2">Find flights across the islands.</h1>
        <p class="text-white-50" style="max-width: 46ch">
          Search routes, compare times and fares, and book in a few quick steps.
        </p>
      </div>
    </section>

    <div class="container py-4">
      <div class="card shadow-sm" style="max-width: 760px; margin: -3.5rem auto 0">
        <div class="card-body p-4">
          <form @submit.prevent="handleSearch">
            <div class="row g-3 align-items-end">
              <div class="col-md-5">
                <label class="form-label small text-secondary text-uppercase">From</label>
                <select v-model="origin" class="form-select">
                  <option v-for="a in airports" :key="a.code" :value="a.code">
                    {{ a.city }} ({{ a.code }})
                  </option>
                </select>
              </div>

              <div class="col-md-1 d-flex justify-content-center">
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm rounded-circle"
                  style="width: 36px; height: 36px"
                  @click="swap"
                  aria-label="Swap origin and destination"
                >
                  ⇄
                </button>
              </div>

              <div class="col-md-5">
                <label class="form-label small text-secondary text-uppercase">To</label>
                <select v-model="destination" class="form-select">
                  <option v-for="a in airports" :key="a.code" :value="a.code">
                    {{ a.city }} ({{ a.code }})
                  </option>
                </select>
              </div>
            </div>

            <div class="row g-3 mt-1">
              <div class="col-md-6">
                <label class="form-label small text-secondary text-uppercase">Departure date</label>
                <input v-model="travelDate" type="date" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label small text-secondary text-uppercase">Passengers</label>
                <input v-model="passengers" type="number" min="1" max="6" class="form-control" required />
              </div>
            </div>

            <div v-if="error" class="alert alert-danger mt-3 py-2 small">{{ error }}</div>

            <button type="submit" class="btn btn-primary w-100 mt-4">Search flights</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

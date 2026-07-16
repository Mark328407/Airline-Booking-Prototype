<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { bookingStore } from "../store/booking";

const router = useRouter();

if (!bookingStore.selectedFlight) {
  router.replace("/");
}

const passengers = reactive(
  bookingStore.passengerDetails.length
    ? JSON.parse(JSON.stringify(bookingStore.passengerDetails))
    : Array.from({ length: bookingStore.passengers }, () => ({ firstName: "", lastName: "" }))
);

function handleSubmit() {
  bookingStore.setPassengerDetails(passengers);
  bookingStore.confirmBooking();
  router.push("/confirmation");
}
</script>

<template>
  <div class="container py-4" style="max-width: 640px">
    <h1 class="h3 mb-4">Passenger details</h1>

    <form @submit.prevent="handleSubmit">
      <div v-for="(p, i) in passengers" :key="i" class="card mb-3">
        <div class="card-body">
          <div class="small text-secondary text-uppercase mb-2">Passenger {{ i + 1 }}</div>
          <div class="row g-2">
            <div class="col-6">
              <input
                v-model="p.firstName"
                type="text"
                class="form-control"
                placeholder="First name"
                required
              />
            </div>
            <div class="col-6">
              <input
                v-model="p.lastName"
                type="text"
                class="form-control"
                placeholder="Last name"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-4">
        <router-link to="/results" class="btn btn-outline-secondary btn-sm">← Back</router-link>
        <button type="submit" class="btn btn-primary">Continue to confirmation</button>
      </div>
    </form>
  </div>
</template>

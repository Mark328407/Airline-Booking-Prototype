<script setup>
defineProps({
  flight: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select"]);
</script>

<template>
  <div class="flight-card card mb-3">
    <div class="card-body d-flex align-items-center flex-wrap gap-3">
      <div style="min-width: 140px">
        <div class="fw-semibold">{{ flight.airline }}</div>
        <div class="text-secondary small mono">{{ flight.flightNo }}</div>
      </div>

      <div class="d-flex align-items-center flex-grow-1" style="min-width: 220px">
        <div class="text-center">
          <div class="flight-route fs-5">{{ flight.departTime }}</div>
          <div class="text-secondary small">{{ flight.origin }}</div>
        </div>
        <div class="flight-divider"></div>
        <div class="text-center">
          <div class="flight-route fs-5">{{ flight.arriveTime }}</div>
          <div class="text-secondary small">{{ flight.destination }}</div>
        </div>
      </div>

      <div class="text-center" style="min-width: 100px">
        <div class="small text-secondary">{{ flight.duration }}</div>
        <div class="small text-secondary">{{ flight.stops }}</div>
      </div>

      <div class="text-end" style="min-width: 140px">
        <div class="flight-price">₱{{ flight.price.toLocaleString() }}</div>
        <button class="btn btn-primary btn-sm mt-2" @click="emit('select', flight)">
          Select
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const steps = [
  { path: "/", label: "1" },
  { path: "/results", label: "2" },
  { path: "/passengers", label: "3" },
  { path: "/confirmation", label: "4" },
];

function stepClass(path) {
  const currentIndex = steps.findIndex((s) => s.path === route.path);
  const stepIndex = steps.findIndex((s) => s.path === path);
  if (stepIndex < currentIndex) return "step done";
  if (stepIndex === currentIndex) return "step active";
  return "step";
}
</script>

<template>
  <nav class="navbar navbar-expand" style="background: #1b2430">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link to="/" class="navbar-brand-custom text-white text-decoration-none fs-5">
        SkyRoute
      </router-link>
      <div class="step-indicator text-white-50">
        <span :class="stepClass('/')" class="step">1</span>
        <span :class="stepClass('/results')" class="step">2</span>
        <span :class="stepClass('/passengers')" class="step">3</span>
        <span :class="stepClass('/confirmation')" class="step">4</span>
      </div>
    </div>
  </nav>
</template>

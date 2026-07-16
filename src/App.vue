<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <Navbar />
  <main class="app-main">
    <router-view />
  </main>
  <footer class="app-footer">
    <div class="container app-footer-inner">
      <span class="app-footer-brand">SkyRoute</span>
      <p class="app-footer-text">
        Built by
        <a href="https://github.com/Mark328407" target="_blank" rel="noopener noreferrer">
          Mark Anthony Estrecho
        </a>
        · Vue.js + Bootstrap prototype
      </p>
      <span class="app-footer-year">&copy; {{ new Date().getFullYear() }} SkyRoute</span>
    </div>
  </footer>
</template>

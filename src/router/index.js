import { createRouter, createWebHistory } from "vue-router";
import Search from "../views/Search.vue";
import Results from "../views/Results.vue";
import PassengerDetails from "../views/PassengerDetails.vue";
import Confirmation from "../views/Confirmation.vue";

const routes = [
  { path: "/", name: "search", component: Search },
  { path: "/results", name: "results", component: Results },
  { path: "/passengers", name: "passengers", component: PassengerDetails },
  { path: "/confirmation", name: "confirmation", component: Confirmation },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

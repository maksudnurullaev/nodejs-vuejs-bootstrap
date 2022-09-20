import { createRouter, createWebHistory } from "vue-router";
import View4Gen from "@/components/View4Gen.vue";
import View4Help from "@/components/View4Help.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "docx",
      component: View4Gen,
    },
    {
      path: "/help",
      name: "help",
      component: View4Help,
    },
  ],
});

export default router;

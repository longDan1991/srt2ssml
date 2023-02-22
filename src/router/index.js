import { createRouter, createWebHashHistory } from "vue-router";
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/Home/index.vue"),
      redirect: "/home/settings",
      children: [
        {
          path: "/home/settings",
          name: "settings",
          component: () => import("../views/Settings.vue"),
        },
      ],
    },
  ],
});

export default router;

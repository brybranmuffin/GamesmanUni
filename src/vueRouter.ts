import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/puzzles",
      component: () =>
        import(/* webpackChunkName: "puzzles" */ "./views/Puzzles.vue"),
    },
    {
      path: "/games",
      component: () =>
        import(/* webpackChunkName: "games" */ "./views/Games.vue"),
    },
    {
      path: "/puzzles/:gameId/variants",
      name: "puzzle_variants",
      component: () =>
        import(
          /* webpackChunkName: "variants" */ "./views/VariantsPuzzles.vue"
        ),
    },
    {
      path: "/games/:gameId/variants",
      name: "game_variants",
      component: () =>
        import(/* webpackChunkName: "variants" */ "./views/Variants.vue"),
    },
    /* TODO: General game type? */
    {
      path: "/puzzles/:gameId/variants/:variantId",
      name: "puzzle",
      component: () =>
        import(/* webpackChunkName: "game" */ "./views/Puzzle.vue"),
    },
    {
      path: "/games/:gameId/variants/:variantId",
      name: "game",
      component: () =>
        import(/* webpackChunkName: "game" */ "./views/Game.vue"),
    },
    {
      path: "/about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue"),
    },
    {
      path: "/updates",
      component: () =>
        import(/* webpackChunkName: "updates" */ "./views/Updates.vue"),
    },
    {
      path: "*",
      component: () =>
        import(
          /* webpackChunkName: "pageNotFound" */ "./views/PageNotFound.vue"
        ),
    },
  ],
});

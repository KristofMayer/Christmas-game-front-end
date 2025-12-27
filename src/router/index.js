import { createRouter, createWebHistory } from "vue-router";
import StartView from "../views/StartView.vue";
import GameView from "../views/GameView.vue";
import EndView from "../views/EndView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "start", component: StartView },
    { path: "/game", name: "game", component: GameView },
    { path: "/end", name: "end", component: EndView },
  ],
});

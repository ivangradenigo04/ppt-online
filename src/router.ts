import { Router } from "@vaadin/router";
import { init as initHome } from "./pages/home";
import { init as initLogIn } from "./pages/log-in";
import { init as initNewGame } from "./pages/new-game";
import { init as initJoinGame } from "./pages/join-game";
import { init as initFullRoom } from "./pages/full-room";
import { init as initForeignRoom } from "./pages/foreign-room";
import { init as initRules } from "./pages/rules";
import { init as initWaitingOpponent } from "./pages/waiting-opponent";
import { init as initGame } from "./pages/game";
import { init as initResult } from "./pages/result";

export function init(root: HTMLElement | null) {
  initHome();
  initLogIn();
  initNewGame();
  initJoinGame();
  initFullRoom();
  initForeignRoom();
  initRules();
  initGame();
  initWaitingOpponent();
  initResult();
  const router = new Router(root);

  router.setRoutes([
    { path: "/", component: "login-page" },
    { path: "/home", component: "home-page" },
    { path: "/new-game", component: "new-game-page" },
    { path: "/join-game", component: "join-game-page" },
    { path: "/full-room", component: "full-room-page" },
    { path: "/not-exist", component: "foreign-room-page" },
    { path: "/rules", component: "rules-page" },
    { path: "/waiting-opponent", component: "waiting-opponent-page" },
    { path: "/game", component: "game-page" },
    { path: "/result", component: "result-page" },
  ]);
}

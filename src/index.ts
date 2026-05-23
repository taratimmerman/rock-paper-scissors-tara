import { Model } from "./model/model";
import { Controller } from "./controller/controller";

import ArenaView from "./views/arena/ArenaView";
import ControlsView from "./views/controls/ControlsView";
import GameView from "./views/game/GameView";
import MenuView from "./views/menu/MenuView";
import StatsView from "./views/stats/StatsView";
import StatusView from "./views/status/StatusView";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();

  const controller = new Controller(model, {
    arenaView: new ArenaView(),
    controlsView: new ControlsView(),
    gameView: new GameView(),
    menuView: new MenuView(),
    statsView: new StatsView(),
    statusView: new StatusView(),
  });

  controller.initialize();
});

import { Model } from "./model/model";
import { Controller } from "./controller/controller";

import AnnouncementView from "./views/announcement/AnnouncementView";
import ControlsView from "./views/controls/ControlsView";
import GameView from "./views/game/GameView";
import MenuView from "./views/menu/MenuView";
import MoveRevealView from "./views/moveReveal/MoveRevealView";
import ProgressView from "./views/progress/ProgressView";
import StatsView from "./views/stats/StatsView";
import StatusView from "./views/status/StatusView";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();

  const controller = new Controller(model, {
    announcementView: new AnnouncementView(),
    controlsView: new ControlsView(),
    gameView: new GameView(),
    menuView: new MenuView(),
    moveRevealView: new MoveRevealView(),
    progressView: new ProgressView(),
    statsView: new StatsView(),
    statusView: new StatusView(),
  });

  controller.initialize();
});

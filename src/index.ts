import { Model } from "./model/model";
import AnnouncementView from "./views/announcement/AnnouncementView";
import ControlsView from "./views/controls/ControlsView";
import MenuView from "./views/menu/MenuView";
import MoveRevealView from "./views/moveReveal/MoveRevealView";
import ProgressView from "./views/progress/ProgressView";
import statsView from "./views/stats/StatsView";
import StatusView from "./views/status/StatusView";
import { Controller } from "./controller/controller";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();

  const controller = new Controller(model, {
    announcementView: AnnouncementView,
    controlsView: ControlsView,
    menuView: MenuView,
    moveRevealView: MoveRevealView,
    progressView: ProgressView,
    statsView: statsView,
    statusView: StatusView,
  });

  controller.initialize();
});

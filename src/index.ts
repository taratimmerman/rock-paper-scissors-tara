import { Model } from "./model/model";
import StatusView from "./views/status/StatusView";
import MenuView from "./views/menu/MenuView";
import moveView from "./views/move/MoveView";
import MoveRevealView from "./views/moveReveal/MoveRevealView";
import OutcomeView from "./views/outcome/OutcomeView";
import ProgressView from "./views/progress/ProgressView";
import statsView from "./views/stats/StatsView";
import { Controller } from "./controller/controller";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();

  const controller = new Controller(model, {
    menuView: MenuView,
    moveView: moveView,
    moveRevealView: MoveRevealView,
    outcomeView: OutcomeView,
    progressView: ProgressView,
    statsView: statsView,
    statusView: StatusView,
  });

  controller.initialize();
});

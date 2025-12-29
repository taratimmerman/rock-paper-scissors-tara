import { Model } from "./model/model";
import MenuView from "./views/menu/MenuView";
import moveView from "./views/move/MoveView";
import OutcomeView from "./views/outcome/OutcomeView";
import ProgressView from "./views/progress/ProgressView";
import scoreView from "./views/score/ScoreView";
import statsView from "./views/stats/StatsView";
import { Controller } from "./controller/controller";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();

  const controller = new Controller(model, {
    menuView: MenuView,
    moveView: moveView,
    outcomeView: OutcomeView,
    progressView: ProgressView,
    scoreView: scoreView,
    statsView: statsView,
  });

  controller.initialize();
});

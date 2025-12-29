import { Model } from "./model/model";
import { ViewOld } from "./views/viewOld";
import moveView from "./views/move/MoveView";
import scoreView from "./views/score/ScoreView";
import statsView from "./views/stats/StatsView";
import { Controller } from "./controller/controller";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();
  const viewOld = new ViewOld();

  const controller = new Controller(model, {
    mainView: viewOld,
    moveView: moveView,
    scoreView: scoreView,
    statsView: statsView,
  });

  controller.initialize();
});

import { Model } from "./model/model";
import { ViewOld } from "./views/viewOld";
import MenuView from "./views/menu/MenuView";
import moveView from "./views/move/MoveView";
import OutcomeView from "./views/outcome/OutcomeView";
import scoreView from "./views/score/ScoreView";
import statsView from "./views/stats/StatsView";
import { Controller } from "./controller/controller";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();
  const viewOld = new ViewOld();

  const controller = new Controller(model, {
    mainView: viewOld,
    menuView: MenuView,
    moveView: moveView,
    outcomeView: OutcomeView,
    scoreView: scoreView,
    statsView: statsView,
  });

  controller.initialize();
});

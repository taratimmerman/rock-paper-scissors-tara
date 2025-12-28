import { Model } from "./model/model";
import { ViewOld } from "./views/viewOld";
import statsView from "./views/stats/StatsView";
import { Controller } from "./controller/controller";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();
  const viewOld = new ViewOld();

  const controller = new Controller(model, {
    mainView: viewOld,
    statsView: statsView,
  });

  controller.initialize();
});

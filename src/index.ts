import { Model } from "./model/model";
import { ViewOld } from "./views/viewOld";
import { Controller } from "./controller/controller";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();
  const view = new ViewOld();
  const controller = new Controller(model, view);

  controller.initialize();
});

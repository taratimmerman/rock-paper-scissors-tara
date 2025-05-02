import { Model } from "./model/model";
import { View } from "./view";
import { Controller } from "./controller/controller";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();
  const view = new View();
  const controller = new Controller(model, view);

  controller.initialize();
});

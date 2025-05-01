import { Model } from "./model";

describe("Model", () => {
  let model: Model;

  beforeEach(() => {
    model = new Model();
    localStorage.clear();
  });

  test("getScore returns 0 when no score is set", () => {
    expect(model.getScore("player")).toBe(0);
    expect(model.getScore("computer")).toBe(0);
  });

  test("setScore and getScore work together", () => {
    model.setScore("player", 5);
    model.setScore("computer", 3);

    expect(model.getScore("player")).toBe(5);
    expect(model.getScore("computer")).toBe(3);
  });
});

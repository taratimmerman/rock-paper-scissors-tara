/**
 * @jest-environment jsdom
 */
import StatusView from "./StatusView";

describe("StatusView", () => {
  let status: string;
  let view: StatusView;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="status-container"></div>
    `;

    status = "Choose your attack!";
    view = new StatusView();
  });

  it("should render the initial message correctly", () => {
    view.render({ message: status });

    const statusElement = document.querySelector("#status");
    expect(statusElement).not.toBeNull();
    expect(statusElement?.textContent).toBe(status);
  });

  it("should update only the textContent when setMessage is called", () => {
    const newStatus = "New Status";

    view.render({ message: status });

    const elementBefore = document.querySelector("#status");
    expect(elementBefore?.textContent).toBe(status);

    view.setMessage(newStatus);

    const elementAfter = document.querySelector("#status");
    expect(elementAfter?.textContent).toBe(newStatus);

    // Check that we didn't destroy and recreate the element (DOM stability)
    expect(elementBefore).toBe(elementAfter);
  });

  it("should maintain the message in internal state", () => {
    view.setMessage(status);

    expect((view as any)._data.message).toBe(status);
  });
});

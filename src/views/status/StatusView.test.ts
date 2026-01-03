/**
 * @jest-environment jsdom
 */
import StatusView from "./StatusView";

describe("StatusView", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="status-container"></div>
    `;
  });

  it("should render the initial message correctly", () => {
    const initialData = { message: "Prepare for battle!" };

    StatusView.render(initialData);

    const p = document.querySelector("#status");
    expect(p).not.toBeNull();
    expect(p?.textContent).toBe("Prepare for battle!");
  });

  it("should update only the textContent when setMessage is called", () => {
    StatusView.render({ message: "Initial" });
    const pBefore = document.querySelector("#status");

    StatusView.setMessage("New Status");

    const pAfter = document.querySelector("#status");
    expect(pAfter?.textContent).toBe("New Status");

    // Check that we didn't destroy and recreate the element (DOM stability)
    expect(pBefore).toBe(pAfter);
  });

  it("should maintain the message in internal state", () => {
    const msg = "Testing state";
    StatusView.setMessage(msg);

    expect((StatusView as any)._data.message).toBe(msg);
  });
});

/**
 * @jest-environment jsdom
 */
import AnnouncementView from "./AnnouncementView";

describe("AnnouncementView", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="announcement-container"></div>
    `;
  });

  it("should render the initial message correctly", () => {
    const initialData = { message: "Prepare for battle!" };

    AnnouncementView.render(initialData);

    const p = document.querySelector("#announcement");
    expect(p).not.toBeNull();
    expect(p?.textContent).toBe("Prepare for battle!");
  });

  it("should update only the textContent when setMessage is called", () => {
    AnnouncementView.render({ message: "Initial" });
    const pBefore = document.querySelector("#announcement");

    AnnouncementView.setMessage("New Announcement");

    const pAfter = document.querySelector("#announcement");
    expect(pAfter?.textContent).toBe("New Announcement");

    // Check that we didn't destroy and recreate the element (DOM stability)
    expect(pBefore).toBe(pAfter);
  });

  it("should maintain the message in internal state", () => {
    const msg = "Testing state";
    AnnouncementView.setMessage(msg);

    expect((AnnouncementView as any)._data.message).toBe(msg);
  });
});

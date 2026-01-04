/**
 * @jest-environment jsdom
 */
import AnnouncementView from "./AnnouncementView";

describe("AnnouncementView", () => {
  let view: AnnouncementView;
  let announcement: string;

  beforeEach(() => {
    document.body.innerHTML = `
      <h2 id="announcement-container"></h2>
    `;

    view = new AnnouncementView();
    announcement = "WIN!";
  });

  it("should render the initial message correctly", () => {
    const initialData = { message: announcement };

    view.render(initialData);

    const announcementElement = document.querySelector("#announcement");
    expect(announcementElement).not.toBeNull();
    expect(announcementElement?.textContent).toBe(announcement);
  });

  it("should update only the textContent when setMessage is called", () => {
    const newAnnouncement = "New Announcement!";

    view.render({ message: announcement });

    const announcementBefore = document.querySelector("#announcement");
    expect(announcementBefore?.textContent).toBe(announcement);

    view.setMessage(newAnnouncement);

    const announcementAfter = document.querySelector("#announcement");
    expect(announcementAfter?.textContent).toBe(newAnnouncement);

    // Check that we didn't destroy and recreate the element (DOM stability)
    expect(announcementBefore).toBe(announcementAfter);
  });

  it("should maintain the message in internal state", () => {
    view.setMessage(announcement);

    expect((view as any)._data.message).toBe(announcement);
  });
});

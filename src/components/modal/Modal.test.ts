/**
 * @jest-environment jsdom
 */
import Modal from "./Modal";

describe("Modal", () => {
  let modal: Modal;
  let dialog: HTMLDialogElement;

  beforeEach(() => {
    document.body.innerHTML = '<button id="opener">Open</button>';
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value() {
        this.setAttribute("open", "");
      },
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value() {
        this.removeAttribute("open");
      },
    });

    modal = new Modal();
    dialog = document.querySelector("dialog")!;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders accessible text safely and focuses the configured action", () => {
    const opener = document.getElementById("opener")!;
    opener.focus();

    modal.open({
      title: "<img src=x onerror=alert(1)>",
      message: "Plain text <b>only</b>",
      actions: [
        { id: "cancel", label: "Cancel", onSelect: jest.fn() },
        { id: "confirm", label: "Confirm", onSelect: jest.fn() },
      ],
      initialFocusActionId: "cancel",
    });

    expect(dialog.open).toBe(true);
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
    expect(dialog.querySelector("img, b")).toBeNull();
    expect(dialog.querySelector(".modal-title")?.textContent).toContain("<img");
    expect(document.activeElement).toBe(
      dialog.querySelector('[data-action-id="cancel"]'),
    );
  });

  test("invokes the selected callback and restores focus on close", () => {
    const opener = document.getElementById("opener")!;
    const onSelect = jest.fn();
    opener.focus();

    modal.open({
      title: "Confirm",
      message: "Continue?",
      actions: [{ id: "confirm", label: "Confirm", onSelect }],
    });

    (dialog.querySelector(".modal-action") as HTMLButtonElement).click();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(dialog.classList.contains("is-closing")).toBe(true);
    jest.runOnlyPendingTimers();
    expect(dialog.open).toBe(false);
    expect(document.activeElement).toBe(opener);
  });

  test("dismisses on Escape and backdrop clicks", () => {
    modal.open({ title: "Dialog", message: "Text", actions: [] });
    const cancelEvent = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(cancelEvent);
    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(dialog.classList.contains("is-closing")).toBe(true);
    jest.runOnlyPendingTimers();

    modal.open({ title: "Dialog", message: "Text", actions: [] });
    dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(dialog.classList.contains("is-closing")).toBe(true);
  });
});
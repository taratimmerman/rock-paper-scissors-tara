import { IModal, ModalOptions } from "./IModal";

const CLOSE_ANIMATION_MS = 180;
let nextModalId = 0;

export default class Modal implements IModal {
  private readonly dialog: HTMLDialogElement;
  private readonly titleId = `modal-title-${nextModalId++}`;
  private previousFocus: HTMLElement | null = null;
  private closeTimer?: number;

  constructor() {
    this.dialog = document.createElement("dialog");
    this.dialog.className = "modal";
    this.dialog.setAttribute("aria-labelledby", this.titleId);
    this.dialog.addEventListener("cancel", this.handleCancel);
    this.dialog.addEventListener("click", this.handleDialogClick);
    this.dialog.addEventListener("animationend", this.handleAnimationEnd);
    document.body.append(this.dialog);
  }

  public open(options: ModalOptions): void {
    if (this.dialog.open) this.finishClose();

    this.previousFocus = document.activeElement as HTMLElement | null;
    this.dialog.replaceChildren();

    const content = document.createElement("div");
    content.className = "modal-content";

    const title = document.createElement("h2");
    title.id = this.titleId;
    title.className = "modal-title";
    title.textContent = options.title;

    const message = document.createElement("p");
    message.className = "modal-message";
    message.textContent = options.message;
    message.id = `${this.titleId}-description`;
    this.dialog.setAttribute("aria-describedby", message.id);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn-secondary modal-close";
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => this.close());

    const header = document.createElement("div");
    header.className = "modal-header";
    header.append(title, closeButton);

    const actions = document.createElement("div");
    actions.className = "modal-actions";

    options.actions.forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `btn-${action.variant ?? "secondary"} modal-action`;
      button.textContent = action.label;
      button.dataset.actionId = action.id;
      button.addEventListener("click", () => {
        try {
          action.onSelect();
        } finally {
          this.close();
        }
      });
      actions.append(button);
    });

    content.append(header, message);
    if (options.content) content.append(options.content);
    content.append(actions);
    this.dialog.append(content);
    this.dialog.showModal();
    this.dialog.classList.remove("is-closing");
    this.dialog.classList.add("is-open");

    const actionButtons = Array.from(
      actions.querySelectorAll<HTMLButtonElement>("button"),
    );
    const initialFocus = options.initialFocusActionId
      ? actionButtons.find(
          (button) => button.dataset.actionId === options.initialFocusActionId,
        )
      : actionButtons[0];
    (options.initialFocusElement ?? initialFocus ?? closeButton).focus();
  }

  public close(): void {
    if (!this.dialog.open || this.dialog.classList.contains("is-closing")) {
      return;
    }

    this.dialog.classList.remove("is-open");
    this.dialog.classList.add("is-closing");
    this.closeTimer = window.setTimeout(this.finishClose, CLOSE_ANIMATION_MS);
  }

  private handleCancel = (event: Event): void => {
    event.preventDefault();
    this.close();
  };

  private handleDialogClick = (event: MouseEvent): void => {
    if (event.target === this.dialog) this.close();
  };

  private handleAnimationEnd = (event: AnimationEvent): void => {
    if (
      event.target === this.dialog &&
      this.dialog.classList.contains("is-closing")
    ) {
      this.finishClose();
    }
  };

  private finishClose = (): void => {
    if (this.closeTimer !== undefined) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }

    if (this.dialog.open) this.dialog.close();
    this.dialog.classList.remove("is-open", "is-closing");

    if (this.previousFocus?.isConnected) this.previousFocus.focus();
    this.previousFocus = null;
  };
}

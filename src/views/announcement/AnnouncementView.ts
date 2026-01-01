import View from "../View";
import { IAnnouncementView, AnnouncementViewData } from "./IAnnouncementView";

class AnnouncementView
  extends View<AnnouncementViewData>
  implements IAnnouncementView
{
  protected declare _parentElement: HTMLElement;
  private _messageElement: HTMLElement | null = null;

  public render(data: AnnouncementViewData): void {
    this._parentElement = this._getElement<HTMLElement>(
      "announcement-container"
    );
    super.render(data);
    // Cache the element right after rendering
    this._messageElement = this._parentElement.querySelector("#announcement");
  }

  protected _generateMarkup(): string {
    return `<p id="announcement">${this._data.message}</p>`;
  }

  public setMessage(message: string): void {
    this._data = { message };
    if (this._messageElement) {
      this._messageElement.textContent = message;
    } else {
      // Fallback in case setMessage is called before render
      const el = document.getElementById("announcement");
      if (el) el.textContent = message;
    }
  }
}

export default new AnnouncementView();

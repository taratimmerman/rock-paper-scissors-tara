import View from "../View";
import { IStatusView, StatusViewData } from "./IStatusView";

export default class StatusView
  extends View<StatusViewData>
  implements IStatusView
{
  protected declare _parentElement: HTMLElement;
  private _messageElement: HTMLElement | null = null;

  public render(data: StatusViewData): void {
    this._parentElement = this._getElement<HTMLElement>("status-container");
    super.render(data);
    // Cache the element right after rendering
    this._messageElement = this._parentElement.querySelector("#status");
  }

  protected _generateMarkup(): string {
    return `<p id="status">${this._data.message}</p>`;
  }

  public setMessage(message: string): void {
    this._data = { message };
    if (this._messageElement) {
      this._messageElement.textContent = message;
    } else {
      // Fallback in case setMessage is called before render
      const el = document.getElementById("status");
      if (el) el.textContent = message;
    }
  }
}

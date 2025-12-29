import View from "../View";
import { IMenuView } from "./IMenuView";

class MenuView extends View<void> implements IMenuView {
  protected declare _parentElement: HTMLElement;

  // ===== General Methods =====

  protected _generateMarkup(): string {
    // Intentional: Returning empty because HTML exists in index.html
    return ``;
  }
}

export default new MenuView();

import View from "../View";
import { IMoveView } from "./IMoveView";

class MoveView extends View implements IMoveView {
  protected declare _parentElement: HTMLElement;

  // ===== General Methods =====

  protected _generateMarkup(): string {
    // Intentional: Returning empty because HTML exists in index.html
    return ``;
  }
}

export default new MoveView();

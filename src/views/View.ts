export default abstract class View<T = any> {
  protected _data!: T;
  protected _parentElement!: HTMLElement;

  /**
   * Standard render method used by all views.
   *
   * @param data The state/data needed for the UI render.
   */
  public render(data: T): void {
    if (!data) return;
    this._data = data;

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Patches the DOM by comparing new markup to current nodes.
   *
   * @note Requires `_generateMarkup()` to return a single root element.
   * @note Best for data updates (health/scores); use `render()` if the
   * number of elements or the DOM structure changes.
   *
   * @param data The state/data needed for the UI update.
   */
  public update(data: T): void {
    this._data = data;

    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll("*")
    );

    newElements.forEach((newElement, i) => {
      const currentElement = currentElements[i];

      // 1. Update changed TEXT
      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue?.trim() !== "" &&
        newElement.firstChild?.nodeValue?.trim() !== undefined
      ) {
        currentElement.textContent = newElement.textContent;
      }

      // 2. Update changed ATTRIBUTES
      if (!newElement.isEqualNode(currentElement)) {
        // Add or update attributes from new to current
        Array.from(newElement.attributes).forEach((attr) =>
          currentElement.setAttribute(attr.name, attr.value)
        );

        // Remove attributes from current that aren't in new
        Array.from(currentElement.attributes).forEach((attr) => {
          if (!newElement.hasAttribute(attr.name)) {
            currentElement.removeAttribute(attr.name);
          }
        });
      }
    });
  }

  protected _clear(): void {
    this._parentElement.innerHTML = "";
  }

  /**
   * Generates the HTML string for the view.
   *
   * @note Must return a single root element string to support DOM diffing with `update()`.
   * @returns {string} The HTML markup.
   */
  protected abstract _generateMarkup(): string;

  protected _getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element #${id} not found.`);
    return element as T;
  }

  protected _toggleVisibility(element: HTMLElement, show: boolean): void {
    element.classList.toggle("hidden", !show);
  }
}

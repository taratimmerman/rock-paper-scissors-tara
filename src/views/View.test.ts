import View from "./View";

class MockView extends View<{ title: string }> {
  constructor(el: HTMLElement) {
    super();
    this._parentElement = el;
  }

  // Implementation required by the abstract parent
  protected _generateMarkup(): string {
    return `<h1>${this._data.title}</h1>`;
  }

  // Public wrapper for testing the protected parent method
  public testToggle(el: HTMLElement, show: boolean) {
    this._toggleVisibility(el, show);
  }
}

describe("View Base Class", () => {
  let parentElement: HTMLElement;
  let view: MockView;

  beforeEach(() => {
    // Setup a fresh DOM for every test
    document.body.innerHTML = '<div id="container"></div>';
    parentElement = document.getElementById("container")!;
    view = new MockView(parentElement);
  });

  test("render() should inject generated markup into the DOM", () => {
    view.render({ title: "Test Title" });

    expect(parentElement.innerHTML).toBe("<h1>Test Title</h1>");
  });

  test("_clear() should empty the parent element", () => {
    parentElement.innerHTML = "<span>Old Content</span>";

    // We can cast to 'any' to test protected methods in isolation
    (view as any)._clear();

    expect(parentElement.innerHTML).toBe("");
  });

  test("_getElement() should return an element or throw error", () => {
    // Test success
    const el = (view as any)._getElement("container");
    expect(el).toBe(parentElement);

    // Test failure
    expect(() => (view as any)._getElement("non-existent")).toThrow(
      "Element #non-existent not found."
    );
  });

  test('_toggleVisibility() should add "hidden" class when show is false', () => {
    // Start with the element visible (no class)
    view.testToggle(parentElement, false);

    expect(parentElement.classList.contains("hidden")).toBe(true);
  });

  test('_toggleVisibility() should remove "hidden" class when show is true', () => {
    // Start with the element hidden
    parentElement.classList.add("hidden");

    view.testToggle(parentElement, true);

    expect(parentElement.classList.contains("hidden")).toBe(false);
  });

  test("_toggleVisibility() should work correctly if called multiple times (idempotency)", () => {
    view.testToggle(parentElement, false);
    view.testToggle(parentElement, false); // Toggle again

    expect(parentElement.classList.contains("hidden")).toBe(true);

    view.testToggle(parentElement, true);
    expect(parentElement.classList.contains("hidden")).toBe(false);
  });

  test("update() should change text content without replacing the whole element", () => {
    // Initial render
    view.render({ title: "Initial" });
    const originalH1 = parentElement.querySelector("h1");

    // Update data
    view.update({ title: "Updated" });
    const updatedH1 = parentElement.querySelector("h1");

    // The text changed...
    expect(updatedH1?.textContent).toBe("Updated");
    // ...BUT the reference is the same (the DOM node wasn't recreated)
    expect(originalH1).toBe(updatedH1);
  });

  test("update() should update attributes like classes", () => {
    // Custom mock that generates a class based on data
    class AttributeView extends View<{ active: boolean }> {
      protected _generateMarkup() {
        return `<div class="${
          this._data.active ? "active" : "inactive"
        }"></div>`;
      }
    }

    const attrView = new AttributeView();
    // @ts-ignore - reaching into protected for test
    attrView._parentElement = parentElement;

    attrView.render({ active: false });
    const div = parentElement.querySelector("div")!;
    expect(div.classList.contains("inactive")).toBe(true);

    attrView.update({ active: true });
    expect(div.classList.contains("active")).toBe(true);
    expect(div.classList.contains("inactive")).toBe(false);
  });
});

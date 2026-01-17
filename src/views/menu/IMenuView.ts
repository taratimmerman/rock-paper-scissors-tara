export interface MenuViewData {
  isMatchActive: boolean;
}

export interface IMenuView {
  render(data: MenuViewData): void;
  bindStartMatch(handler: () => void): void;
  bindResetGame(handler: () => void): void;
  toggleMenuVisibility(show: boolean): void;
  updateMenu(data: Partial<MenuViewData>): void;
}

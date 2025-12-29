export interface MenuViewData {
  isMatchActive: boolean;
}

export interface IMenuView {
  render(data: MenuViewData): void;
  updateMenu(data: Partial<MenuViewData>): void;
  bindStartMatch(handler: () => void): void;
  bindResetGame(handler: () => void): void;
  toggleMenuVisibility(show: boolean): void;
}

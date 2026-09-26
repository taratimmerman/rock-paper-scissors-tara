import { ThemePreference } from "../../storage/gameStorage";

export interface MenuViewData {
  isMatchActive: boolean;
  hasDataToReset: boolean;
  themePreference: ThemePreference;
}

export interface IMenuView {
  render(data: MenuViewData): void;
  bindStartMatch(handler: () => void): void;
  bindResetGame(handler: () => void): void;
  bindSettings(handler: () => void): void;
  bindThemePreference(handler: (theme: ThemePreference) => void): void;
  openSettings(): void;
  updateThemePreference(theme: ThemePreference): void;
  toggleMenuVisibility(show: boolean): void;
  updateMenu(data: Partial<MenuViewData>): void;
}

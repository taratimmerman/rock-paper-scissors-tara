export interface ProgressData {
  matchNumber: number;
  roundNumber: number;
  isVisible: boolean;
}

export interface IProgressView {
  render(data: ProgressData): void;
  update(data: ProgressData): void;
}

export interface StatusViewData {
  message: string;
}

export interface IStatusView {
  render(data: StatusViewData): void;
  setMessage(message: string): void;
}

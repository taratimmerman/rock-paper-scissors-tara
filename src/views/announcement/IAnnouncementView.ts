export interface AnnouncementViewData {
  message: string;
}

export interface IAnnouncementView {
  render(data: AnnouncementViewData): void;
  setMessage(message: string): void;
}

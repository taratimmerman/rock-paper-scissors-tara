export type ModalActionVariant = "primary" | "secondary" | "danger";

export interface ModalAction {
  id: string;
  label: string;
  onSelect: () => void;
  variant?: ModalActionVariant;
}

export interface ModalOptions {
  title: string;
  message: string;
  actions: ModalAction[];
  initialFocusActionId?: string;
  content?: HTMLElement;
  initialFocusElement?: HTMLElement;
}

export interface IModal {
  open(options: ModalOptions): void;
  close(): void;
}

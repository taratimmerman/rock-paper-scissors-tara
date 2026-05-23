import { Move, Participant } from "../../utils/dataObjectUtils";

export type ArenaPhase = "waiting" | "revealing" | "combat" | "result";

export interface ArenaViewData {
  phase: ArenaPhase;
  playerMoveId?: Move | null;
  computerMoveId?: Move | null;
  winner?: Participant | "tie" | null;
  isDoubleKO?: boolean;
  announcementMessage?: string;
}

export interface IArenaView {
  render(data: ArenaViewData): void;
  update(data: ArenaViewData): void;
  playRoundSequence(data: ArenaViewData): Promise<void>;
  clear(): void;
}

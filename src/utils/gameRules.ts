import { Move } from "../utils/dataObjectUtils";
import { ALL_MOVE_NAMES, STANDARD_MOVE_NAMES } from "../utils/dataUtils";

export function getAvailableMoves(hasTara: boolean): Move[] {
  if (hasTara) {
    return ALL_MOVE_NAMES;
  } else {
    return STANDARD_MOVE_NAMES;
  }
}

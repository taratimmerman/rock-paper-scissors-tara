import { Page } from "@playwright/test";
import {
  Match,
  MoveCount,
  Participant,
  StandardMove,
} from "../../src/utils/dataObjectUtils";

// 1. Define the optional seeding interfaces
export interface ParticipantSeed {
  score?: number;
  taraCount?: number;
  mostCommonMove?: StandardMove;
  moveCounts?: MoveCount;
}

export interface GameStateSeed {
  globalMatchNumber?: number;
  currentMatch?: Match;
  participants?: Partial<Record<Participant, ParticipantSeed>>;
}

/**
 * 2. The utility function to inject state into localStorage.
 * This runs inside the browser context, so all logic must be self-contained.
 */
export async function seedStorage(
  page: Page,
  seedData: GameStateSeed,
): Promise<void> {
  await page.evaluate((data) => {
    // Clear existing storage to guarantee a clean slate
    localStorage.clear();

    // Set Globals
    if (data.globalMatchNumber !== undefined) {
      localStorage.setItem(
        "globalMatchNumber",
        data.globalMatchNumber.toString(),
      );
    }

    if (data.currentMatch) {
      localStorage.setItem("currentMatch", JSON.stringify(data.currentMatch));
    }

    // Set Participant-specific stats based on LocalStorageGameStorage keys
    if (data.participants) {
      for (const [participant, stats] of Object.entries(data.participants)) {
        if (stats.score !== undefined) {
          localStorage.setItem(`${participant}Score`, stats.score.toString());
        }
        if (stats.taraCount !== undefined) {
          localStorage.setItem(
            `${participant}TaraCount`,
            stats.taraCount.toString(),
          );
        }
        if (stats.mostCommonMove) {
          localStorage.setItem(
            `${participant}MostCommonMove`,
            stats.mostCommonMove,
          );
        }
        if (stats.moveCounts) {
          localStorage.setItem(
            `${participant}MoveCounts`,
            JSON.stringify(stats.moveCounts),
          );
        }
      }
    }
  }, seedData);

  // 3. Reload the page so the MVC Model constructor picks up the new localStorage values
  await page.reload();
}

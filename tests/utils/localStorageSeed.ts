// tests/utils/storageSeed.ts
import { Page } from "@playwright/test";
import { Move, Progress, Stats } from "../models/GamePage";

export interface SeedPayload {
  progress?: Partial<Progress>;
  playerStats?: Partial<Stats>;
  computerStats?: Partial<Stats>;
}

/**
 * Main action called by the Playwright fixture.
 */
export async function seedStorage(
  page: Page,
  payload: SeedPayload,
): Promise<void> {
  // 1. Build the exact key/value dictionary in Node.js
  const storageDictionary = buildStorageDictionary(payload);

  // 2. Inject the flat dictionary into the browser's localStorage
  await page.evaluate((dictionary) => {
    localStorage.clear();
    for (const [key, value] of Object.entries(dictionary)) {
      localStorage.setItem(key, value);
    }
  }, storageDictionary);

  // 3. Reload to hydrate the app
  await page.reload();
}

/**
 * Translates UI test models into the raw flat keys the application expects.
 */
function buildStorageDictionary(payload: SeedPayload): Record<string, string> {
  const dictionary: Record<string, string> = {};

  // --- Map Global Progress ---
  if (payload.progress?.match !== undefined) {
    dictionary.globalMatchNumber = payload.progress.match.toString();
  }

  // --- Map Current Match (Shared state) ---
  const currentMatch: Record<string, number> = {};
  if (payload.progress?.round !== undefined)
    currentMatch.matchRoundNumber = payload.progress.round;
  if (payload.playerStats?.health !== undefined)
    currentMatch.playerHealth = payload.playerStats.health;
  if (payload.computerStats?.health !== undefined)
    currentMatch.computerHealth = payload.computerStats.health;

  if (Object.keys(currentMatch).length > 0) {
    dictionary.currentMatch = JSON.stringify(currentMatch);
  }

  // --- Map Participant Stats ---
  const mapParticipant = (
    prefix: "player" | "computer",
    stats: Partial<Stats>,
  ) => {
    if (stats.wins !== undefined) {
      dictionary[`${prefix}Score`] = stats.wins.toString();
    }
    if (stats.availableTaraMoves !== undefined) {
      dictionary[`${prefix}TaraCount`] = stats.availableTaraMoves.toString();
    }
    if (stats.commonMove) {
      dictionary[`${prefix}MostCommonMove`] = stats.commonMove;
      dictionary[`${prefix}MoveCounts`] = JSON.stringify(
        generateMockMoveCounts(stats.commonMove),
      );
    }
  };

  if (payload.playerStats) mapParticipant("player", payload.playerStats);
  if (payload.computerStats) mapParticipant("computer", payload.computerStats);

  return dictionary;
}

/**
 * Synthesizes the required move counts object to justify the provided "commonMove".
 */
function generateMockMoveCounts(commonMove: Move): Record<string, number> {
  const counts = { rock: 0, paper: 0, scissors: 0 };

  if (commonMove !== Move.TARA) {
    // Assign an arbitrary high number so the app correctly calculates it as the most common
    counts[commonMove as keyof typeof counts] = 5;
  }

  return counts;
}

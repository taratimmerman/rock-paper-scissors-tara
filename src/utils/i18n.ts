import enDictionary from "../locales/en.json";

export type TranslationKey = keyof typeof enDictionary;

/**
 * Translates a key from the dictionary and optionally substitutes variables.
 *
 * ## Variable Substitution
 * Variables in templates use double curly braces: `{{variableName}}`
 *
 * If a variable is provided in the `variables` map, it replaces the placeholder.
 * If a variable is undefined, it falls back to showing the literal placeholder
 * (e.g., `"{{unknownVar}"` remains in the output). This prevents broken UI when
 * data is missing while making the gap obvious during development.
 *
 * @param key - The translation key from the dictionary
 * @param variables - Optional record of variable names and their string/number values
 * @returns The translated string with variables substituted
 *
 * @example
 * t("status_ready") // "Get ready..."
 * t("status_roundResult", { playerMove: "Rock", computerMove: "Paper" })
 * // "You played Rock. Computer played Paper."
 */
export function t(
  key: TranslationKey,
  variables?: Record<string, string | number>,
): string {
  const template = enDictionary[key];

  if (!variables) {
    return template;
  }

  return template.replace(
    /\{\{(\w+)\}\}/g,
    (match: string, varName: string) => {
      return String(variables[varName] ?? match);
    },
  );
}

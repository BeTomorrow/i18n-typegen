/**
 * Find all interpolation inside the double bracket.
 * Support i18n-js format {{value}} and %{value}
 * "Hello {{firstname}} *{familyName}" will return ["firstname", "familyName"]
 */
export const findInterpolations = (translation: string) => {
  const doubleBraceRegexp = /{{(.*?)}}/g;
  const percentBraceRegexp = /%{(.*?)}/g;
  const matches: string[] = [];
  let match;

  while ((match = doubleBraceRegexp.exec(translation)) !== null) {
    matches.push(match[1]);
  }
  while ((match = percentBraceRegexp.exec(translation)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

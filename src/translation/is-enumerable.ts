/**
 * Support i18n-js plurialize format
 * Support only Zero, One and Other plural form
 * Translations keys ends with .one, .zero and .other
 */
export const isEnumerable = (key: string) =>
  [".one", ".zero", ".other"].some((enumeration) => key.endsWith(enumeration));

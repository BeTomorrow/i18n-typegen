import { TranslationEntry } from "../translation/generate-template-data";
import { intersection } from "../translation/set";

export type AddPlaceholderTransformer = {
  addPlaceholder: {
    name: string;
    type: string[];
  };
};
export type RemoveKeyPartTransformer = { removeLastPart: true };
export type AddMatchedPlaceholderTransformer = {
  addMatchedPlaceholder: {
    type: string[];
  };
};

export function applyAddPlaceholderTransformer(
  transformer: AddPlaceholderTransformer,
  entry: TranslationEntry
): TranslationEntry {
  const previousType = new Set(entry.interpolations.get(transformer.addPlaceholder.name) ?? []);
  const placeholderType = new Set(transformer.addPlaceholder.type);
  const intersectType =
    previousType.size > 0 ? intersection(previousType, placeholderType) : placeholderType;
  entry.interpolations.set(transformer.addPlaceholder.name, Array.from(intersectType));
  return entry;
}

export function applyAddMatchedPlaceholderTransformer(
  transformer: AddMatchedPlaceholderTransformer,
  placeholder: string,
  entry: TranslationEntry
): TranslationEntry {
  const previousType = new Set(entry.interpolations.get(placeholder) ?? []);
  const placeholderType = new Set(transformer.addMatchedPlaceholder.type);
  const intersectType =
    previousType.size > 0 ? intersection(previousType, placeholderType) : placeholderType;
  entry.interpolations.set(placeholder, Array.from(intersectType));
  return entry;
}

export function applyRemoveLastPartTransformer(
  transformer: RemoveKeyPartTransformer,
  entry: TranslationEntry
): TranslationEntry {
  if (transformer.removeLastPart) {
    return { ...entry, key: removeLastPart(entry.key) };
  }
  return entry;
}

const removeLastPart = (key: string, delimiter = ".") =>
  key.split(delimiter).slice(0, -1).join(delimiter);

import { TranslationEntry } from "../translation/generate-template-data";

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
  const previousType =
    entry.interpolations.get(transformer.addPlaceholder.name) ?? [];
  entry.interpolations.set(
    transformer.addPlaceholder.name,
    previousType.concat(transformer.addPlaceholder.type)
  );
  return entry;
}

export function applyAddMatchedPlaceholderTransformer(
  transformer: AddMatchedPlaceholderTransformer,
  placeholder: string,
  entry: TranslationEntry
): TranslationEntry {
  const previousType = entry.interpolations.get(placeholder) ?? [];
  entry.interpolations.set(
    placeholder,
    previousType.concat(transformer.addMatchedPlaceholder.type)
  );
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

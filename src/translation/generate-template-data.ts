import { Configuration } from "../config/config-loader";
import { applyKeyEndsWithRule, isKeyRule } from "../rules/key";
import { applyTranslationMatchRule, isTranslationRule } from "../rules/translation";
import {
  InterpolationTypeTemplateData,
  TranslationEntryTemplateData,
} from "../templates/template-type";

type TranslationKey = string;
type Translation = string;

export interface TranslationEntry {
  key: TranslationKey;
  translation: string;
  interpolations: Map<string, InterpolationType[]>;
}

export type InterpolationType = string;

function createEntry(item: { key: string; translation: string }): TranslationEntry {
  return {
    key: item.key,
    translation: item.translation,
    interpolations: new Map(),
  };
}
export function generateTemplateData(
  translations: Record<TranslationKey, Translation>,
  configuration: Configuration
): TranslationEntryTemplateData[] {
  const entries: TranslationEntry[] = [];

  (Object.entries(translations) as [TranslationKey, Translation][]).forEach(
    ([key, translation]) => {
      const entry = processTranslation(createEntry({ key, translation }), configuration);
      entries.push(entry);
    }
  );
  return toTemplateData(entries);
}

function toTemplateData(entries: TranslationEntry[]): TranslationEntryTemplateData[] {
  const entryMap = new Map<string, TranslationEntryTemplateData>();

  for (const entry of entries) {
    // Retrieve or initialize the interpolations for the current entry key
    let interpolations = entryMap.get(entry.key)?.interpolations ?? [];

    // Add new interpolations from the entry
    for (const [name, types] of entry.interpolations) {
      const existingInterpolation = interpolations.find((interpol) => interpol.name === name);

      if (existingInterpolation) {
        // Merge types if the interpolation already exists
        existingInterpolation.type = mergeUniqueTypes(existingInterpolation.type, types);
      } else {
        // Add new interpolation
        interpolations.push({
          name,
          type: types.map((t) => ({ value: t })),
        });
      }
    }

    // Update the entry map
    entryMap.set(entry.key, { key: entry.key, interpolations });
  }

  // Set the `last` property
  for (const entry of entryMap.values()) {
    const lastInterpolationIndex = entry.interpolations.length - 1;
    if (lastInterpolationIndex >= 0) {
      entry.interpolations[lastInterpolationIndex].last = true;
    }

    for (const interpolation of entry.interpolations) {
      const lastTypeIndex = interpolation.type.length - 1;
      if (lastTypeIndex >= 0) {
        interpolation.type[lastTypeIndex].last = true;
      }
    }
  }

  return Array.from(entryMap.values());
}

function mergeUniqueTypes(
  existingTypes: InterpolationTypeTemplateData[],
  newTypes: string[]
): InterpolationTypeTemplateData[] {
  const existingTypeValues = new Set(existingTypes.map((t) => t.value));
  for (const newType of newTypes) {
    if (!existingTypeValues.has(newType)) {
      existingTypes.push({ value: newType });
    }
  }
  return existingTypes;
}

function processTranslation(
  entry: TranslationEntry,
  configuration: Configuration
): TranslationEntry {
  let result = entry;

  // Apply key rules first
  const sortedRules = configuration.rules.sort((a, b) => {
    if (isKeyRule(a) && !isKeyRule(b)) {
      return -1;
    }
    if (isKeyRule(b) && !isKeyRule(a)) {
      return 1;
    }
    return 0;
  });

  for (const rule of sortedRules) {
    if (isKeyRule(rule)) {
      result = applyKeyEndsWithRule(rule, result);
    }
    if (isTranslationRule(rule)) {
      result = applyTranslationMatchRule(rule, result);
    }
  }

  return result;
}

import { WordingEntryTemplateData } from "../templates/template-type";
import { findInterpolations } from "./find-interpolation";
import { isEnumerable } from "./is-enumerable";

type WordingKey = string;
type Translation = string;

interface WordingEntry {
  key: WordingKey;
  interpolations: Map<string, InterpolationType>;
}

interface GeneratorConfiguration {
  detectPlurial: boolean;
  detectInterpolation: boolean;
}

type InterpolationType = "string" | "number";

const defaultConfiguration = {
  detectPlurial: true,
  detectInterpolation: true,
};

export function generateTemplateData(
  translations: Record<WordingKey, Translation>,
  overwriteConfiguration: Partial<GeneratorConfiguration> = {}
): WordingEntryTemplateData[] {
  const config = { ...defaultConfiguration, ...overwriteConfiguration };
  const entries: Map<WordingKey, WordingEntry> = new Map();

  (Object.entries(translations) as [WordingKey, Translation][]).forEach(
    ([key, translation]) => {
      const entry = processTranslation(key, translation, entries, config);
      entries.set(entry.key, entry);
    }
  );
  return mapToTemplateData(entries);
}

function mapToTemplateData(
  entries: Map<string, WordingEntry>
): WordingEntryTemplateData[] {
  return Array.from(entries.values()).map((it) => ({
    key: it.key,
    interpolations: Array.from(it.interpolations.entries()).map(
      ([name, type]) => ({ name, type })
    ),
  }));
}

function processTranslation(
  key: string,
  translation: string,
  entries: Map<string, WordingEntry>,
  configuration: GeneratorConfiguration
): WordingEntry {
  const { detectPlurial, detectInterpolation } = configuration;

  const interpolationsNames = findInterpolations(translation);
  const interpolations = detectInterpolation
    ? new Map<string, InterpolationType>(
        interpolationsNames.map((name) => [name, "string"])
      )
    : new Map();

  if (detectPlurial && isEnumerable(key)) {
    const shrunkKey = removeLastPart(key);
    interpolations.set("count", "number");

    if (entries.has(shrunkKey)) {
      // If the entry already exists, merge interpolations
      const existingEntry = entries.get(shrunkKey)!;
      return {
        key: shrunkKey,
        interpolations: mergeInterpolations(
          existingEntry.interpolations,
          interpolations
        ),
      };
    } else {
      return { key: shrunkKey, interpolations };
    }
  }
  return { key, interpolations };
}

const removeLastPart = (key: WordingKey, delimiter = ".") =>
  key.split(delimiter).slice(0, -1).join(delimiter);

function mergeInterpolations(
  existingInterpolations: Map<string, InterpolationType>,
  newInterpolations: Map<string, InterpolationType>
): Map<string, InterpolationType> {
  const mergedInterpolations = new Map([...existingInterpolations]);

  newInterpolations.forEach((type, name) => {
    if (!mergedInterpolations.has(name)) {
      mergedInterpolations.set(name, type);
    }
  });

  return mergedInterpolations;
}

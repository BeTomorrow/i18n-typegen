import { findInterpolations } from "./find-interpolation";
import { isEnumerable } from "./is-enumerable";

type WordingKey = string;
type Translation = string;

interface InterpolationTemplateData {
  name: string;
  type: "string" | "number";
}
interface WordingEntryTemplateData {
  key: WordingKey;
  interpolations: InterpolationTemplateData[];
}

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
  const configuration = { ...defaultConfiguration, ...overwriteConfiguration };
  const entries: Map<WordingKey, WordingEntry> = new Map();
  (Object.entries(translations) as [WordingKey, Translation][]).forEach(
    ([key, translation]) => {
      const wordingEntry = processTranslation(
        key,
        translation,
        entries,
        configuration
      );
      entries.set(wordingEntry.key, wordingEntry);
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
  const interpolationsMappedType = new Map<string, InterpolationType>(
    interpolationsNames.map((it) => [it, "string"])
  );

  if (detectPlurial && isEnumerable(key)) {
    const shrunkKey = removeLastPart(key);
    interpolationsMappedType.set("count", "number");

    if (entries.has(shrunkKey)) {
      // If the entry for the shrunk key already exists, merge interpolations
      const existingEntry = entries.get(shrunkKey)!;
      return createWordingEntry(
        shrunkKey,
        mergeInterpolations(
          existingEntry.interpolations,
          interpolationsMappedType
        )
      );
    } else {
      return createWordingEntry(shrunkKey, interpolationsMappedType);
    }
  }
  if (detectInterpolation) {
    return createWordingEntry(key, interpolationsMappedType);
  }
  return createWordingEntry(key, new Map());
}

const removeLastPart = (key: WordingKey, delimiter = ".") =>
  key.split(delimiter).slice(0, -1).join(delimiter);

function createWordingEntry(
  key: WordingKey,
  interpolationTypes: Map<string, InterpolationType>
): WordingEntry {
  return {
    key,
    interpolations: interpolationTypes,
  };
}

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

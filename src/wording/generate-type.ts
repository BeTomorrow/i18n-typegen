import { findInterpolations } from "./find-interpolation";
import { isEnumerable } from "./is-enumerable";

interface Interpolation {
  name: string;
  type: "string" | "number";
}
interface WordingEntry {
  key: string;
  interpolations: Interpolation[];
}

interface GeneratorConfiguration {
  detectPlurial: boolean;
  detectInterpolation: boolean;
}

type WordingKey = string;
type Translation = string;

type InterpolationType = "string" | "number";

const defaultConfiguration = {
  detectPlurial: true,
  detectInterpolation: true,
};

export function generateType(
  translations: Record<WordingKey, Translation>,
  configuration: GeneratorConfiguration = defaultConfiguration
): WordingEntry[] {
  const entries: Map<WordingKey, WordingEntry> = new Map();
  (Object.entries(translations) as [WordingKey, Translation][]).forEach(
    ([key, translation]) => {
      const wordingEntry = processTranslation(key, translation, configuration);
      entries.set(wordingEntry.key, wordingEntry);
    }
  );
  return Array.from(entries.values());
}

function processTranslation(
  key: string,
  translation: string,
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
    return createWordingEntry(shrunkKey, interpolationsMappedType);
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
    interpolations: Array.from(interpolationTypes).map(([name, type]) => ({
      name,
      type,
    })),
  };
}

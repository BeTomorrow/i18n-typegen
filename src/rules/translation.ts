import { Rule } from "../config/config-loader";
import { TranslationEntry } from "../translation/generate-template-data";
import {
  AddMatchedPlaceholderTransformer,
  AddPlaceholderTransformer,
  applyAddMatchedPlaceholderTransformer,
  applyAddPlaceholderTransformer,
} from "./transformer";

type TranslationMatchCondition = {
  placeholderPattern: {
    prefix: string;
    suffix: string;
  };
};

export type TranslationMatchRule = {
  condition: TranslationMatchCondition;
  transformer: AddMatchedPlaceholderTransformer | AddPlaceholderTransformer;
};

export function isTranslationRule(rule: Rule): rule is TranslationMatchRule {
  return "placeholderPattern" in rule.condition;
}

export function applyTranslationMatchRule(
  rule: TranslationMatchRule,
  entry: TranslationEntry
): TranslationEntry {
  let result = entry;
  const { prefix, suffix } = rule.condition.placeholderPattern;
  const regexp = new RegExp(`${prefix}(.*?)${suffix}`, "g");

  const matches: string[] = [];
  let match;
  while ((match = regexp.exec(entry.translation)) !== null) {
    matches.push(match[1]);
  }

  if ("addMatchedPlaceholder" in rule.transformer) {
    const transformer = rule.transformer;
    matches.forEach((placeholder) => {
      result = applyAddMatchedPlaceholderTransformer(
        transformer,
        placeholder,
        result
      );
    });
  }
  if ("addPlaceholder" in rule.transformer) {
    result = applyAddPlaceholderTransformer(rule.transformer, result);
  }
  return result;
}

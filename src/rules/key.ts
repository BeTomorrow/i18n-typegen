import { Rule } from "../config/config-loader";
import { TranslationEntry } from "../translation/generate-template-data";
import {
  AddPlaceholderTransformer,
  RemoveKeyPartTransformer,
  applyAddPlaceholderTransformer,
  applyRemoveLastPartTransformer,
} from "./transformer";

type KeyEndsWithCondition = { keyEndsWith: string[] };

export type KeyEndsWithRule = {
  condition: KeyEndsWithCondition;
  transformer: AddPlaceholderTransformer | RemoveKeyPartTransformer;
};

export function isKeyRule(rule: Rule): rule is KeyEndsWithRule {
  return "keyEndsWith" in rule.condition;
}

export function applyKeyEndsWithRule(
  rule: KeyEndsWithRule,
  entry: TranslationEntry
): TranslationEntry {
  const { key } = entry;
  let result = entry;
  const match = rule.condition.keyEndsWith.some((endingPart) => key.endsWith(`.${endingPart}`));
  if (match) {
    if ("removeLastPart" in rule.transformer) {
      result = applyRemoveLastPartTransformer(rule.transformer, result);
    }
    if ("addPlaceholder" in rule.transformer) {
      result = applyAddPlaceholderTransformer(rule.transformer, result);
    }
  }
  return result;
}

import { Configuration } from "../config/config-loader";
import { generateType } from "../templates/generate-type";

export function i18nTypegen(configuration: Configuration) {
  return generateType(configuration);
}

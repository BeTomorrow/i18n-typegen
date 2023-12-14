import { Configuration } from "../config/config-loader";
import { generateType } from "../templates/generate-type";

export function codegen(configuration: Configuration) {
  return generateType(configuration);
}

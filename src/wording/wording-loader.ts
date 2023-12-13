import * as fs from "fs";
import { Configuration } from "../config/config-loader";
import { flatten } from "./flatten";

export function loadWordings(configuration: Configuration) {
  const wordings = readWordingFile(configuration.input.path);

  if (configuration.input.format === "nested") {
    return flatten(wordings);
  }

  return wordings;
}

function readWordingFile(wordingPath: string) {
  try {
    const wordings = fs.readFileSync(wordingPath, "utf-8");
    return JSON.parse(wordings);
  } catch (error) {
    console.error(
      `Error reading or parsing the wording file: ${(error as Error).message}`
    );
    process.exit(1);
  }
}

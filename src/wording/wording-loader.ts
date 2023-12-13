import * as fs from "fs";

export function readWordingFile(wordingPath: string) {
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

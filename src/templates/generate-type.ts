import * as fs from "fs";
import * as fsExtra from "fs-extra";
import Mustache from "mustache";
import * as path from "path";
import { Configuration } from "../config/config-loader";
import { generateTemplateData } from "../translation/generate-template-data";
import { loadWordings } from "../wording/wording-loader";

function openTemplate() {
  try {
    const templatePath = path.join(__dirname, "translations.mustache");
    return fs.readFileSync(templatePath, "utf-8");
  } catch (error) {
    console.error(
      `Error reading or parsing the template file: ${(error as Error).message}`
    );
    process.exit(1);
  }
}

function writeFile(text: string, path: string) {
  try {
    fsExtra.outputFileSync(path, text);
  } catch (error) {
    console.error(`Error writing the i18n type: ${(error as Error).message}`);
    process.exit(1);
  }
}

const utilityChar = {
  OPEN_BRACE: "{",
  CLOSE_BRACE: "}",
};

export function generateType(configuration: Configuration) {
  const template = openTemplate();

  const wordings = loadWordings(configuration);
  const templateData = generateTemplateData(wordings, configuration);

  const generatedType = Mustache.render(template, {
    keys: templateData,
    ...utilityChar,
  });

  writeFile(generatedType, configuration.output.path);
}

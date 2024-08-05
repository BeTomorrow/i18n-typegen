import * as fs from "fs";
import { Configuration } from "../config/config-loader";

export function init() {
  const configurationFilename = "i18n-type.config.json";
  const defaultConfiguration: Configuration = {
    input: {
      format: "nested",
      path: "./i18n/en.json",
    },
    output: {
      path: "./i18n/translations.d.ts",
    },
    rules: [
      {
        "//": "Add pluralization placeholders",
        condition: { keyEndsWith: ["zero", "one", "other"] },
        transformer: {
          addPlaceholder: { name: "count", type: ["number"] },
          removeLastPart: true,
        },
      },
      {
        "//": "Add interpolation values for matched placeholders",
        condition: { placeholderPattern: { prefix: "{{", suffix: "}}" } },
        transformer: {
          addMatchedPlaceholder: { type: ["string", "number"] },
        },
      },
    ],
    extra: {
      prettierIgnore: true,
      eslintDisablePrettier: false,
    },
  };
  console.log(`Initialize config file ${configurationFilename}\n`);
  writeDefaultConfiguration(defaultConfiguration, configurationFilename);
}

function writeDefaultConfiguration(config: Configuration, path: string) {
  const text = JSON.stringify(config, null, 2);
  try {
    fs.writeFileSync(path, text);
    console.log(`Default configuration: \n\
${text}\n`);
  } catch (error) {
    console.error(`Error writing the i18n type: ${(error as Error).message}`);
    process.exit(1);
  }
}

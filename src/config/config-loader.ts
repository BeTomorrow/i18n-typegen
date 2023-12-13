import * as fs from "fs";

export function readConfigFile(configPath: string): Configuration {
  try {
    const configData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    console.error(
      'Missing configuration file. \n\
Run "npm run i18n-typegen init" to generate one\n'
    );
    process.exit(1);
  }
}

type InputFormat = "flatten" | "nested";

export interface Configuration {
  input: {
    format: InputFormat;
    path: string;
  };
  output: {
    path: string;
  };
}

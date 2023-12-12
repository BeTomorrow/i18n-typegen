import * as fs from "fs";

export function readConfigFile(configPath: string): Configuration {
  try {
    const configData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    console.error(
      `Error reading or parsing the config file: ${(error as Error).message}`
    );
    process.exit(1);
  }
}

type InputFormat = "flatten";

export interface Configuration {
  input: {
    format: InputFormat;
    path: string;
  };
  output: {
    path: string;
  };
}

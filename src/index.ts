// src/index.ts
import * as commander from "commander";
import * as path from "path";
import { i18nTypegen } from "./command/i18n-typegen";
import { readConfigFile } from "./config/config-loader";

function main() {
  const program = new commander.Command();

  program
    .version("1.0.0")
    .description(
      "Generate TS type for your translations keys and interpolation values"
    );

  program
    .command("i18n-typegen")
    .option(
      "-c, --config <path>",
      "Path to the config file",
      "i18n-config.json"
    )
    .description("Generate types")
    .action((cmd) => {
      const configPath = path.resolve(cmd.config);
      const config = readConfigFile(configPath);
      console.log("Config:", config);
      i18nTypegen(config);
    });

  program.parse(process.argv);

  // If no command is specified, show help
  if (!process.argv.slice(2).length) {
    program.help();
  }
}

main();

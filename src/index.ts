// src/index.ts
import * as commander from "commander";
import * as path from "path";
import { codegen } from "./command/codegen";
import { init } from "./command/init";
import { readConfigFile } from "./config/config-loader";

function main() {
  const program = new commander.Command();

  program
    .version("1.0.0")
    .description(
      "Generate TS type for your translation keys and interpolations"
    );

  program
    .command("codegen")
    .option(
      "-c, --config <path>",
      "Path to the config file",
      "i18n-type.config.json"
    )
    .description("Generate i18n types")
    .action((cmd) => {
      const configPath = path.resolve(cmd.config);
      const config = readConfigFile(configPath);

      codegen(config);
    });

  program
    .command("init")
    .description("Initialize i18n-config file")
    .action(() => init());

  program.parse(process.argv);

  // If no command is specified, show help
  if (!process.argv.slice(2).length) {
    program.help();
  }
}

main();

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const binPath = path.join(__dirname, "..", "src", "index.ts");
const configPath = path.join(__dirname, "input", "default.config.json");
const outputPath = path.join(__dirname, "output", "default.d.ts");
const snapshotPath = path.join(__dirname, "snapshot", "default.d.ts");

// Function to compare files
function compareFiles(file1, file2) {
  const content1 = fs.readFileSync(file1, "utf8");
  const content2 = fs.readFileSync(file2, "utf8");
  return content1 === content2;
}

// Run the Node.js program with the specified configuration
exec(`npx ts-node ${binPath} codegen -c "${configPath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error}`);
    return;
  }

  // Compare the output file with the snapshot
  if (compareFiles(outputPath, snapshotPath)) {
    console.log("Test passed: Output matches the snapshot.");
    process.exit(0);
  } else {
    console.log("Test failed: Output does not match the snapshot.");

    // Print the differences
    const diff = require("diff");
    const outputContent = fs.readFileSync(outputPath, "utf8");
    const snapshotContent = fs.readFileSync(snapshotPath, "utf8");
    const differences = diff.createTwoFilesPatch(
      outputPath,
      snapshotPath,
      outputContent,
      snapshotContent
    );
    console.log(differences);
    process.exit(1);
  }
});

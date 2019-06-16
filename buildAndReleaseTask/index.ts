import tl = require("azure-pipelines-task-lib/task");
import * as fs from "fs";

async function run() {
  try {
    const workDir: string = tl.getInput("workDir", true);
    const tslintResultFilePath: string = tl.getInput("filePath", true);
    console.log("********", workDir, tslintResultFilePath, "*************");
    const fileText = fs.readFileSync(`${workDir}/${tslintResultFilePath}`, {
      encoding: "utf8"
    });
    console.log("File", fileText);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();

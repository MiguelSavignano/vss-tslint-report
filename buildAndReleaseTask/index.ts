import tl = require("azure-pipelines-task-lib/task");
import { generateReportFile } from "./lib/tslint-html-report/index";

async function run() {
  try {
    const tslintResultFilePath: string = tl.getInput("filePath", true);
    // console.log("********", workDir, tslintResultFilePath, "*************");

    const reportFilePath = generateReportFile(tslintResultFilePath);
    tl.uploadArtifact("tslint", reportFilePath, "tslint-report");
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();

import * as tl from "azure-pipelines-task-lib/task";
import { generateReportFile } from "./lib/tslint-html-report/index";
import { getArtifactUrl } from "./helper";

async function run() {
  try {
    const tslintResultFilePath: string = tl.getInput("filePath", true);
    // console.log("********", workDir, tslintResultFilePath, "*************");

    const { reportFilePath, tslintReport } = generateReportFile(
      tslintResultFilePath
    );
    tl.uploadArtifact("tslint", reportFilePath, "tslint-report");
    tl.setResult(
      tl.TaskResult.SucceededWithIssues,
      getArtifactUrl(tl.getVariables())
    );
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, "Error Miguel");
  }
}

run();

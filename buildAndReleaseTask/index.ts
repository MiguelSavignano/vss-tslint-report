import * as tl from "azure-pipelines-task-lib/task";
import { generateReportFile } from "./lib/tslint-html-report/index";
import { getArtifactUrl } from "./helper";

async function run() {
  try {
    const tslintResultFilePath: string = tl.getInput("filePath", true);

    const { reportFilePath, tslintReport } = generateReportFile(
      tslintResultFilePath
    );
    if (!tslintReport.length) {
      tl.uploadArtifact("tslint", reportFilePath, "tslint-report");
      tl.setResult(tl.TaskResult.Failed, getArtifactUrl(tl.getVariables()));
    }
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();

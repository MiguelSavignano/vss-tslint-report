import * as fs from "fs";
import * as handlebars from "handlebars";
import { error } from "azure-pipelines-task-lib";
// const tslintjson = require("./tslint-result.json");

export interface ILinterReport {
  endPosition: {
    character: number;
    line: number;
    position: number;
  };
  failure: string;
  fix: {
    innerStart: number;
    innerLength: number;
    innerText: string;
  };
  name: string;
  ruleName: string;
  ruleSeverity: string;
  startPosition: {
    character: number;
    line: number;
    position: number;
  };
}
interface IReportFile {
  name: string;
  errors: ILinterReport[];
}

interface IReportResult {
  total: number;
  files: IReportFile[];
}

export const errosByFile = (jsonReport: ILinterReport[]): IReportFile[] => {
  return jsonReport.reduce((memo, rule) => {
    const lastElement = memo.find(it => it.name == rule.name);
    if (lastElement) {
      lastElement.errors = [...lastElement.errors, rule];
    } else {
      memo.push({
        name: rule.name,
        errors: [rule]
      });
    }

    return memo;
  }, []);
};

export const renderHtml = (data: IReportResult) => {
  const template = fs.readFileSync(__dirname + "/report-template.html", "utf8");
  const compiledTemplate = handlebars.compile(template, {});
  return compiledTemplate(data);
};

export const generateReport = (jsonReport: ILinterReport[]): IReportResult => {
  const errors = jsonReport.map(report => {
    return {
      ...report,
      name: `${report.name}#${report.startPosition.line}`
    };
  });
  return {
    total: errors.length,
    files: errosByFile(jsonReport)
  };
};

export const generateReportFile = (
  tslintResultFilePath: string,
  path = "/tmp/tslint-report.html"
) => {
  const fileText = fs.readFileSync(`${tslintResultFilePath}`, "utf8");
  const tslintReport = JSON.parse(fileText);

  const report = generateReport(tslintReport);
  console.log(report.files[0].errors);
  const contentReport = renderHtml(report);
  fs.writeFileSync(path, contentReport);
  return path;
};

generateReportFile(__dirname + "/tslint-result.json", "tslint-report.html");

// const tslintjson = require("./tslint-result.json");

// console.log(JSON.stringify(errosByFile(tslintjson)));
// const report = generateReport(tslintjson);

// console.log(renderHtml(report));

// module.exports = generateReport;

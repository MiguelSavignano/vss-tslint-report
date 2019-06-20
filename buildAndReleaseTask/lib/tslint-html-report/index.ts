import * as fs from "fs";
import * as handlebars from "handlebars";
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

interface IReportResult {
  total: number;
  errors: ILinterReport[];
}

export const generateReport = (jsonReport: ILinterReport[]): IReportResult => {
  const errors = jsonReport.map(report => {
    return {
      ...report,
      name: `${report.name}#${report.startPosition.line}`
    };
  });
  return {
    total: errors.length,
    errors
  };
};

export const renderHtml = (data: {
  total: number;
  errors: ILinterReport[];
}) => {
  const template = fs.readFileSync(__dirname + "/report-template.html", "utf8");
  const compiledTemplate = handlebars.compile(template, {});
  return compiledTemplate(data);
};

export const errosByFile = (jsonReport: ILinterReport[]) => {
  return jsonReport.reduce((memo, result) => {
    const { name } = result;
    const lastElement = memo.find(it => it.name == name);
    if (lastElement) {
      lastElement.errors = lastElement.errors ? lastElement.errors + 1 : 1;
    } else {
      memo.push({
        name,
        errors: 1
      });
    }

    return memo;
  }, []);
};

export const generateReportFile = (tslintResultFilePath: string) => {
  const path = "/tmp/tslint-report.html";

  const fileText = fs.readFileSync(`${tslintResultFilePath}`, "utf8");
  const tslintReport = JSON.parse(fileText);

  const report = generateReport(tslintReport);
  const contentReport = renderHtml(report);
  fs.writeFileSync(path, contentReport);
  return path;
};

// generateReportFile(__dirname + "/tslint-result.json");

// const report = generateReport(tslintjson);

// console.log(renderHtml(report));

// module.exports = generateReport;

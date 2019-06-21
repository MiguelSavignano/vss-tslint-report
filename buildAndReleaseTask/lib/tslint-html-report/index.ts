import * as fs from "fs";
import * as _ from "lodash";
import * as ejs from "ejs";

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

export const mergeErrorCount = (jsonReportJoin: IReportFile[]) => {
  return jsonReportJoin.map(it => {
    const errors = _.uniqBy(it.errors, "ruleName");
    const errorsNames = errors.map(it => it.ruleName);
    const errorsCount = errorsNames.map(errorName => {
      return {
        ...it.errors.find(it => it.ruleName),
        ruleName: errorName,
        count: _.filter(it.errors, ["ruleName", errorName]).length
      };
    });
    return {
      ...it,
      errors,
      errorsCount
    };
  });
};

export const renderHtml = (data: IReportResult) => {
  const templateString = fs.readFileSync(
    __dirname + "/report-template.html.ejs",
    "utf8"
  );
  return ejs.render(templateString, data);
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
    files: mergeErrorCount(errosByFile(jsonReport))
  };
};

export const generateReportFile = (
  tslintResultFilePath: string,
  path = "/tmp/tslint-report.html"
) => {
  const fileText = fs.readFileSync(`${tslintResultFilePath}`, "utf8");
  const tslintReport = JSON.parse(fileText);

  const report = generateReport(tslintReport);
  const contentReport = renderHtml(report);
  fs.writeFileSync(path, contentReport);
  return path;
};

generateReportFile("../test/examples/tslint-result.json", "tslint-report.html");

// const tslintjson = require("./tslint-result.json");

// console.log(JSON.stringify(errosByFile(tslintjson)));
// const report = generateReport(tslintjson);

// console.log(renderHtml(report));

// module.exports = generateReport;

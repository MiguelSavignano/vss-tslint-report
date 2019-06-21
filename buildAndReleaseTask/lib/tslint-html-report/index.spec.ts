import { errosByFile, joinErrors } from "./index";
import * as fs from "fs";

test("#errosByFile", () => {
  const tslintjson = require("./examples/tslint-result.json");

  const result = errosByFile(tslintjson);
  fs.writeFileSync(
    __dirname + "/examples/tslint-result-join.json",
    JSON.stringify(result, null, 2)
  );
  expect(result.find(it => it.name == "src/app.ts").errors.length).toEqual(26);
});

test("#joinErrors", () => {
  const tslintjsonJoin = require("./examples/tslint-result-join.json");

  const result = joinErrors(tslintjsonJoin);
  fs.writeFileSync(
    __dirname + "/examples/tslint-result-report.json",
    JSON.stringify(result, null, 2)
  );
  expect(result.find(it => it.name == "src/app.ts").errors.length).toEqual(9);
});

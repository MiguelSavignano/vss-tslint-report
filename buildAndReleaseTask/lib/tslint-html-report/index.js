"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var _ = __importStar(require("lodash"));
var ejs = __importStar(require("ejs"));
exports.errosByFile = function (jsonReport) {
    return jsonReport.reduce(function (memo, rule) {
        var lastElement = memo.find(function (it) { return it.name == rule.name; });
        if (lastElement) {
            lastElement.errors = __spread(lastElement.errors, [rule]);
        }
        else {
            memo.push({
                name: rule.name,
                errors: [rule]
            });
        }
        return memo;
    }, []);
};
exports.mergeErrorCount = function (jsonReportJoin) {
    return jsonReportJoin.map(function (it) {
        var errors = _.uniqBy(it.errors, "ruleName");
        var errorsNames = errors.map(function (it) { return it.ruleName; });
        var errorsCount = errorsNames.map(function (errorName) {
            return __assign({}, it.errors.find(function (it) { return it.ruleName; }), { ruleName: errorName, count: _.filter(it.errors, ["ruleName", errorName]).length });
        });
        return __assign({}, it, { errors: errors,
            errorsCount: errorsCount });
    });
};
exports.renderHtml = function (data) {
    var templateString = fs.readFileSync(__dirname + "/report-template.html.ejs", "utf8");
    return ejs.render(templateString, data);
};
exports.generateReport = function (jsonReport) {
    var errors = jsonReport.map(function (report) {
        return __assign({}, report, { name: report.name + "#" + report.startPosition.line });
    });
    return {
        total: errors.length,
        files: exports.mergeErrorCount(exports.errosByFile(jsonReport))
    };
};
exports.generateReportFile = function (tslintResultFilePath, path) {
    if (path === void 0) { path = "/tmp/tslint-report.html"; }
    var fileText = fs.readFileSync("" + tslintResultFilePath, "utf8");
    var tslintReport = JSON.parse(fileText);
    var report = exports.generateReport(tslintReport);
    var contentReport = exports.renderHtml(report);
    fs.writeFileSync(path, contentReport);
    return { reportFilePath: path, tslintReport: tslintReport };
};
// generateReportFile("../test/examples/tslint-result.json", "tslint-report.html");
// const tslintjson = require("./tslint-result.json");
// console.log(JSON.stringify(errosByFile(tslintjson)));
// const report = generateReport(tslintjson);
// console.log(renderHtml(report));
// module.exports = generateReport;

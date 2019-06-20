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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var handlebars = __importStar(require("handlebars"));
exports.generateReport = function (jsonReport) {
    var errors = jsonReport.map(function (report) {
        return __assign({}, report, { name: report.name + "#" + report.startPosition.line });
    });
    return {
        total: errors.length,
        errors: errors
    };
};
exports.renderHtml = function (data) {
    var template = fs.readFileSync(__dirname + "/report-template.html", "utf8");
    var compiledTemplate = handlebars.compile(template, {});
    return compiledTemplate(data);
};
exports.errosByFile = function (jsonReport) {
    return jsonReport.reduce(function (memo, result) {
        var name = result.name;
        var lastElement = memo.find(function (it) { return it.name == name; });
        if (lastElement) {
            lastElement.errors = lastElement.errors ? lastElement.errors + 1 : 1;
        }
        else {
            memo.push({
                name: name,
                errors: 1
            });
        }
        return memo;
    }, []);
};
exports.generateReportFile = function (tslintResultFilePath) {
    var path = "/tmp/tslint-report.html";
    var fileText = fs.readFileSync("" + tslintResultFilePath, "utf8");
    var tslintReport = JSON.parse(fileText);
    var report = exports.generateReport(tslintReport);
    var contentReport = exports.renderHtml(report);
    fs.writeFileSync(path, contentReport);
    return path;
};
// generateReportFile(__dirname + "/tslint-result.json");
// const report = generateReport(tslintjson);
// console.log(renderHtml(report));
// module.exports = generateReport;

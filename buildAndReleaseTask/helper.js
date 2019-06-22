"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = function (variables, name) {
    variables.find(function (it) { return it.name == name; }).value;
};
exports.getOrganizationName = function (string) { return string.split("/")[3]; };
exports.getArtifactUrl = function (variables) {
    var organizationName = exports.getOrganizationName(exports.getValue(variables, "system.teamFoundationCollectionUri"));
    var containerId = exports.getValue(variables, "build.containerId");
    return "[tslint-report](https://" + organizationName + ".visualstudio.com/_apis/resources/Containers/" + containerId + "?itemPath=tslint%2Ftslint-report.html)";
};

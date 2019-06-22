"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = function (variables, name) { return variables.find(function (it) { return it.name == name; }).value; };
exports.getOrganizationName = function (string) { return string.split("/")[3]; };
exports.getArtifactUrl = function (variables) {
    var organizationName = exports.getOrganizationName(exports.getValue(variables, "system.teamFoundationCollectionUri"));
    var containerId = exports.getValue(variables, "build.containerId");
    return "https://" + organizationName + ".visualstudio.com/_apis/resources/Containers/" + containerId + "?itemPath=tslint%2Ftslint-report.html";
};

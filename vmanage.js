const fs = require("fs");

const [binPath, file, filePath, _versionPath] = process.argv;
const versionPath = _versionPath || "version";
const vssExtension = require(filePath);

const [major, minor, bug] = vssExtension.version.split(".");
vssExtension[versionPath] = [major, minor, parseInt(bug) + 1].join(".");
fs.writeFileSync(filePath, JSON.stringify(vssExtension, null, 2));

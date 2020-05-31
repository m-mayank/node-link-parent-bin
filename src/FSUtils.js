"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mkdirp = require("mkdirp");
var fs = require("mz/fs");
var path = require("path");
var FSUtils = /** @class */ (function () {
    function FSUtils() {
    }
    FSUtils.mkdirp = function (dir) {
        return new Promise(function (res, rej) {
            mkdirp(dir, function (err) {
                if (err) {
                    rej(err);
                }
                else {
                    res();
                }
            });
        });
    };
    FSUtils.readDirs = function (location) {
        return fs.readdir(location)
            .then(function (files) { return Promise.all(files.map(function (file) { return fs.stat(path.resolve(location, file)).then(function (stat) { return ({ file: file, stat: stat }); }); }))
            .then(function (files) { return files.filter(function (f) { return f.stat.isDirectory(); }).map(function (f) { return f.file; }); }); });
    };
    FSUtils.readAllNodeDirs = function (location) {
        return FSUtils.readDirectoriesRecursive(location, location);
    };
    FSUtils.readDirectoriesRecursive = function (folder, root) {
        if (root === void 0) { root = ''; }
        return Promise.all([FSUtils.isFileExists(path.join(folder, 'package.json')), FSUtils.readSubDirectoriesRecursive(folder)]).then(function (results) { return (results[1].concat((results[0] && folder !== root) ? [folder] : [])); });
    };
    FSUtils.readSubDirectoriesRecursive = function (folder) {
        return FSUtils.subFolders(folder).then(function (subFolders) { return (Promise.all(subFolders.map(function (subFolder) { return FSUtils.readDirectoriesRecursive(subFolder); })).then(function (subDirectories) { return ([].concat.apply([], subDirectories)); })); });
    };
    FSUtils.subFolders = function (folder) {
        return fs.readdir(folder).then(function (subFolders) { return (Promise.all(subFolders.map(function (subFolder) { return fs.stat(path.resolve(folder, subFolder)).then(function (stat) { return ({ name: subFolder, stat: stat }); }); })).then(function (subFolders) { return (subFolders.filter(function (subFolder) { return subFolder.stat.isDirectory() && subFolder.name !== 'node_modules' && !(/^\./.test(subFolder.name)); })
            .map(function (subFolder) { return path.join(folder, subFolder.name); })); })); });
    };
    FSUtils.isFileExists = function (filePath) {
        return new Promise(function (reslove) {
            fs.access(filePath, fs.constants.F_OK, function (error) {
                reslove(!error);
            });
        });
    };
    return FSUtils;
}());
exports.FSUtils = FSUtils;
;
//# sourceMappingURL=FSUtils.js.map
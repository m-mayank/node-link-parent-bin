"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var path = require("path");
var log4js_1 = require("log4js");
var fs = require("mz/fs");
var FSUtils_1 = require("./FSUtils");
var cmdShim = require('cmd-shim');
function symlink(from, to) {
    to = path.resolve(to);
    var toDir = path.dirname(to);
    var target = path.relative(toDir, from);
    return FSUtils_1.FSUtils.mkdirp(path.dirname(to))
        .then(function () { return fs.symlink(target, to, 'junction'); });
}
function link(from, to) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (os_1.platform() === 'win32') {
                return [2 /*return*/, cmdShimIfExists(from, to)];
            }
            else {
                return [2 /*return*/, linkIfExists(from, to)];
            }
            return [2 /*return*/];
        });
    });
}
exports.link = link;
function cmdShimIfExists(from, to) {
    return __awaiter(this, void 0, void 0, function () {
        var _1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.stat(to)];
                case 1:
                    _a.sent();
                    info("Link at '" + to + "' already exists. Leaving it alone.");
                    return [3 /*break*/, 3];
                case 2:
                    _1 = _a.sent();
                    /* link doesn't exist */
                    return [2 /*return*/, new Promise(function (res, rej) {
                            cmdShim.ifExists(from, to, function (err) {
                                if (err) {
                                    rej(err);
                                }
                                else {
                                    res(undefined);
                                }
                            });
                        })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function linkIfExists(from, to) {
    return fs.stat(from)
        .then(function (_) { return fs.readlink(to)
        .then(function (fromOnDisk) {
        var toDir = path.dirname(to);
        var absoluteFrom = path.resolve(toDir, from);
        var absoluteFromOnDisk = path.resolve(toDir, fromOnDisk);
        if (absoluteFrom === absoluteFromOnDisk) {
            // if the link already exists and matches what we would do,
            // we don't need to do anything
            return undefined;
        }
        else {
            info("Different link at '" + to + "' already exists. Leaving it alone, the package is probably already installed in the child package.");
        }
    }); }).catch(function (_) {
        /* link doesn't exist */
        return symlink(from, to);
    });
}
function info(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var log = log4js_1.getLogger('link');
    log.info.apply(log, [message].concat(args));
}
//# sourceMappingURL=link.js.map
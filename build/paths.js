(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadRawFromRoot = exports.loadFromRoot = exports.resolveApp = void 0;
    var path = require("path");
    var fs = require("fs");
    var _a = require("ramda"), reduce = _a.reduce, keys = _a.keys, pipe = _a.pipe;
    var appDirectory = fs.realpathSync(process.cwd());
    var resolveApp = function (relativePath) { return path.resolve(appDirectory, relativePath); };
    exports.resolveApp = resolveApp;
    var root = resolveApp(".");
    var makeSafe = function (loader) { return function (p) {
        try {
            return loader(p);
        }
        catch (e) {
            return null;
        }
    }; };
    var load = makeSafe(function (p) { return require(p); });
    var loadRaw = makeSafe(function (p) {
        var raw = fs.readFileSync(p);
        return JSON.parse(raw);
    });
    var createFromLoader = function (loader, prefix) {
        return pipe(function (m) { return path.join(prefix, m); }, loader);
    };
    var loadFromRoot = createFromLoader(load, root);
    exports.loadFromRoot = loadFromRoot;
    var loadRawFromRoot = createFromLoader(loadRaw, root);
    exports.loadRawFromRoot = loadRawFromRoot;
});

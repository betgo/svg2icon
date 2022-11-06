(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "gulp", "gulp-rename", "./utils", "./reactComponentGenerator", "./mapFileGenerator", "./htmlGenerator", "./paths"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var path = require("path");
    var gulp_1 = require("gulp");
    var rename = require("gulp-rename");
    var xmlParser = require("./xmlParser");
    var astTransform = require("./xmlParser/transform");
    var utils_1 = require("./utils");
    var reactComponentGenerator_1 = require("./reactComponentGenerator");
    var mapFileGenerator_1 = require("./mapFileGenerator");
    var htmlGenerator_1 = require("./htmlGenerator");
    var paths_1 = require("./paths");
    var customConfig = (0, paths_1.loadFromRoot)("svg2icon.config.js") ||
        (0, paths_1.loadRawFromRoot)("svg2icon.config.js") ||
        undefined;
    var INPUT_SRC_PATH = path.resolve(__dirname, (customConfig === null || customConfig === void 0 ? void 0 : customConfig.INPUT_SRC_PATH) || "../assets/svg");
    var OUTPUT_SRC_PATH = path.resolve(__dirname, (customConfig === null || customConfig === void 0 ? void 0 : customConfig.OUTPUT_SRC_PATH) || "../assets/icon");
    var MAP_FILE_PATH = path.resolve(OUTPUT_SRC_PATH, "iconsMap.ts");
    var HTML_FILE_PATH = path.resolve(OUTPUT_SRC_PATH, "iconDemo.html");
    var excludeAttrs = [
        "id",
        "t",
        "class",
        "version",
        "p-id",
        "xmlns",
        "xmlns:xlink",
        "xlink:href",
        "filter",
    ];
    var ignoreColorSvg = [];
    var svg2icon = function () {
        var fileNames = [];
        var fileContents = [];
        var renamedIgnoreColorSvg = [];
        return (0, gulp_1.src)("".concat(INPUT_SRC_PATH, "/[a-zA-Z0-9]*.svg"))
            .pipe(rename(function (path) {
            var rawName = path.basename;
            var newName = (0, utils_1.capitalize)((0, utils_1.camelize)(rawName));
            path.basename = newName;
            path.extname = ".jsx";
            fileNames.push(newName);
            if (ignoreColorSvg.includes(rawName)) {
                renamedIgnoreColorSvg.push(newName);
            }
        }))
            .pipe(xmlParser({
            transform: astTransform({
                onTag: function (element, meta) {
                    element.rawAttrs = element.attrs;
                    if (element.tag === "svg") {
                        if (!renamedIgnoreColorSvg.includes(meta.filename)) {
                            element.attrs.fill = "currentColor";
                        }
                    }
                },
                onAttr: function (name, value, element, meta) {
                    var attrs = element.attrs, rawAttrs = element.rawAttrs;
                    if (excludeAttrs.includes(name)) {
                        delete attrs[name];
                        return;
                    }
                    var camelizedName = (0, utils_1.camelize)(name);
                    switch (name) {
                        case "fill": {
                            if (!renamedIgnoreColorSvg.includes(meta.filename) &&
                                element.tag !== "svg") {
                                delete attrs.fill;
                            }
                            break;
                        }
                        case "width": {
                            attrs.width = "100%";
                            break;
                        }
                        case "height": {
                            attrs.height = "".concat((rawAttrs.height / rawAttrs.width) * 100 || 100, "%");
                            break;
                        }
                        default: {
                            delete attrs[name];
                            attrs[camelizedName] = value;
                            break;
                        }
                    }
                },
            }),
            generator: reactComponentGenerator_1.default,
            plugins: [
                function (filename, ast) {
                    fileContents.push({ filename: filename, content: (0, utils_1.renderSvg)(ast) });
                },
            ],
        }))
            .pipe((0, gulp_1.dest)(OUTPUT_SRC_PATH))
            .on("end", function () {
            (0, mapFileGenerator_1.default)(fileNames, MAP_FILE_PATH);
            (0, htmlGenerator_1.htmlGenerator)(fileContents, HTML_FILE_PATH);
        });
    };
    module.exports = svg2icon;
});

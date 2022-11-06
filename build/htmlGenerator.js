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
    exports.htmlGenerator = void 0;
    var fs = require("fs");
    var htmlGenerator = function (files, output) {
        var content = "\n    <!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <title>icon</title>\n</head>\n<body>\n<div style=\"display:flex\">\n".concat(files
            .map(function (_a) {
            var filename = _a.filename, content = _a.content;
            return "\n        <div style=\"width:100px\">\n        ".concat(content, "\n        </div>\n        <div>").concat(filename, "</div>\n        ");
        })
            .join(""), "\n</div>\n</body>\n\n</html>\n    ");
        fs.writeFile(output, content, function (err) {
            if (err) {
                return console.error(err);
            }
        });
    };
    exports.htmlGenerator = htmlGenerator;
});

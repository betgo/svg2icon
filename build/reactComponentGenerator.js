(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require("./utils");
    var generateReactComponent = function (name, xmlAst) {
        return "\n    import React form 'react';\n\n    exports default function ".concat(name, " (){\n        return (").concat((0, utils_1.renderSvg)(xmlAst), ")\n    }\n    ");
    };
    exports.default = generateReactComponent;
});

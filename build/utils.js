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
    exports.renderSvg = exports.camelize = exports.capitalize = exports.hypenate = void 0;
    var hypenate = function (str) {
        return str.replace(/\B([A-Z])/, "-$1").toLowerCase();
    };
    exports.hypenate = hypenate;
    var capitalize = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    exports.capitalize = capitalize;
    var camelizeReg = /-(\w)/g;
    var camelize = function (str) {
        return str.replace(camelizeReg, function (_, c) { return (c ? c.toUpperCase() : ""); });
    };
    exports.camelize = camelize;
    var combineAttrs = function (attrs) {
        return Object.entries(attrs)
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "".concat(key, "='").concat(value, "'");
        })
            .join(" ");
    };
    var generateElementStr = function (tag, attrs, children) {
        return "<".concat(tag, " ").concat(combineAttrs(attrs), ">").concat(children, "</").concat(tag, ">");
    };
    var renderEl = function (el) {
        var children = el.children.map(renderEl).join("\n");
        return generateElementStr(el.tag, el.attrs, children);
    };
    var renderSvg = function (xmlAst) {
        var svg = xmlAst.find(function (element) { return element.tag === "svg"; });
        if (!svg)
            return null;
        return renderEl(svg);
    };
    exports.renderSvg = renderSvg;
});

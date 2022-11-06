(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "htmlparser2"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var htmlparser2 = require("htmlparser2");
    var createParser = function () {
        var ast = [];
        var processTags = [];
        var openTag;
        var clear = function () {
            ast = [];
            processTags = [];
            openTag = undefined;
        };
        var getAst = function () {
            if (processTags.length !== 0) {
            }
            var result = ast;
            clear();
            return result;
        };
        var htmlParser = new htmlparser2.Parser({
            onopentagname: function (name) {
                openTag = {
                    tag: name,
                    attrs: [],
                    children: [],
                };
            },
            onattribute: function (name, value) {
                openTag.attrs[name] = value;
            },
            onopentag: function (name) {
                if (openTag.tag !== name) {
                    return;
                }
                var lastProcessTag = processTags[processTags.length - 1];
                if (lastProcessTag) {
                    lastProcessTag.children.push(openTag);
                }
                processTags.push(openTag);
                openTag = undefined;
            },
            onclosetag: function (name) {
                var finishedTag = processTags.pop();
                if (!finishedTag) {
                    return;
                }
                if (finishedTag.tag !== name) {
                    return;
                }
                if (processTags.length === 0) {
                    ast.push(finishedTag);
                }
                openTag = undefined;
            },
            onerror: function () {
                console.log("err:");
            },
        }, { xmlMode: true, decodeEntities: true });
        return {
            parse: function (chunk) { return htmlParser.write(chunk); },
            getAst: getAst,
        };
    };
    module.exports = createParser;
});

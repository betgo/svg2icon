var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var defaultVisitor = {
    onTag: function () { return void 0; },
    onAttr: function () { return void 0; },
};
var travelAst = function (ast, meta, visitor) {
    var options = __assign(__assign({}, defaultVisitor), visitor);
    ast.forEach(function (element) {
        options.onTag(element, meta);
        Object.entries(element.attrs).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            options.onAttr(key, value, element, meta);
        });
        if (element.children && element.children.length) {
            travelAst(element.children, meta, options);
        }
    });
    return ast;
};
module.exports = function transformAst(visitor) {
    return function (ast, meta) {
        return travelAst(ast, meta, visitor);
    };
};

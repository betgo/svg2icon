var through2 = require("through2");
var createParser = require("./xmlParser/parser");
var xmlParser = function (_a) {
    var transform = _a.transform, generator = _a.generator, plugins = _a.plugins;
    var parser = createParser();
    return through2.obj(function (file, _, callback) {
        parser.parse(file.contents.toString());
        var ast = parser.getAst();
        var processedAst = transform(ast, { filename: file.stem });
        var codeStr = generator(file.stem, processedAst);
        plugins.forEach(function (fn) {
            if (typeof fn !== "function") {
                throw new Error("plugin must be function");
            }
            fn(file.stem, processedAst);
        });
        file.contents = Buffer.from(codeStr);
        this.push(file);
        callback();
    });
};
module.exports = xmlParser;

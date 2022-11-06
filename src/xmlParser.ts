const through2 = require("through2");
const createParser = require("./xmlParser/parser");

const xmlParser = ({ transform, generator, plugins }: any) => {
  const parser = createParser();

  return through2.obj(function (
    file: { contents: Buffer; stem: any },
    _: any,
    callback: () => void
  ) {
    parser.parse(file.contents.toString());
    const ast = parser.getAst();
    const processedAst = transform(ast, { filename: file.stem });
    const codeStr = generator(file.stem, processedAst);
    plugins.forEach((fn) => {
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

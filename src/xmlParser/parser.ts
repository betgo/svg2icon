// const htmlparser2 = require("htmlparser2");
import * as htmlparser2 from "htmlparser2";
const createParser = () => {
  let ast: any[] = [];
  let processTags: any[] = [];
  let openTag: { attrs: any; tag: any; children?: undefined[] };

  /**
   * 清除状态
   */
  const clear = () => {
    ast = [];
    processTags = [];
    openTag = undefined;
  };

  /**
   * 获取结果
   * */
  const getAst = () => {
    if (processTags.length !== 0) {
      // 如果还有待处理的数据，此时获取结果ast是错误行为
    }
    const result = ast;

    clear();

    return result;
  };

  /**解释器 */
  const htmlParser = new htmlparser2.Parser(
    {
      onopentagname(name: string) {
        openTag = {
          tag: name,
          attrs: [],
          children: [],
        };
      },
      onattribute(name: string | number, value: string) {
        openTag.attrs[name] = value;
      },
      onopentag(name: string) {
        if (openTag.tag !== name) {
          return;
        }
        const lastProcessTag = processTags[processTags.length - 1];
        if (lastProcessTag) {
          lastProcessTag.children.push(openTag);
        }
        processTags.push(openTag);

        openTag = undefined;
      },

      onclosetag(name: string) {
        const finishedTag = processTags.pop();

        if (!finishedTag) {
          // errror
          return;
        }

        if (finishedTag.tag !== name) {
          // error
          return;
        }

        if (processTags.length === 0) {
          ast.push(finishedTag);
        }

        openTag = undefined;
      },

      onerror() {
        console.log("err:");
      },
    },
    { xmlMode: true, decodeEntities: true }
  );

  return {
    parse: (chunk: any) => htmlParser.write(chunk),
    getAst,
  };
};

module.exports = createParser;

const path = require("path");
import { dest, src } from "gulp";
import * as rename from "gulp-rename";
const xmlParser = require("./xmlParser");
const astTransform = require("./xmlParser/transform");
import { capitalize, camelize, renderSvg } from "./utils";
import reactComponentGenerator from "./reactComponentGenerator";
import mapFileGenerator from "./mapFileGenerator";
import { htmlGenerator } from "./htmlGenerator";
import { loadRawFromRoot, loadFromRoot } from "./paths";

// 自定义地址
const customConfig =
  loadRawFromRoot("svg2icon.config.js") ||
  loadFromRoot("svg2icon.config.js") ||
  undefined;

const INPUT_SRC_PATH = path.resolve(
  __dirname,
  customConfig?.INPUT_SRC_PATH || "../assets/svg"
);
const OUTPUT_SRC_PATH = path.resolve(
  __dirname,
  customConfig?.OUTPUT_SRC_PATH || "../assets/icon"
);
const MAP_FILE_PATH = path.resolve(OUTPUT_SRC_PATH, "iconsMap.ts");
const HTML_FILE_PATH = path.resolve(OUTPUT_SRC_PATH, "iconDemo.html");

/**
 * 剔除属性
 * */

const excludeAttrs = [
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
/**
 * 保留原色彩的Icons
 * */
const ignoreColorSvg: string[] = [];

const svg2icon = () => {
  const fileNames: string[] = [];
  let fileContents: any[] = [];
  const renamedIgnoreColorSvg: string[] = [];
  return src(`${INPUT_SRC_PATH}/[a-zA-Z0-9]*.svg`) // \w会被转义掉
    .pipe(
      rename((path) => {
        const rawName = path.basename;
        const newName = capitalize(camelize(rawName));
        path.basename = newName;
        path.extname = ".jsx";
        fileNames.push(newName);
        if (ignoreColorSvg.includes(rawName)) {
          renamedIgnoreColorSvg.push(newName);
        }
      })
    )
    .pipe(
      xmlParser({
        transform: astTransform({
          onTag(element: any, meta: any) {
            element.rawAttrs = element.attrs;

            if (element.tag === "svg") {
              if (!renamedIgnoreColorSvg.includes(meta.filename)) {
                element.attrs.fill = "currentColor";
              }
            }
          },
          onAttr(name: string, value: string, element: any, meta: any) {
            const { attrs, rawAttrs } = element;
            if (excludeAttrs.includes(name)) {
              delete attrs[name];
              return;
            }

            const camelizedName = camelize(name);

            switch (name) {
              case "fill": {
                if (
                  !renamedIgnoreColorSvg.includes(meta.filename) &&
                  element.tag !== "svg"
                ) {
                  delete attrs.fill;
                }
                break;
              }
              case "width": {
                attrs.width = "100%";
                break;
              }
              case "height": {
                attrs.height = `${
                  (rawAttrs.height / rawAttrs.width) * 100 || 100
                }%`;
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
        generator: reactComponentGenerator,
        plugins: [
          (filename, ast) => {
            fileContents.push({ filename, content: renderSvg(ast) });
          },
        ],
      })
    )
    .pipe(dest(OUTPUT_SRC_PATH))
    .on("end", () => {
      mapFileGenerator(fileNames, MAP_FILE_PATH);
      htmlGenerator(fileContents, HTML_FILE_PATH);
    });
};
module.exports = svg2icon;

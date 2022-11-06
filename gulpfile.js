const { task, series } = require("gulp");
// import { series } from "gulp";
// import svg2icon from "./src";
const svg2icon = require("./build");

exports.default = series(svg2icon);

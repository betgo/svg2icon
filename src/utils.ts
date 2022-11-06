/**
 * 驼峰转中划线分隔
 * @param str
 * @returns
 */
export const hypenate = (str: string) => {
  return str.replace(/\B([A-Z])/, "-$1").toLowerCase();
};

/**
 * 字符串首字母大写
 * @param str 字符串
 * @returns
 */
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const camelizeReg = /-(\w)/g;
/**
 * 中划线分隔字符串转驼峰
 * @param str
 * @returns
 */
export const camelize = (str: string) => {
  return str.replace(camelizeReg, (_, c) => (c ? c.toUpperCase() : ""));
};

/**
 * 拼接属性
 *
 * */
const combineAttrs = (attrs: { [s: string]: unknown } | ArrayLike<unknown>) => {
  return Object.entries(attrs)
    .map(([key, value]) => `${key}='${value}'`)
    .join(" ");
};
/**
 * ast生成元素字符串
 *
 * */
const generateElementStr = (
  tag: any,
  attrs: ArrayLike<unknown> | { [s: string]: unknown },
  children: any
) => {
  return `<${tag} ${combineAttrs(attrs)}>${children}</${tag}>`;
};

const renderEl = (el: any) => {
  const children = el.children.map(renderEl).join("\n");
  return generateElementStr(el.tag, el.attrs, children);
};
/**
 * 递归xml ast 生成 html
 *
 * */
export const renderSvg = (xmlAst: any) => {
  const svg = xmlAst.find((element: { tag: string }) => element.tag === "svg");
  if (!svg) return null;
  return renderEl(svg);
};

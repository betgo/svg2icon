const defaultVisitor = {
  onTag: (): undefined => void 0,
  onAttr: (): undefined => void 0,
};

/**
 * 遍历 xml ast
 *
 * */
const travelAst = (ast: any[], meta: any, visitor: any) => {
  const options = { ...defaultVisitor, ...visitor };


  ast.forEach(
    (element: {
      attrs: { [s: string]: unknown } | ArrayLike<unknown>;
      children: any[];
    }) => {
      options.onTag(element, meta);

      Object.entries(element.attrs).forEach(([key, value]) => {
        options.onAttr(key, value, element, meta);
      });

      if (element.children && element.children.length) {
        travelAst(element.children, meta, options);
      }
    }
  );

  return ast;
};

module.exports = function transformAst(visitor: any) {
  return (ast: any, meta: any) => {
    return travelAst(ast, meta, visitor);
  };
};

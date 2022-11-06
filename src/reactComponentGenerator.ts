import { renderSvg } from "./utils";

/**生成reactComponent */
const generateReactComponent = (name: string, xmlAst: any) => {
  return `
    import React form 'react';

    exports default function ${name} (){
        return (${renderSvg(xmlAst)})
    }
    `;
};

export default generateReactComponent;

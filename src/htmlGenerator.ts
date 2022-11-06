const fs = require("fs");

/** icon html 生成 */
export const htmlGenerator = (files: any[], output: string) => {
  let content = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <title>icon</title>
</head>
<body>
<div style="display:flex">
${files
  .map(({ filename, content }) => {
    return `
        <div style="width:100px">
        ${content}
        </div>
        <div>${filename}</div>
        `;
  })
  .join("")// map输出任然是array，直接使用会调用toString，会有逗号 [1,2,3].toString===>1,2,3
}
</div>
</body>

</html>
    `;
  fs.writeFile(output, content, function (err) {
    if (err) {
      return console.error(err);
    }
  });
};

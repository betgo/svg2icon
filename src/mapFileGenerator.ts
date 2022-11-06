const fs = require("fs");
import { hypenate } from "./utils";

/**
 * map文件生成
 * @param filenames 文件名数组
 * @param output 输出地址
 */
const mapFileGenerator = async (filenames: string[], output: string) => {
  const importsContent = filenames
    .map((filename) => `import ${filename} from './${filename}';`)
    .join("\n");
  const outputContent = filenames
    .map((filename) => ` '${hypenate(filename)}':${filename}`)
    .join(",\n");

  const fileContent = `
${importsContent}

const iconsMap = {
    ${outputContent},
}

export type IconType = keyof typeof iconsMap;
export default iconsMap;
    `;
  try {
    await fs.promises.writeFile(output, fileContent);
    console.log(
      "--------------------------------写入iconMap成功--------------------------------"
    );
  } catch (error) {

    console.log(
      "--------------------------------写入iconMap失败--------------------------------"
    );
  }
};
export default mapFileGenerator;

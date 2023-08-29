const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const chalk = require('chalk'); // console.log 的 颜色
console.log('------------ 自动升级README.md 脚本运行中  ------------');
const mdStr = fs
    .readFileSync(path.resolve(process.cwd(), 'README.md'))
    .toString()
    .split('\n');
const infolog = (msg) => {
    console.log(chalk.grey(`command-plugin - ${msg}`));
};
//   line 是有内容的一行
let line = 0;
// 1.读取写入
const packageJsonStr = fs
    .readFileSync(path.resolve(process.cwd(), 'package.json'))
    .toString();
let packageName = JSON.parse(packageJsonStr).name;
let packageVersion = JSON.parse(packageJsonStr).version;
let packageAuthor = JSON.parse(packageJsonStr).author;
let packageHomepage = JSON.parse(packageJsonStr).homepage;
if (!packageName || !packageVersion || !packageAuthor || !packageHomepage) {
    infolog(`请完善你package.json的 name,author,version,homepage 字段后重试.现在退出`);
    process.exit(1);
}
let packageLabel = JSON.parse(packageJsonStr).label;
let packageLabelRes = ``;
for (let i in packageLabel) {
    let text = `<a href=${packageLabel[i]["src"]}><img src="https://img.shields.io/static/v1?label=${packageLabel[i]["frontName"]}&message=${packageLabel[i]["behindName"]}&color=${packageLabel[i]["color"]}" alt="temp" /></a>`;
    packageLabelRes = packageLabelRes + text;
}
//  行数要保持一致，这里我都是19行
let resText = `<div align="center"><h1>
<br/>
🤖
<br />
${packageName}
<br /><br />
</h1>
<sup>
<br />
<br />
<a href="${packageHomepage}"><img src="https://img.shields.io/static/v1?label=version&message=v${packageVersion}&color=blue" alt="npm package" /></a>${packageLabelRes}
<a href="${packageHomepage}">   <img src="https://img.shields.io/static/v1?label=Author&message=${packageAuthor ? packageAuthor : "作者"}&color=yellow" alt="demos" /></a>
<a href="${packageHomepage}">   <img src="https://img.shields.io/static/v1?label=Contribute&message=welcome&color=green" alt="demos" /></a>
<br />
</a>
<br />
Translations: <a href="">🇨🇳 汉语</a>
</sup>
</div>`;
// 第一的数据是vscode 的行数 -1，第二个是 有内容的行号
mdStr.splice(0, line, resText);
fs.writeFileSync(path.resolve(process.cwd(), "README.md"), mdStr.join('\n'), 'utf8');
export {};

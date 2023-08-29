#!/usr/bin/env node
import { execSync } from "child_process";
// @ts-ignore
import path from "path";
// @ts-ignore
import  fs from "fs";
import inquirer from 'inquirer'; // 输入入

const infolog = (msg) => {
  console.log(`\x1B[94m ${msg} \x1B[0m`);
};
const successlog = (msg) => {
  console.log(`\x1B[92m ${msg} \x1B[0m`);
};


let readmeFn = () => {
  return new Promise((resolve, reject) => {
    // 0.判断存不存在
    if (fs.existsSync(path.resolve(process.cwd(), 'README.md'))) {
      infolog(`README.md存在 | 请删掉它后重试。现在退出 `);

      resolve(`README.md存在 | 请删掉它后重试。现在退出 `)

      process.exit(1)

    }
    if (!fs.existsSync(path.resolve(process.cwd(), 'package.json'))) {
      infolog(`package.json不存在 | 请npm init -y后重试。现在退出 `);
      resolve(`package.json不存在 | 请npm init -y后重试。现在退出 `)
      process.exit(1)
    }


    // 1.读取写入
    const packageJsonStr = fs
      .readFileSync(path.resolve(process.cwd(), 'package.json'))
      .toString();

    let packageName = JSON.parse(packageJsonStr).name
    let packageVersion = JSON.parse(packageJsonStr).version
    let packageAuthor = JSON.parse(packageJsonStr).author
    let packageHomepage = JSON.parse(packageJsonStr).homepage


    if (
      !packageName || !packageVersion || !packageAuthor || !packageHomepage
    ) {
      infolog(`请完善你package.json的 name,author,version,homepage 字段后重试.现在退出`);
      resolve(`请完善你package.json的 name,author,version,homepage 字段后重试.现在退出`)
      process.exit(1)
    }

    // 2.用户选择
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'useIcon',
          pageSize: 20,
          message: '请选择你一个你喜欢的图标',
          choices: [
            '🚀',
            '✈️',
            '🚁',
            '👍',
            '🐱',
            '🐱‍💻',
            '📋',
            '🛤',
            '⚒',
            '🤖',
            '👾',
            '🎠',
            '🌌',
            '🍔',
            '🍿',
            '🍜',
            '🍰',
            '🏆',
            '🥇',
            '🎨'
          ],
        },
        {
          type: 'checkbox',
          name: 'useSelectText',
          pageSize: 20,
          message: '请选择你需要的章节',
          choices: [
            {
              name: 'QUICK START',
            },

            {
              name: 'Features',
            },
            {
              name: 'Developer',
            },
            {
              name: 'Usage',
            },
            {
              name: 'Quesion',
            },
            {
              name: 'Todo',
            },
            {
              name: 'Contributing',
            },
            {
              name: 'Support',
            },
          ],
        },
      ])
      .then((paramater) => {
        console.log(paramater.useSelectText);

        // 3.组装label，内容
        let packageLabel = JSON.parse(packageJsonStr).label
        let packageLabelRes = ``
        for (let i in packageLabel) {
          let text = `<a href=${packageLabel[i]["src"]}><img src="https://img.shields.io/static/v1?label=${packageLabel[i]["frontName"]}&message=${packageLabel[i]["behindName"]}&color=${packageLabel[i]["color"]}" alt="temp" /></a>`
          packageLabelRes = packageLabelRes + text
        }


        let selectTextRes = ``
        for (let i in paramater.useSelectText) {
          let text = `
## ${paramater.useSelectText[i]}


          `
          selectTextRes = selectTextRes + text
        }


        // 4.写入readme
        fs.writeFileSync(
          path.resolve(process.cwd(), 'README.md'),
          `
<div align="center"><h1>
<br/>
${paramater.useIcon}
<br />
${packageName}
<br />
<br />
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
</div>



${selectTextRes}

`,
       
);


        resolve("执行成功")


      });
  });
};
export{
  readmeFn
}
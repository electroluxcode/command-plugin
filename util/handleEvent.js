const fs = require('fs');
const execSync = require('child_process').execSync;
const path = require('path');
const chalk = require('chalk'); // console.log 的 颜色
const inquirer = require('inquirer'); // 输入

const infolog = (msg) => {
  console.log(chalk.grey(`frontengineerplugin - ${msg}`));
};
const successlog = (msg) => {
  console.log(chalk.green(`frontengineerplugin - ${msg}`));
};

//  处理添加husky
let gitFn = () => {
  if (fs.existsSync(path.resolve(process.cwd(), '.husky'))) {
    infolog(`.husky存在 | 现在进行覆盖操作`);
  }
  const packageJsonStr = fs
    .readFileSync(path.resolve(process.cwd(), 'package.json'))
    .toString();
  try {
    const packageJson = JSON.parse(packageJsonStr);
    if (packageJson.scripts['prepare']) {
      infolog(
        'prepare script 重复 | 请手动在package.json 添加script |  prepare: husky install'
      );
    } else {
      packageJson.scripts['prepare'] = 'husky install ';
    }

    fs.writeFileSync(
      path.resolve(process.cwd(), 'package.json'),
      JSON.stringify(packageJson, null, '\t')
    );
    execSync(`npm install husky@8.0.3 -D`);
    execSync(`npm run prepare`);
    // fs.mkdirSync(`.husky`);

    let originPath = path.resolve(__dirname, '..', 'file', 'git', 'commit-msg'); // 库文件

    let targetPath = path.resolve(process.cwd(), '.husky', 'commit-msg'); // 写入工程文件
    fs.cp(originPath, targetPath, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog('husky执行成功 => 现在你的git commit 加上了限制');
      }
    });
  } catch (e) {
    console.error('处理package.json失败，请重试', e.message);
    process.exit(1);
  }
};
exports.gitFn = gitFn;

let eslintFn = () => {
  if (fs.existsSync(path.resolve(process.cwd(), '.eslintrc.js'))) {
    infolog(`.eslintrc.js存在 | 现在 进行覆盖操作`);
  }
  try {
    execSync(`npm install eslint@7 -D`);

    let originPath = path.resolve(
      __dirname,
      '..',
      'file',
      'eslint',
      '.eslintrc.js'
    ); // 库文件
    let targetPath = path.resolve(process.cwd(), '.eslintrc.js'); // 写入工程文件
    fs.cp(originPath, targetPath, (err) => {
      if (err) {
        console.error(err);
      }
    });
    let originPathIgnore = path.resolve(
      __dirname,
      '..',
      'file',
      'eslint',
      '.eslintignore'
    ); // 库文件
    let targetPathIgnore = path.resolve(process.cwd(), '.eslintignore'); // 写入工程文件
    fs.cp(originPathIgnore, targetPathIgnore, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog(
          `eslint脚本执行成功 => 如果你的vscode中没有安装eslint,那么需要您在vscode的扩展安装 eslint后重启项目`
        );
      }
    });
  } catch (e) {
    console.error('处理Eslint失敗，请重试', e.message);
    process.exit(1);
  }
};
exports.eslintFn = eslintFn;

let prettierFn = () => {
  if (fs.existsSync(path.resolve(process.cwd(), '.prettierrc.js'))) {
    infolog(`.prettierrc存在 | 现在 进行覆盖操作`);
  }

  try {
    execSync(`npm install prettier@2 -D`);

    // fs.mkdirSync(`.husky`);
    let originPath = path.resolve(
      __dirname,
      '..',
      'file',
      'prettier',
      '.prettierrc.js'
    ); // 库文件

    let targetPath = path.resolve(process.cwd(), '.prettierrc.js'); // 写入工程文件
    fs.cp(originPath, targetPath, (err) => {
      if (err) {
        console.error(err);
      } else {
        // successlog(`eslint执行成功-如果你的vscode中没有安装eslint,那么需要您在vscode的扩展安装 eslint后重启项目`)
      }
    });
    let originPathIgnore = path.resolve(
      __dirname,
      '..',
      'file',
      'prettier',
      '.prettierignore'
    ); // 库文件

    let targetPathIgnore = path.resolve(process.cwd(), '.prettierignore'); // 写入工程文件
    fs.cp(originPathIgnore, targetPathIgnore, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog(
          `prettier脚本执行成功 => 如果你的vscode中没有安装prettier,那么需要您在vscode的扩展安装 prettier后重启项目。注意我们需要在vscode中 ctrl(command) + shift + p 搜索 format selection with 接着 点最下面的 configue default format  选择 prettier format`
        );
      }
    });
  } catch (e) {
    console.error('处理Prettier失敗，请重试', e.message);
    process.exit(1);
  }
};
exports.prettierFn = prettierFn;

let npmFn = () => {
  if (fs.existsSync(path.resolve(process.cwd(), '.npmrc'))) {
    infolog(`.npmrc存在 | 现在 进行覆盖操作`);
  }

  try {
    // fs.mkdirSync(`.husky`);
    let originPath = path.resolve(__dirname, '..', 'file', 'npmConfig', '.np'); // 库文件

    let targetPath = path.resolve(process.cwd(), '.npmrc'); // 写入工程文件
    fs.cp(originPath, targetPath, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog(`npmrc => 脚本执行成功`);
      }
    });
  } catch (e) {
    console.error('处理.npmrc失敗，请重试', e.message);
    process.exit(1);
  }
};
exports.npmFn = npmFn;

let envFn = () => {
  if (fs.existsSync(path.resolve(process.cwd(), '.npmrc'))) {
    infolog(`envConfig存在 | 现在 进行覆盖操作`);
  }

  try {
    // fs.mkdirSync(`.husky`);
    let originPath = path.resolve(__dirname, '..', 'file', 'envConfig'); // 库文件

    let targetPath = path.resolve(process.cwd(), 'envConfig'); // 写入工程文件
    fs.cp(originPath, targetPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog(`env => 环境区分脚本执行成功`);
      }
    });
  } catch (e) {
    console.error('处理 环境区分脚本 失敗，请重试', e.message);
    process.exit(1);
  }
};
exports.envFn = envFn;

let CICDFn = () => {
  if (fs.existsSync(path.resolve(process.cwd(), 'CICD'))) {
    infolog(`CICD文件夹存在 | 现在 进行覆盖操作`);
  }

  try {
    // fs.mkdirSync(`.husky`);
    let originPath = path.resolve(__dirname, '..', 'file', 'CICD'); // 库文件

    let targetPath = path.resolve(process.cwd(), 'CICD'); // 写入工程文件
    fs.cp(originPath, targetPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog(`CICD => CICD执行成功`);
      }
    });
  } catch (e) {
    console.error('处理 CICD脚本 失敗，请重试', e.message);
    process.exit(1);
  }
};
exports.CICDFn = CICDFn;

let corFn = () => {
  if (fs.existsSync(path.resolve(process.cwd(), 'cor'))) {
    infolog(`cor存在 | 现在 进行覆盖操作`);
  }

  try {
    // fs.mkdirSync(`.husky`);
    let originPath = path.resolve(__dirname, '..', 'file', 'cors'); // 库文件

    let targetPath = path.resolve(process.cwd(), 'cors'); // 写入工程文件
    fs.cp(originPath, targetPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog(`cors => cors示例执行成功`);
      }
    });
  } catch (e) {
    console.error('处理 cors示例 失敗，请重试', e.message);
    process.exit(1);
  }
};
exports.corFn = corFn;

//  处理添加test
let testFn = () => {
  if (fs.existsSync(path.resolve(process.cwd(), 'testCase'))) {
    infolog(`testCase存在 | 现在 进行覆盖操作`);
  }
  const packageJsonStr = fs
    .readFileSync(path.resolve(process.cwd(), 'package.json'))
    .toString();
  try {
    // 1.覆盖命令
    const packageJson = JSON.parse(packageJsonStr);
    if (packageJson.scripts['test']) {
      infolog(
        'test script 重复 |  请手动在package.json 添加script |  test: jest file/testCase --coverage'
      );
    } else {
      packageJson.scripts['test'] = 'jest file/testCase --coverage ';
    }
    fs.writeFileSync(
      path.resolve(process.cwd(), 'package.json'),
      JSON.stringify(packageJson, null, '\t')
    );

    // 2.npm 安装 一下
    execSync(`npm install jest@29 -D`);
    execSync(`npm install ts-jest@29 -D`);
    execSync(`npm install jest-environment-jsdom@29 -D`);

    // 3.复制 jest.config.js 过去
    let originJestPath = path.resolve(
      __dirname,
      '..',
      'file',
      'testCase',
      'jest.config.js'
    ); // 库文件
    let targetJestPath = path.resolve(process.cwd(), 'jest.config.js'); // 写入工程文件
    fs.cp(originJestPath, targetJestPath, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog('test执行成功 =>jest.config.js迁移成功');
      }
    });

    // 3.复制 示例文件夹 过去
    let originPath = path.resolve(__dirname, '..', 'file', 'testCase'); // 库文件
    let targetPath = path.resolve(process.cwd(), 'testCase'); // 写入工程文件
    fs.cp(originPath, targetPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog(
          'test执行成功 => 现在你已经有了testCase文件夹,你的script 和 jest 和 jsdom 也已经安装'
        );
        infolog(`
        如果你要对ts进行校验,可以参考如下tsconfig.json示例
        {
          "compilerOptions": {
            "target": "ES5",
            "moduleResolution": "node",
            "jsx": "react",
            "esModuleInterop": true,
            "downlevelIteration": true,
            "sourceMap": true,
            "baseUrl": ".",
            "paths": {
              "@/*": ["src/*"],
             
            },
            "allowSyntheticDefaultImports": true,
            "skipLibCheck": true,
            "declaration": false,
            "strictNullChecks": true,
            "importHelpers": true
          },
          "exclude": ["node_modules", "lib", "es", "dist", "example"]
        }`);
      }
    });
  } catch (e) {
    console.error('处理package.json失败，请重试', e.message);
    process.exit(1);
  }
};
exports.testFn = testFn;

let readmeFn = () => {
  return new Promise((resolve, reject) => {
    // 0.判断存不存在
    if (fs.existsSync(path.resolve(process.cwd(), 'README.md'))) {
      infolog(`README.md存在 | 请删掉它再重试。现在退出 `);
      
      resolve(`README.md存在 | 请删掉它再重试。现在退出 `)
      process.exit(1)
    }
    if (!fs.existsSync(path.resolve(process.cwd(), 'package.json'))) {
      infolog(`package.json不存在 | 请npm init -y。现在退出 `);
      resolve(`package.json不存在 | 请npm init -y。现在退出 `)
      process.exit(1)
    }

    
    // 1.读取写入
    const packageJsonStr = fs
      .readFileSync(path.resolve(process.cwd(), 'package.json'))
      .toString();

    let packageName = JSON.parse(packageJsonStr).name
    let packageVersion = JSON.parse(packageJsonStr).version
    let packageAuthor = JSON.parse(packageJsonStr).author
    let packageLabel = JSON.parse(packageJsonStr).label
    let packageLabelRes = ``
    
    for(let i in packageLabel){
      let text =`<a href=${packageLabel[i]["src"]}><img src="https://img.shields.io/static/v1?label=${packageLabel[i]["frontName"]}&message=${packageLabel[i]["behindName"]}&color=${packageLabel[i]["color"]}" alt="temp" /></a>`
      packageLabelRes = packageLabelRes+ text
    }


    if (
      !packageName || !packageVersion || !packageAuthor  
    ) {
      infolog(`请完善你package.json的 name,author,version 字段.现在退出`);
      resolve(`请完善你package.json的 name,author,version 字段.现在退出`)
    }

    // 2.写入开头
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'useChoices',
          pageSize: 20,
          message: '请选择你一个你喜欢的图标',
          choices: [
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
          ],
        },
      ])
      .then((paramater) => {
        console.log(paramater);
        

      //   <a href="">
      //   <img src="https://img.shields.io/npm/dm/frontmessageplugin.svg" />
      // </a>

        fs.writeFileSync(
          path.resolve(process.cwd(), 'README.md'),
          `
<div align="center"><h1>
<br/>
${paramater.useChoices}
<br />
${packageName}
<br />
<br />
</h1>
<sup>
<br />
<br />
<a href="">
<img src="https://img.shields.io/static/v1?label=version&message=v${packageVersion}&color=blue" alt="npm package" />
</a>${packageLabelRes}
<a href="">   
<img src="https://img.shields.io/static/v1?label=Author&message=${packageAuthor ? packageAuthor : "作者" }&color=yellow" alt="demos" />
</a>
<br />
</a>.
<br />
Translations: <a href="">🇨🇳 汉语</a>
</sup>
      `,
          function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
          }
        );


        resolve("执行成功")
        // 3.交给用户去选择
        // inquirer
        // .prompt([
        //   {
        //     type: 'checkbox',
        //     name: 'useChoices',
        //     pageSize: 20,
        //     message: '请选择你需要的章节',
        //     choices: [
        //       {
        //         name: 'QUICK START',
        //       },

        //       {
        //         name: 'Features',
        //       },
        //       {
        //         name: 'Developer',
        //       },
        //       {
        //         name: 'Usage',
        //       },
        //       {
        //         name: 'Quesion',
        //       },
        //       {
        //         name: 'Todo',
        //       },
        //       {
        //         name: 'Contributing',
        //       },
        //       {
        //         name: 'Support',
        //       },
        //     ],
        //   },
        // ])
        // .then((paramater) => {

        //   if (paramater['useChoices'].includes('README | 生成标准格式的README')) {
        //     readmeFn();
        //   }
        //   console.log(chalk.green('success！ README初始化成功') + '\n');
        // });

        // const mdStr = fs
        //   .readFileSync(path.resolve(process.cwd(), 'CHANGELOG.md'))
        //   .toString();

        // 2.组装 文件

        let resText = `

  
    `;

        // try {
        //   // 1.添加脚本命令

        //   fs.appendFileSync(path.resolve(process.cwd(), 'CHANGELOG.md'), resText);
        //   // 2.

        //   //2. 创造示例

        //   // 2.npm 安装 一下
        //   // execSync(`npm install jest@29 -D`);
        //   // execSync(`npm install ts-jest@29 -D`);
        //   // execSync(`npm install jest-environment-jsdom@29 -D`);

        //   successlog(
        //     'node  file/CICD/CHANGELOG/changeLogAdd.js执行成功 => 现在你的CHANGELOG.md上面添加了文件了'
        //   );
        //   execSync(`git add CHANGELOG.md`);
        // } catch (e) {
        //   console.error('处理package.json失败，请重试', e.message);
        //   process.exit(1);
        // }
      });
  });
};
exports.readmeFn = readmeFn;

const fs = require('fs');
const execSync = require('child_process').execSync;
const path = require('path');
const chalk = require('chalk'); // console.log 的 颜色

const infolog = (msg) => {
  console.log(chalk.grey(`frontengineerplugin - ${msg}`));
};
const successlog = (msg) => {
  console.log(chalk.green(`frontengineerplugin - ${msg}`));
};

//  处理添加husky
let gitFn = () => {
  if (fs.existsSync(path.resolve(process.cwd(), '.husky'))) {
    infolog(`.husky存在 | 现在 进行覆盖操作`);
  }
  const packageJsonStr = fs.readFileSync(path.resolve(process.cwd(), 'package.json')).toString();
  try {
    const packageJson = JSON.parse(packageJsonStr);
    if (packageJson.scripts['prepare']) {
      infolog('prepare script 重复 | 现在 进行覆盖操作');
    } else {
      packageJson.scripts['prepare'] = 'husky install ';
    }

    fs.writeFileSync(
      path.resolve(process.cwd(), 'package.json'),
      JSON.stringify(packageJson, null, '\t'),
    );
    execSync(`npm install husky@8.0.3 -D"`);
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
    execSync(`npm install eslint@7 -D"`);

    let originPath = path.resolve(__dirname, '..', 'file', 'eslint', '.eslintrc.js'); // 库文件
    let targetPath = path.resolve(process.cwd(), '.eslintrc.js'); // 写入工程文件
    fs.cp(originPath, targetPath, (err) => {
      if (err) {
        console.error(err);
      }
    });
    let originPathIgnore = path.resolve(__dirname, '..', 'file', 'eslint', '.eslintignore'); // 库文件
    let targetPathIgnore = path.resolve(process.cwd(), '.eslintignore'); // 写入工程文件
    fs.cp(originPathIgnore, targetPathIgnore, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog(
          `eslint脚本执行成功 => 如果你的vscode中没有安装eslint,那么需要您在vscode的扩展安装 eslint后重启项目`,
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
    execSync(`npm install prettier@2 -D"`);

    // fs.mkdirSync(`.husky`);
    let originPath = path.resolve(__dirname, '..', 'file', 'prettier', '.prettierrc.js'); // 库文件

    let targetPath = path.resolve(process.cwd(), '.prettierrc.js'); // 写入工程文件
    fs.cp(originPath, targetPath, (err) => {
      if (err) {
        console.error(err);
      } else {
        // successlog(`eslint执行成功-如果你的vscode中没有安装eslint,那么需要您在vscode的扩展安装 eslint后重启项目`)
      }
    });
    let originPathIgnore = path.resolve(__dirname, '..', 'file', 'prettier', '.prettierignore'); // 库文件

    let targetPathIgnore = path.resolve(process.cwd(), '.prettierignore'); // 写入工程文件
    fs.cp(originPathIgnore, targetPathIgnore, (err) => {
      if (err) {
        console.error(err);
      } else {
        successlog(`prettier脚本执行成功 => 如果你的vscode中没有安装prettier,那么需要您在vscode的扩展安装 prettier后重启项目。注意我们需要在vscode中 ctrl(command) + shift + p 搜索 format selection with 接着 点最下面的 configue default format  选择 prettier format`);
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
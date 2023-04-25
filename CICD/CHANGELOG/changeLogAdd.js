const execSync = require("child_process").execSync;
const path = require("path");
const fs = require("fs");

console.log("------------ CHANGELOG生成  ------------");
const chalk = require("chalk"); // console.log 的 颜色

const infolog = (msg) => {
  console.log(chalk.grey(`frontengineerplugin - ${msg}`));
};
const successlog = (msg) => {
  console.log(chalk.green(`frontengineerplugin - ${msg}`));
};

let date = new Date();
let time = [date.getFullYear(), date.getMonth(), date.getDay()];
let timeDay = [date.getHours(), date.getMinutes()];
let handleTime = time.join("/") + "  " + timeDay.join(":");

let arguments = process.argv.at(-1);
console.log(arguments);
let commitMsg = arguments;


// 是否自动增加版本号
let isAutoUpDate = true;


if(isAutoUpDate){
  const packageJsonStr = fs.readFileSync(path.resolve(process.cwd(), "package.json")).toString()
  try {
      const packageJson = JSON.parse(packageJsonStr)
      // 升级版本号
      const arr = packageJson.version.split('.')
      if (arr[2] < 9) {
          arr[2] = +arr[2] + 1
      } else if (arr[1] < 9) {
          arr[1] = +arr[1] + 1
          arr[2] = 0
      } else { 
          arr[0] = +arr[0] + 1
          arr[1] = 0
          arr[2] = 0 
      }
      const newVersion = arr.join('.')
      packageJson.version = newVersion
      fs.writeFileSync(path.resolve(process.cwd(), "package.json"), JSON.stringify(packageJson, null, '\t'))
      // add new package.json
      // execSync(`git add package.json`)
  } catch (e) {
      console.error('处理package.json失败，请重试', e.message);
      process.exit(1)
  }
}


let changeLogFn = (commitMsg, handleTime) => {
  // 0.判断存不存在
  if (fs.existsSync(path.resolve(process.cwd(), "CHANGELOG.md"))) {
    infolog(`CHANGELOG.md存在 | 现在 进行commit 日志 的 增加操作 `);
  } else {
    fs.writeFileSync(
      path.resolve(process.cwd(), "CHANGELOG.md"),
      "## CHANGELOG ",
      function (err) {
        if (err) throw err;
        console.log("File is created successfully.");
      }
    );
  }

  // 1.读取写入
  const packageJsonStr = fs
    .readFileSync(path.resolve(process.cwd(), "package.json"))
    .toString();
  const mdStr = fs
    .readFileSync(path.resolve(process.cwd(), "CHANGELOG.md"))
    .toString();

  // 2.组装 文件
  const ver = JSON.parse(packageJsonStr).version;
  let resText = `
## version:${ver}-commit:${handleTime} 
### ${commitMsg.split(":")[0]} 

${commitMsg.split(":")[1]}

  `;

  try {
    // 1.添加脚本命令

    fs.appendFileSync(path.resolve(process.cwd(), "CHANGELOG.md"), resText);
    // 2.

    //2. 创造示例

    // 2.npm 安装 一下
    // execSync(`npm install jest@29 -D`);
    // execSync(`npm install ts-jest@29 -D`);
    // execSync(`npm install jest-environment-jsdom@29 -D`);

    successlog(
      "cd .. && node  file/CICD/CHANGELOG/changeLogAdd.js执行成功 => 现在你的CHANGELOG.md上面添加了文件了"
    );
  } catch (e) {
    console.error("处理package.json失败，请重试", e.message);
    process.exit(1);
  }
};

changeLogFn(commitMsg, handleTime);

#!/usr/bin/env node

// 请在项目根路径下面使用

// Object.defineProperty(exports, "__esModule", { value: true });

const path = require('path');
const handleEvent = require(path.join(__dirname, 'util', 'handleEvent'));

const { program } = require('commander'); // 命令行
const inquirer = require('inquirer'); // 输入
const ora = require('ora'); // loading 效果
const chalk = require('chalk'); // console.log 的 颜色

// frontengineerplugin install husky prettier gitignore
const log = (msg) => console.log(`frontengineerplugin - ${msg}`);
let [, , cmd, ...args] = process.argv;

cmd = cmd.toLowerCase();
args.map((v) => {
  return v.toLowerCase();
});
//  第一种方式 ：命令行
const cmdGroup = {
  install: () => {
    if (args.includes('husky')) {
      handleEvent.gitFn();
    }
    if (args.includes('eslint')) {
      handleEvent.eslintFn();
    }
    if (args.includes('prettier')) {
      handleEvent.prettierFn();
    }
    if (args.includes('npm')) {
      handleEvent.npmFn();
    }
    if (args.includes('env')) {
      handleEvent.envFn();
    }
    if(args.includes("cicd")){
      handleEvent.CICDFn()
    }
    if(args.includes("cor")){
      handleEvent.corFn()
    }
  },
  gui: () => {
    guiFn({
      gitFn: handleEvent.gitFn,
      eslintFn: handleEvent.eslintFn,
      prettierFn: handleEvent.prettierFn,
      npmFn: handleEvent.npmFn,
      envFn: handleEvent.envFn,
      CICDFn:handleEvent.CICDFn,
      corFn:handleEvent.corFn
    });
  },
  ['-v']: () => {
    log(require(path.join(__dirname, 'package.json')).version);
  },
};

try {
  cmdGroup[cmd] ? cmdGroup[cmd]() : help(0);
} catch (e) {
  console.error(e instanceof Error ? `frontengineerplugin - ${e.message}` : e);
  process.exit(1);
}

// 第二种方式 ： 用户选择

function guiFn({ gitFn, prettierFn, eslintFn, npmFn, envFn,CICDFn,corFn ,testFn}) {
  let version = require(path.join(__dirname, 'package.json')).version;
  // console.log(version, '2');
  program
    .version(version)
    .command('gui')
    .description('Electrolux 的 工程化配置')
    .action((name) => {
      inquirer
        .prompt([
          {
            type: 'checkbox',
            name: 'useChoices',
            pageSize: 20,
            message: '前端工程化配置选项：',
            choices: [
              {
                name: 'git(husky) | 提交规范',
              },
              {
                name: 'prettier | 代码美化工具',
              },
              {
                name: 'eslint | 代码统一工具',
              },
              {
                name: 'npm_source | 代码源管理',
              },
              {
                name: 'test dev pro | 环境区分',
              },
              {
                name: 'CICD | 各种脚本示例',
              },
              {
                name: 'Test case | jest 通用测试用例',
              },
              {
                name: 'cors | nginx && express(写plugin的工具)',
              },
              
         
            ],
          },
        ])
        .then((paramater) => {
          //{ description: 'sss', author: 'dfd' }
          //   console.log(paramater);
          const spinner = ora('工程化配置中^.^ ' + '\n');
          spinner.start();
          // console.log(paramater['useChoices']);

          if (paramater['useChoices'].includes('prettier | 代码美化工具')) {
            prettierFn();
          }
          if (paramater['useChoices'].includes('eslint | 代码统一工具')) {
            eslintFn();
          }
          if (paramater['useChoices'].includes('npm_source | 代码源管理')) {
            npmFn();
          }
          if (paramater['useChoices'].includes('git(husky) | 提交规范')) {
            gitFn();
          }
          if (paramater['useChoices'].includes('test dev pro | 环境区分')) {
            envFn();
          }
          if (paramater['useChoices'].includes('CICD | 各种脚本示例')) {
            CICDFn();
          }
          if (paramater['useChoices'].includes('cors | nginx && express(写plugin的工具)')) {
            corFn();
          }

          if (paramater['useChoices'].includes('Test case | jest 通用测试用例')) {
            testFn();
          }
          //  spinner.fail(); spinner.succeed();
          spinner.succeed();
          console.log(chalk.green('success！ 项目初始化成功') + '\n');
        });
    });

  program.parse(process.argv); // 解析变量
}

// 0.写入json
/*
const packageJsonStr = fs.readFileSync('./package.json').toString()
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
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, '\t'))
    // add new package.json
    execSync(`git add package.json`)
} catch (e) {
    console.error('处理package.json失败，请重试', e.message);
    process.exit(1)
}
*/

// 1.复制
// if (fs.existsSync("test")) {
//     // 1.1 复制单个文件
//     fs.cp('./project.js', './test/te.js',()=>{

//     });

//     return
// } else {
//     //  1.2 { recursive: true } 加上这个就可以复制整一个目录
//     //  若 dest 目录不存在，则会自动创建（无论几级目录）；
//     fs.mkdirSync(`test`);
//     fs.cp('./', './test/',{ recursive: true }, (err) => {
//         if (err) {
//             console.error(err);
//         }
//     });

// }

// 2.删除

// child.exec('ls', function(err, sto) {
//     console.log(sto);//sto才是真正的输出，要不要打印到控制台，由你自己啊
// })

// 删除文件夹
// function deleteFolder(filePath,param) {
//     if(param.isDir==false){
//         fs.unlinkSync(filePath);
//         return
//     }
//     const files = []
//     if (fs.existsSync(filePath)) {
//       const files = fs.readdirSync(filePath)
//       files.forEach((file) => {
//         const nextFilePath = `${filePath}/${file}`
//         const states = fs.statSync(nextFilePath)
//         if (states.isDirectory()) {
//           //recurse
//           deleteFolder(nextFilePath)
//         } else {
//           //delete file
//           fs.unlinkSync(nextFilePath)
//         }
//       })
//       fs.rmdirSync(filePath)
//     }
//   }

//   deleteFolder("test.txt",{isDir:false})

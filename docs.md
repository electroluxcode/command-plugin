# 怎么写出element-plus类似的gz提交工具(cli)

之前给element-plus 提pr的时候，发现element-plus有一个npm run gz 用来规范和提示代码提交的信息 。由于我司的代码提交时type+scoped+message的方式，总是记不住type或者是scoped的值。受到启发于是写了这个npm cli 的 包。这个插件目前的功能有规范代码，更新版本和自动改变CHANGELOG。也能比较轻松的支持扩展



## step1:构建基础结构

- npm init -y

- npm install commander@9.5.0  inquirer@7.3.3 ora@4.1.1 typescript@5.2.2

- 新建tsconfig.json并且写入如下内容

  ```json
  {
    "compilerOptions": {
      "target": "es2022",
      "module": "esnext" /* Specify what module code is generated. */,
      "baseUrl": "./src" /* Specify the base directory to resolve non-relative module names. */,
      "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,
      "moduleResolution": "node",
      "strict": true /* Enable all strict type-checking options. */,
      "noImplicitAny": false /* Enable error reporting for expressions and declarations with an implied 'any' type. */,
      "noImplicitThis": false,
      "skipLibCheck": true /* Skip type checking all .d.ts files. */,
      "downlevelIteration": false
    },
  
    // "include": ["*.ts"],
    "exclude": ["node_modules", "*.d.ts"]
  }
  
  ```

- 项目目录结构如下

  ```ts
  │  .gitignore 
  │  build.sh // tsc --project ./ --watch
  │  CHANGELOG.md // 日志文件
  │  package.json 
  │  Project.ts // 插件入口
  │  README.md 
  │  tsconfig.json
  │  VersionUpdate.js 
  └─util
          ChangeLogAdd.ts // 功能1:改变CHANGELOG
          ColorConsole.ts // 工具函数1:输出不同的颜色
          HandleEvent.ts // 功能2:提交规范
          HandleEventParam.ts // 工具函数2:抽离的代码
          VersionUpdate.ts //功能3:version更新
  ```

  可以看出来项目结构比较简单

对了这里提一嘴，因为这个项目比较简单，只用到了简单的一些的ts然后也没有用到css之类的loader。这里暂时不用webpack之类的构建工具，当然如果需要加入也就是指定project.ts作为entry就可以了。

好的，我们可以先不用构建与我一样的项目结构，我们可以写一个ts然后试一下我们编译可不可以成功。新建 test.ts

```ts
let test:number = 23
export {}
```

然后运行

```ts
tsc --project ./ --watch
```

如果你的命令行没有报错的话，那么说明运行成功





## step2:package.json 的基本知识

我们要明白package.json各个字段的作用，name 字段就是 这个插件的名字。main字段就是 import * from "你的插件名字" 所引入的文件路径,type字段可以决定你是 module还是es6,。其中在我们的cli工具中**最最最最最最最最最**重要的是bin字段，这也是所有cli 工具能够运行的关键。



bin字段在使用者npm install `你的插件名字` 的时候，会让这个文件在node_modules/.bin 生成3个文件 分别是

- 你的插件名字.cmd
- 你的插件名字.ps1
- 你的插件名字

我们就可以 运行如下代码

```ts
你的插件名字 你想传入的参数
```

这就跟

```shell
vue create hello-world
create-react-app hello-world
```

这是一样的

在上面的例子中 vue 和 create-react-app 就是你的插件名字。然后vue create hello-world 和  create-react-app hello-world。就是你想传入的参数。

好的回到正题，如果我们 在 `bin` 字段 指定了 Project.js 文件，并且name 字段 设置成 command-plugin

在我们npm -g install 全局安装我们的包之后。那么 我们 就可以通过

>  command-plugin xxxx 来调用 Project.js 文件

也就是说 

> command-plugin xxxx  = node Project.js  xxxxxx

下面是我的package.json提交示例,下个章节我会跟大家演示怎么封装一个接收参数的示例

```json
{
	"name": "command-plugin",
	"bin": "Project.js",
	"type": "module",
	"scripts": {
		"deploy": "node VersionUpdate.js && npm publish"
	},
	"author": "Electrolux",
	"license": "ISC",
	"dependencies": {
		"command-plugin": "0.0.13",
		"commander": "^9.5.0",
		"inquirer": "^7.3.3",
		"ora": "^4.1.1",
		"typescript": "^5.2.2"
	},
	"devDependencies": {
		"@types/node": "^20.5.7",
		"eslint": "^7.32.0",
		"handlebars": "^4.7.7",
		"husky": "^8.0.3"
	}
}
```





## step3  入口文件编写

我们在step2 知道了 package.json 的基本用法和 cli 的示例

我们目前的文件架构是

```shell
│  package.json
│  Project.ts
│  tsconfig.json
```



现在我们来构建一下入口文件,核心就是读取 输入的参数 。主要用到 process.argv 方法来做，

project.ts

```ts
#!/usr/bin/env node

// 请在项目根路径下面使用
// Object.defineProperty(exports, "__esModule", { value: true });
import { program } from 'commander'; // 命令行
import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import { successlog, infolog } from "./util/ColorConsole.js";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let common = path.join(__dirname, 'util', 'handleEvent.js');
let temp = path.join(__dirname, 'package.json')
const ver = JSON.parse(fs.readFileSync(`${temp}`, 'utf8'));
function guiFn({ CommitFn,OtherFn }) {
    let version = ver.version;
    program.version("0.0.1").command('gui').description('xxxx').action((name) => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'useChoices',
                pageSize: 20,
                message: '前端工程化配置选项：',
                choices: [
                    "commit",
                    "other plugin"
                ],
            },
        ]).then(async (paramater) => {
            if (paramater['useChoices']=='commit') {
                // 你要执行的方法
                let res = await CommitFn();
            }
            if (paramater['useChoices']=="other plugin") {
                // 你要执行的方法
                let res = await OtherFn();
            }
            successlog('success! 项目初始化成功 - 使用请参考 ');
        });
    });
    program.parse(process.argv); // 解析变量
}

import(`file:///${common}`).then((handleEvent) => {
    const log = (msg) => console.log(`command-plugin - ${msg}`);
    let [, , cmd, ...args] = process.argv;
    if (!cmd) {
        log("script 中 添加 command-plugin gui 运行 | 或者直接运行 command-plugin gui ");
        process.exit(1);
    }
    cmd = cmd.toLowerCase();
    args.map((v) => {
        return v.toLowerCase();
    });
    const cmdGroup = {
        install: (args) => {
            if (args.includes('help')) {
                infolog(`版本:${ver.version}-command-plugin gui 启动`)
            }
        },
        gui: () => {
            guiFn({
                CommitFn: handleEvent.CommitFn,
                OtherFn:handleEvent.OtherFn
            });
        },
        ['-v']: () => {
            log(ver.version);
        },
    };
    try {
        cmdGroup[cmd] ? cmdGroup[cmd](args) : cmdGroup["-v"];
    }
    catch (e) {
        console.error(e instanceof Error ? `command-plugin - ${e.message}` : e);
        process.exit(1);
    }
    
});
```



我们可以看到我们cli 的核心方法其实在 try的 函数体里面 

```ts
 cmdGroup[cmd] ? cmdGroup[cmd](args) : cmdGroup["install"]("help");
```

我们在 输入了 command-plugin gui之后 我们会进入 guiFn方法中，在这里面我们可以选择 inquirer.prompt 指定的 两个choice 也就是 

```ts
  choices: [
      "commit",
      "other plugin"
  ]
```

然后简单进行判断，看看用户选择了啥方法执行对应的命令就可以了



 **既然都讲到这里了，那我顺便把一些容易混淆的点也讲一下把**

- process.argv 返回的第一个参数是 node.exe所在位置。第二个参数是 bin文件的绝对路径。第三个参数之后就是传入的参数  因此像是 vue-cli 之类的脚手架不难想象 他大概的代码是这样

  ```js
  let [, , cmd, ...args] = process.argv; // vue-cli create xxxx 这样
  ```

- 然后就是引入文件。这里你要注意你引入的工具函数文件 需要是 这个全局文件夹里面的文件，而不是你 执行目录的文件。这就要求你需要明白 path.join(__dirname,"xxx") 和 path.resolve(process.cwd(),"ddd") 的区别。前者是全局文件夹，后者是你的执行目录

- 剩下需要注意的是 fs 在我们的cli中 使用的非常频繁。为了避免意料之外的情况，我们最好用 类似 fs.writeFileSync的 同步方法

- 最后讲一下 commander 和 inquirer 吧，这是我们能够在不同选项中切换的关键。这部分有很多别的设置建议具体的可以去看一下官方的api文档.http://www.npmdoc.org/inquirerzhongwenwendanginquirer-jszhongwenjiaochengjiexi.html

  

  



## step4: gz提交工具

有了上面的知识，那么构建这样一个工具就非常简单了。首先我们先把基本的git type 和 scope类型定义一下。下面的文件是构建  inquirer 选项的工具

```ts
export interface CommitInquirerType {
  CommitType: Array<string>;
  CommitScope: Array<string>;
  CommitMessage: string,
  CommitVersion:boolean,
  CommitChangeLog:boolean
}

export function CommitInquiredParam() {
  let CommitType = [
    'feat', 'fix', 'to', 'docs', 'style',
    'refactor', 'perf', 'test', 'chore', 'revert',
    'merge', 'sync',
  ]
  let CommitScope = ['component',
    'view', 'api', 'store',
    'router', 'hook', 'directive', 'util', 'config', 'style',
    'mock', 'test', 'doc', 'type', 'deploy',]

  let res = [
    {
      type: 'list',
      name: 'CommitType',
      pageSize: 20,
      message: '请选择 commit 的 type',
      choices: CommitType,
    },
    {
      type: 'list',
      name: 'CommitScope',
      pageSize: 20,
      message: '请选择 commit 的 Scope',
      choices: CommitScope,
    },
    {
      type: 'input',
      name: 'CommitMessage',
      pageSize: 20,
      message: '请填写 commit 的 message',
    },
    {
      type: 'confirm',
      name: 'CommitVersion',
      default:false,
      message: '是否自增版本号',
    },
    {
      type: 'confirm',
      name: 'CommitChangeLog',
      default:false,
      message: '是否写入或者生成CHANGELOG',
    },
  ]
  return res
}
```



我们在step3 中 当用户 选择了 choices = "commit"。 之后 会进入 handleEvent.CommitFn。下面就是 handleEvent.CommitFn 方法的 全貌

```ts
let CommitFn = async () => {
  if (!fs.existsSync(path.resolve(process.cwd(), 'package.json'))) {
    infolog(`package.json不存在 | 请npm init -y后重试。现在退出 `);
    process.exit(1)
  }
  if (fs.existsSync(path.resolve(process.cwd(), 'commitlint.config.js'))) {
    errorlog("commitlint.config.js存在,请注意")
  }
  let res = await inquirer.prompt(CommitInquiredParam()) as CommitInquirerType 
  let CommitMsg =`${res.CommitType}(${res.CommitScope}): ${res.CommitMessage}`
  console.log("CommitMsg:",CommitMsg)
  if(res.CommitVersion){
    VersionUpdate()
  }
  if(res.CommitChangeLog){
    ChangeLogFn(CommitMsg)
  }
  execSync(`git commit -m "${CommitMsg}"`)
  let more = execSync('git config user.name').toString().trim();
  return 1
};
```

可以看到核心方法在于  

```ts
execSync(`git commit -m "${CommitMsg}"`)
```



最后讲一下 我上面使用的 infolog 。其实这是一个带颜色输出的指令.我用来替代chalk进行 传统输出。当然你这里用chalk也完全没问题。例如ora(加载样式)你也可以用

```ts
export const infolog = (msg) => {
    console.log(`\x1B[94m ${msg} \x1B[0m`);
};
export const successlog = (msg) => {
    console.log(`\x1B[92m ${msg} \x1B[0m`);
};

export const errorlog = (msg) => {
    console.log(`\x1B[91m ${msg} \x1B[0m`);
};
```



行文至此，这个工具也差不多构建好了，那么怎么测试呢。npm link 直接在这个目录创造软连接就可以了。然后

```shel
command-plugin gui
```

其他的功能类似于这样，这里就不做演示了



## step5: 发布脚手架

在 **package.json** 文件中

```sh
"scripts": {
  "deploy": "node VersionUpdate.js && npm publish"
},
```

对了 VersionUpdate.js 是可以自增版本号的脚本

代码如下

```js
import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { infolog } from "./util/ColorConsole.js";
function VersionUpdate() {
    try {
        infolog('------------ 升级package.json版本号  ------------');
        const packageJsonStr = fs.readFileSync(path.resolve(process.cwd(), "package.json")).toString();
        const packageJson = JSON.parse(packageJsonStr);
        // 升级版本号
        const arr = packageJson.version.split('.');
        if (arr[2] < 99) {
            arr[2] = +arr[2] + 1;
        }
        else if (arr[1] < 9) {
            arr[1] = +arr[1] + 1;
            arr[2] = 0;
        }
        else {
            arr[0] = +arr[0] + 1;
            arr[1] = 0;
            arr[2] = 0;
        }
        const newVersion = arr.join('.');
        packageJson.version = newVersion;
        console.log("newVersion:", newVersion);
        fs.writeFileSync(path.resolve(process.cwd(), "package.json"), JSON.stringify(packageJson, null, '\t'))
        execSync(`git add package.json`);
    }
    catch (e) {
        console.error('处理package.json失败，请重试', e.message);
        process.exit(1);
    }
}
VersionUpdate()

```

npm run deploy 发布后 。最后使用者通过 **npm i xxx -g** 下载就能用了。



示例地址:https://www.npmjs.com/package/command-plugin


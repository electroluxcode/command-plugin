#!/usr/bin/env node


// 请在项目根路径下面使用
//  调试
// 请在项目根路径下面使用
// Object.defineProperty(exports, "__esModule", { value: true });
import { program } from 'commander'; // 命令行
// @ts-ignore
import  inquirer from "inquirer";
// @ts-ignore
import  ora from "ora";
// @ts-ignore
import  path from "path";
// @ts-ignore
import  fs from "fs";
import { successlog, infolog } from "./util/ColorConsole.js";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let common = path.join(__dirname, 'util', 'handleEvent.js');

let temp = path.join(__dirname, 'package.json')

const ver = JSON.parse(fs.readFileSync(`${temp}`, 'utf8'));
import(`file:///${common}`).then((handleEvent) => {
    // command-plugin install husky prettier gitignore
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
    //  第一种方式 ：命令行
    const cmdGroup = {
        install: (args) => {
            if (args.includes('help')) {
                console.log("帮助:zzz");
            }
        },
        gui: () => {
            guiFn({
                readmeFn: handleEvent.readmeFn
            });
        },
        ['-v']: () => {
            log(ver.version);
        },
    };
    try {
        cmdGroup[cmd] ? cmdGroup[cmd](args) : cmdGroup["install"]("help");
    }
    catch (e) {
        console.error(e instanceof Error ? `command-plugin - ${e.message}` : e);
        process.exit(1);
    }
    // 第二种方式 ： 用户选择
    function guiFn({ readmeFn }) {
        let version = ver.version;
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
                            name: 'README | 生成标准格式的README',
                        },
                    ],
                },
            ])
                .then(async (paramater) => {
                //{ description: 'sss', author: 'dfd' }
                //   console.log(paramater);
                const spinner = ora('工程化配置中^.^ ' + '\n');
                spinner.start();
                // console.log(paramater['useChoices']);
                if (paramater['useChoices'].includes('README | 生成标准格式的README')) {
                    let res = await readmeFn();
                    successlog(res);
                }
                infolog(`package.json中可以添加如下字段
"label":[
  {
    "frontName": "Bili",
    "behindName": "Electrolux",
    "src": "https://space.bilibili.com/286773126",
    "color": "pink"
  }
]
`);
                // if (!fs.existsSync(path.resolve(process.cwd(), '.gitignore'))) {
                //     console.log(`.gitignore 不存在 | 自动帮你添加`);
                //     fs.writeFileSync(path.resolve(process.cwd(), '.gitignore'), JSON.stringify("node_modules", null, '\t'));
                // }
                //  spinner.fail(); spinner.succeed();
                spinner.succeed();
                successlog('success! 项目初始化成功 - 使用请参考 https://www.npmjs.com/package/command-plugin | https://gitee.com/electrolux/front-engineer-plugin');
            });
        });
        program.parse(process.argv); // 解析变量
    }
});


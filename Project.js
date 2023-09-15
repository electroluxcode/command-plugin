#!/usr/bin/env node
// 请在项目根路径下面使用
// Object.defineProperty(exports, "__esModule", { value: true });
import { program } from 'commander'; // 命令行
// @ts-ignore
import inquirer from "inquirer";
// @ts-ignore
import path from "path";
// @ts-ignore
import fs from "fs";
import { successlog, infolog } from "./util/ColorConsole.js";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let common = path.join(__dirname, 'util', 'handleEvent.js');
let temp = path.join(__dirname, 'package.json');
const ver = JSON.parse(fs.readFileSync(`${temp}`, 'utf8'));
function guiFn({ CommitFn, OtherFn }) {
    let version = ver.version;
    program.version(version).command('gui')
        .description('Electrolux 的 工程化配置')
        .action((name) => {
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
        ])
            .then(async (paramater) => {
            if (paramater['useChoices'] == 'commit') {
                let res = await CommitFn();
                // successlog(JSON.stringify(res));
            }
            if (paramater['useChoices'] == "other plugin") {
                let res = await OtherFn();
            }
            successlog('success! 项目初始化成功 - 使用请参考 https://www.npmjs.com/package/command-plugin | https://gitee.com/electrolux/front-engineer-plugin');
        });
    });
    program.parse(process.argv); // 解析变量
}
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
                infolog(`版本:${ver.version}-command-plugin gui 启动`);
            }
        },
        gui: () => {
            guiFn({
                CommitFn: handleEvent.CommitFn,
                OtherFn: handleEvent.OtherFn
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
});

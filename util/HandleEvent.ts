#!/usr/bin/env node
import { execSync } from "child_process";
// @ts-ignore
import path from "path";
// @ts-ignore
import fs from "fs";
import inquirer from 'inquirer'; // 输入33入

import { successlog, infolog, errorlog } from "./ColorConsole.js"
import {ChangeLogFn} from "./ChangeLogAdd.js"
import {VersionUpdate} from "./VersionUpdate.js"
import {CommitInquirerType,CommitInquiredParam} from "./HandleEventParam.js"
let OtherFn = async () => {
  errorlog("开发示例方法-现在退出")
  return
}

let CommitFn = async () => {
  if (!fs.existsSync(path.resolve(process.cwd(), 'package.json'))) {
    infolog(`package.json不存在 | 请npm init -y后重试。现在退出 `);
    process.exit(1)
  }
  if (fs.existsSync(path.resolve(process.cwd(), 'commitlint.config.js'))) {
    errorlog("commitlint.config.js存在,请注意")
    errorlog("注意 如果开头的commit 信息是 小写会报错。例如 git commit -m 'feat(router): ddd',改成feat(router): Ddd提交成功")
  }
  let res = await inquirer.prompt(CommitInquiredParam()) as CommitInquirerType 
  // console.log(res)
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

// {
//   type: 'checkbox',
//   name: 'useSelectText',
//   pageSize: 2,
//   message: '请选择你需要的章节',
//   choices: [
//     {
//       name: 'QUICK START',
//     },
//   ],
// },
export {
  CommitFn,
  OtherFn
}
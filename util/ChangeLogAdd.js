import { execSync } from "child_process";
// @ts-ignore
import path from "path";
// @ts-ignore
import fs from "fs";
import { successlog, infolog } from "./ColorConsole.js";
let ChangeLogFn = (commitMsg) => {
    let date = new Date();
    let time = [date.getFullYear(), date.getMonth(), date.getDay()];
    let timeDay = [date.getHours(), date.getMinutes()];
    let handleTime = time.join("/") + "  " + timeDay.join(":");
    // 0.判断存不存在
    if (fs.existsSync(path.resolve(process.cwd(), "CHANGELOG.md"))) {
        infolog(`CHANGELOG.md存在 | 现在 进行commit 日志 的 增加操作 `);
    }
    else {
        fs.writeFileSync(path.resolve(process.cwd(), "CHANGELOG.md"), `## CHANGELOG 
      
      `, function (err) {
            if (err)
                throw err;
            console.log("File is created successfully.");
        });
    }
    // 1.读取写入
    let username = execSync('git config user.name').toString().trim();
    const packageJsonStr = fs
        .readFileSync(path.resolve(process.cwd(), "package.json"))
        .toString();
    const mdStr = fs
        .readFileSync(path.resolve(process.cwd(), "CHANGELOG.md"))
        .toString().split('\n');
    // 2.组装 文件
    const ver = JSON.parse(packageJsonStr).version;
    let resText = `
## ver:${ver}-commit:${commitMsg.split(":")[0]}  

- 提交时间:${handleTime}
- 提交人:${username}
- 提交信息:${commitMsg.split(":")[0]}  ${commitMsg.split(":")[1]} 

`;
    try {
        mdStr.splice(2, 0, resText);
        fs.writeFileSync(path.resolve(process.cwd(), "CHANGELOG.md"), mdStr.join('\n'), 'utf8');
        execSync(`git add CHANGELOG.md`);
        successlog("CHANLOG脚本执行成功");
    }
    catch (e) {
        console.error("处理package.json失败,请重试", e);
        process.exit(1);
    }
};
export { ChangeLogFn };

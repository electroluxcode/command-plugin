"use strict";
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
console.log('------------ 自动升级package.json版本号  ------------');
const packageJsonStr = fs.readFileSync(path.resolve(process.cwd(), "package.json")).toString();
try {
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
    fs.writeFileSync(path.resolve(process.cwd(), "package.json"), JSON.stringify(packageJson, null, '\t'));
    // add new package.json
    execSync(`git add package.json`);
}
catch (e) {
    console.error('处理package.json失败，请重试', e.message);
    process.exit(1);
}
// export {}

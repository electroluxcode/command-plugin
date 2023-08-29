

import * as path from "path"
import * as fs from "fs"

import {successlog ,infolog} from "./util/ColorConsole.js"

function installInit() {
  successlog('安装成功,请运行npm run engineer');
}

installInit();
// exports.installInit = installInit;

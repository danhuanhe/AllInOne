/* eslint-disable no-console */
import glob from "glob";
import fs from "fs";
import path from "path";
import { chalkError, chalkWarning, chalkSuccess } from "./chalkConfig";
export const patchNeiPort = (neiKey, port) => {
  let projectRoot = path.resolve(__dirname, "../");
  let matched = glob.sync(`nei.*${neiKey}/server.config.js`, {
    cwd: projectRoot
  });
  if (matched.length !== 1) {
    console.log(chalkError("未匹配到NEI配置文件"));
    console.log("neikey:", neiKey);
    console.log("matched:", matched);
    return;
  }
  let neiConfigPath = path.resolve(projectRoot, matched[0]);
  fs.readFile(neiConfigPath, "utf8", (err, content) => {
    if (err) {
      console.log("modifyNeiPort Error", err);
      return;
    }
    content = content.toString();

    // 先查看原来的端口是不是一样的，不一样的话再修改
    let neiPortReg = /port:\s?(\d+)/g;
    let match = neiPortReg.exec(content);
    let modified = false;
    if (match && match[1] == port) {
      // 无需修改
    } else {
      content = content.replace(neiPortReg, "port: " + port);
      modified = true;
      console.log(chalkSuccess("[Patch] modified 'port'"));
    }

    {
      // 让nei不要监听node_modules,需要nei 3.7.5版本以上
      let ignoreSelector = /(\/\/)ignored:\s('\*\*\/\*\.css')/g;
      let neiIsTooOld = /ignored: ["']\/node_modules\|tools\|__dllCache__\/["']\s?,?/g;
      let match = ignoreSelector.exec(content);
      if (match) {
        ignoreSelector.lastIndex = -1;
        content = content.replace(ignoreSelector, substring => {
          return `ignored: /node_modules|tools|__dllCache__/,`;
        });
        modified = true;
        console.log(chalkSuccess("[Patch] modified 'ignored'"));
      } else if (neiIsTooOld.test(content)) {
        content = content.replace(neiIsTooOld, substring => {
          return `ignored: /node_modules|tools|__dllCache__/,`;
        });
        modified = true;
        console.log(chalkSuccess("[Patch] modified 'ignored'"));
        console.log(
          chalkWarning(
            "\n检测到NEI config中的正则表达式不正确，请升级nei至3.7.5版本以上!\n"
          )
        );
      }
    }

    if (modified) {
      fs.writeFile(neiConfigPath, content, "utf8", err => {
        if (err) console.log("error", err);
        console.log(chalkSuccess("[Patch] rewrite nei config Success"));
      });
    }
  });
};

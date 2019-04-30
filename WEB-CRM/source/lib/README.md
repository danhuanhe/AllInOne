# 云商服新技术架构下公共的业务组件仓库

- cubex 先知公共的业务组件
- qiyu 七鱼公共的业务组件


该业务组件仓库作为git子模块使用时，可以用npm run installCheck安装相应模块开启之后每次commit前的检查。主项目里可忽略对子模块的检查（新版本lint-staged会默认忽略检查子模块。而旧版本会对整个子模块所有文件检查，似乎是bug）。
（如果直接用npm install，会导致一些额外的模块被安装，比如ppfish，这时如果在主项目中import该仓库里某个组件，该组件又import了ppfish中某组件，此时import的就是该仓库安装的ppfish，其版本可能与主项目里的不一致，开发时可导致一些问题）



该业务组件仓库作为git子模块使用时，可用npm run checkVersion命令查看当前仓库下package.json中的dependencies与父仓库中的版本比较，当前仓库与父仓库不一致的版本会标为黄色。建议父仓库的版本与当前仓库相同，或大于当前仓库的版本。
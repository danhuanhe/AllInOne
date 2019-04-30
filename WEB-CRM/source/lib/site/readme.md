## 简介
用于展示组件demo及相关文档

## 使用
执行`npm start`开启本地服务，浏览器会自动打开localhost:8099

## 维护
- 组件文档在组件源码具体目录下维护，必须命名为doc.md
- doc.md同级可创建doc.js文件来承载一些额外信息，目前支持的属性有：
1. name: 组件名，即展示在左侧组件导航列表的名称；
2. deps: demo的依赖项，可用来引入mock数据或Button/input等辅助性的组件  
（具体写法可参考qiyu/Components/MsgList）

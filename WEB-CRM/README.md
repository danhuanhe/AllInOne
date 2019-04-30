# 云商服react & ppfish样板工程

React + ppfish starter kit / boilerplate with React.js、react-router、Redux、ppfish、WebPack、Less、Jest

## Features

- Babel with ES6
- Hot reloading
- Testing
- Linting
- Local mock server
- Working example app

## Initial Machine Setup

- Install [Node.js](https://nodejs.org/en/)
- （Optional）Install taobao NPM image

   ```bash
   $ npm install -g cnpm --registry=https://registry.npm.taobao.org
   ```
- (freemarker data mock require jdk & NEI)
  - Install [jdk](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
  - Setting JAVA_HOME,  types ```$JAVA_HOME/bin/java -version``` to check if install successfully
  ```
  $ npm install -g nei
  ```

## Get Started

  Install npm(or cnpm) package
  ```
  $ npm install
  ```
  
  Build or Update mock data from NEI，replace this_is_your_project_uuid with 1cd1d5dd82196a9c30f8568abb35353a for demo
  ```
  $ nei build -k this_is_your_project_uuid
  $ nei update -k this_is_your_project_uuid
  ```
  
  Start development in your default browser
  ```
  $ npm start
  ```
  
  Run the local mock service
  ```
  $ nei server
  ```

  Build scripts ``````and css etc.
  ```
  $ npm run build
  ```
  
  Start production in your default browser
  ```
  $ npm run open:dist
  ```
  
完整命令请查阅package.json

## Pages Demo

run npm start and open [Pages Demo](http://localhost:3000/setting/) on browser

## The directory structure

```
.
├── /api-mocks/               # 用于api的mock数据，便于开发调试
├── /coverage/                # 运行npm run test:cover输出的测试覆盖率文件
├── /dist/                    # 构建输出的文件会在这里
├── /docs/                    # 项目文档
├── /ftl-mocks/               # 用于ftl文件的同步mock数据，便于开发调试
├── /nei.xxxx/                # 运行nei build构建输出的文件, https://nei.netease.com/
├── /node_modules/            # 第三方类库和工具
├── /u/                       # 版本升级文件夹，从上一个版本升级至当前版本要做的操作
│ ├── /update.json            # 升级操作的声明，例如删除依赖或者将依赖版本修改为多少
├── /source/                  # 应用源码
│ ├── /actions/               # 通用的actions和actionTypes文件
│ ├── /assets/                # 可编译静态资源文件
│ ├── /components/            # React components
│ ├── /config/                # 环境变量配置文件
│ ├── /constants/             # 常量配置文件
│ ├── /data/                  # 提供lite database供mock数据使用
│ ├── /entries/               # 多页打包入口目录
│ ├── /middleware/            # 业务层中间件,处理日志、打点等公共业务逻辑
│ ├── /pages/                 # 页面入口文件
│ | ├── /App/                 # 页面目录
│ | | ├── /actions.js         # 页面actions
│ | | ├── /actionTypes.js     # 页面action类型
│ | | ├── /App.js             # 页面组件
│ | | ├── /App.test.js        # 页面组件单元测试文件
│ | | ├── /App.less           # 页面样式
│ | | ├── /index.js           # 页面对外暴露文件
│ | | ├── /rootReducer        # 页面reducer，视情况使用rootReducer文件或划分到reducer目录内
│ | | ├── /reducer/           # 页面reducer，视情况使用rootReducer文件或划分到reducer目录内
│ | | └── /view.js            # 页面视图
│ ├── /reducers/              # 通用的React reducers文件
│ ├── /store/                 # React Store
│ ├── /utils/                 # 工具函数
│ ├── /vendor/                # 不需要编译的静态资源文件，在生产环境可以使用publicPath路径引用
│ ├── /demo.html              # UI component demo
│ ├── /demo.js                # UI component demo
│ ├── /appRoutes.js           # URL 和本地模板文件的映射，用于路由跳转
│ └── /favicon.ico            # favicon
├── /tools/                   # 项目运行脚本
├── /views/                   # java freeMarker 文件
├── .boilerplate.json         # 脚手架版本信息，用于脚手架升级，请看ysf-cli
├── babel.config.js           # babel配置文件, https://babeljs.io/docs/usage/babelrc/
├── .editorconfig             # 代码风格配置文件, http://editorconfig.org
├── .eslintrc                 # eslint配置文件, http://eslint.cn/docs/user-guide/configuring
├── .eslintignore             # eslint配置文件, http://eslint.cn/docs/user-guide/configuring
├── .gitignore                # git配置文件, https://help.github.com/articles/ignoring-files/
├── .stylelintrc              # stylelint 配置文件
├── package.json              # 配置入口文件地址、依赖和 scripts
├── tsconfig.json             # Typescript 配置文件
├── postcss.config.js         # postcss配置文件, https://github.com/postcss/postcss-loader
├── webpack.config.dev.js     # webpack开发环境配置-项目自定义配置，可以随便修改
├── webpack.config.prod.js    # webpack生产环境配置-项目自定义配置，可以随便修改
├── webpack.merged.dev.js     # webpack开发环境配置-脚手架公共配置，不要改动
└── webpack.merged.prod.js    # webpack生产环境配置-脚手架公共配置，不要改动
```

## Coding styles
- javascript: use eslint:recommended, see https://eslint.org/docs/rules/ and .eslintrc file for more details
- directory、html、css、js: named using hump form
- react component and react container: named using hump form and uppercase characters at the beginning
- test file: named with Component + .test + .js format
- css: https://nsfi.github.io/blog/2017/12/06/Less%E4%BB%A3%E7%A0%81%E8%A7%84%E8%8C%83/

### 开发环境如何加快编译速度
- 开发环境使用filter进行文件编译，指定编译单个入口文件：
setting 为source/entries/目录下，入口目录名称。
```
 npm run open:src -- --filter=setting
```

### 开发环境Mock服务
- 使用NEI Mock服务
NEI Mock服务是默认配置的，详细请查看source code: tools/srcServer.js proxy(ajaxPrefix)这一行

- 使用json-server Mock服务
  - 什么时候使用json-server Mock服务
  
  json-server是一个支持REST API风格的接口规范的Mock server。最大的特定在于post提交的数据可以对Mock server上的数据做修改，
  下一次使用get请求数据时，返回的Mock 数据是经过修改的。这一点对于一些需要修改数据的业务场景下非常有用。
  
  - 如何使用json-server Mock服务
  
  tools/mock.js 使用json-server在本地运行Mock server，只需要使用```npm run start:mock```开启即可。
  将实际接口地址改成/db/api，本地server会将该前缀的请求代理到json-server Mock服务下。Mock数据在database-mocks中配置。
  json-server使用文档：https://github.com/typicode/json-server#example
  
## Links

- [ppfish](https://nsfi.github.io/ppfish-components/#/home)
- [react](https://github.com/facebook/react)
- [react-router](https://github.com/reactjs/react-router)
- [react-router-redux](https://github.com/reactjs/react-router-redux)
- [redux](https://github.com/reactjs/redux)
- [redux-devtools](https://github.com/gaearon/redux-devtools)
- [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor)
- [NEI](https://nei.netease.com/)
- [WebPack](http://webpack.github.io/docs/)
- [Less](https://github.com/less/less.js)
- [Jest](https://facebook.github.io/jest/)
- [enzyme](https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md)
- [debug](https://github.com/visionmedia/debug)


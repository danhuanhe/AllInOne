# 七鱼新技术架构下公共的业务组件仓库

对于一些公用的业务组件，譬如选择客服组，可能不同的项目中都会用到，为了解决不同工程项目中的通用业务组件的复用和维护，类似于这样的组件单独仓库管理，使用git子模块的功能引用到各个工程中。

## 目录划分
Components - 组件目录
utils - 工具函数

## 组件列表

- ReportKefuSelect 带客服分组的客服选择组件
- SpecInput 特殊内容的输入框，包括浮点数输入框FloatInput(两位小数),整数输入框IntInput
- EditCategoryModal 知识库五级分类编辑组件


## 组件可以使用的npm模块，详细请查看web-ai、web-statics等项目
- ppfish
- lodash
- debug
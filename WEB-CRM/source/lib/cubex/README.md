# 先知公共的业务组件仓库

对于一些公用的业务组件，譬如选择客服组，可能不同的项目中都会用到，为了解决不同工程项目中的通用业务组件的复用和维护，类似于这样的组件单独仓库管理，使用git子模块的功能引用到各个工程中。

## 目录划分
Components - 组件目录
utils - 工具函数

## 组件列表
- TreePane 
- AnimationImageLoader

## 组件依赖的第三方npm模块
- ppfish
- debug 
- classnames

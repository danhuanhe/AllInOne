### js代码规范遵循eslint:recommended和react/recommended
[eslint:recommended](http://eslint.cn/docs/rules/)
[react/recommended详细规则](https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules)

### 撸代码前准备事项：配置IDE的代码自动检查工具eslint
以webstorm为例，详细的见https://www.jetbrains.com/help/webstorm/eslint.html。
懒人看这里，摘录重点：WebStorm | Preferences | Languages and Frameworks | JavaScript | Code Quality Tools | ESLint for macOS 
配置完成后可以得到一个神器，右键菜单：Fix ESLint Problems。

### git hook pre-commit须知
由于前端项目和.git目录不在同一层级，pre-commit库存在问题：https://github.com/observing/pre-commit/issues/78。
目前解决方案是使用husky代替pre-commit作为git hook。

### babel-eslint常见错误和警告
- 使用分号，，eslint错误代码:
Missing semicolon                                               semi

- html属性使用双引号，eslint错误代码:
 Unexpected usage of singlequote                                jsx-quotes
 
- 使用react prop-types，eslint错误代码:
'xx' is missing in props validation                             react/prop-types

- jsx标签没有子节点时使用自闭合写法
Empty components are self-closing                               react/self-closing-comp

- 使用推荐的React组件方法书写顺序：
1. static methods and properties
2. lifecycle methods: displayName, propTypes, contextTypes, childContextTypes, mixins, statics,
defaultProps, constructor, getDefaultProps, getInitialState, state, getChildContext, 
componentWillMount, componentDidMount, componentWillReceiveProps, shouldComponentUpdate, componentWillUpdate, componentDidUpdate, componentWillUnmount (in this order).
3. custom methods
4. render method
getSiblings should be placed after componentWillUnmount         react/sort-comp

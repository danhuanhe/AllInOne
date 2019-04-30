# InfoTab  用户信息，咨询记录，iframe信息tab组件

## 基本使用


:::demo InfoTab
```js
  class App extends React.Component{
  
    constructor(props){
      super(props);
      
      this.state = {
        tabList: new Array(30).fill().map((item,index) => {return {key: 'key'+index, text: 'iframe'+index, url: 'https://www.baidu.com/'}})
      };
    };
    render() {
     return (
      <div className="component-demo">
        <InfoTab tabList={this.state.tabList} extraNode="排序"></InfoTab>
      </div>
     );
    }
  }
  
  ReactDOM.render(<App/>, mountNode);
```
:::


## API

| 属性      | 说明                  | 类型        | 默认值                   |
| --------- | --------------------- | ----------- | ------------------------ |
| tabList   | 数据列表              | Array       | -                        |
| extraNode | 操作按钮              | node/String | -                        |
| session   | 会话                  | object      | -                        |
| sortKey   | 排序localStorage的key | string      | YSF-CALLCENTER-TABS-SORT |
| from      | 来源                  | string      | qiyu-callcenter          |


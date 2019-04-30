# EditableText  可编辑的文本

## 基本使用


:::demo InfoTab
```js
  class App extends React.Component{
  
    constructor(props){
      super(props);
      
      this.state = {
        text: '文本文本文本'
      };
    };
    render() {
     return (
      <div className="component-demo">
        <EditableText text={this.state.text}></EditableText>
      </div>
     );
    }
  }
  
  ReactDOM.render(<App/>, mountNode);
```
:::


## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 文本 | String | - |
| onChange| 文本改变回调 | (text) => void | - |
| onBlur| 点击空白处回调 | (text) => void | - |

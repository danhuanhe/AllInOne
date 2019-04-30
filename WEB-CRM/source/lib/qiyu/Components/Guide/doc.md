# Guide 新手引导浮层

## 用在何处
Guide 浮层组件用于各个模块首次进入的时候弹出新手引导浮层。
Guide 负责首次进入页面弹出引导浮层，记录localStorage。再次进入页面，不会弹出，需要清缓存后刷新方可再次弹出浮层。
## 基本使用
:::demo Guide
```js
  class App extends React.Component{
  
    constructor(props){
      super(props);
      this.state = {
        visible: false
      }
    };
    handleOk = () => {
      alert('关闭浮层');
    }
    render() {
      // localstorage 字段
     const STORAGE_KEY_DETECT_COMBINE_GUIDE = 'DETECT_COMBINE_GUIDE';
     const CombineGuide = (
       <div>此处是引导内容，业务自行填写</div>
     );
     return (
      <div>
        <Guide
          origin = {STORAGE_KEY_DETECT_COMBINE_GUIDE}
          title = "什么是合并问题"
          content = {CombineGuide}
          onOk = {()=>this.handleOk()}
        />
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
| origin | 存入 localStorage 的字段 | String | - |
| title | 浮层展示 Title | String | - |
| content | 浮层内容 | ReactNode | - |
| onOk | 点击确认后的回调函数 | function | - |

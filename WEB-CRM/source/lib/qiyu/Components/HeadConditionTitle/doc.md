# HeadConditionTitle  

## 基本使用


:::demo HeadConditionTitle
```js
  class App extends React.Component{
  
    constructor(props){
      super(props);
    };

    render() {
     return (
      <div >
        <HeadConditionTitle 
        title="通用接口设置页面" 
        tips={[{
          title:"tips1",
          content:<span style={{backgroundColor:"gray"}}>Body</span>,
          image:"http://www.xxx.eee"
          }]}
        right={<div>HEAD</div>}/>
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
待补充

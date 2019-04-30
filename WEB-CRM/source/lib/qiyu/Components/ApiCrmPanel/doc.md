# ApiCrmPanel  七鱼接口crm显示面板

## 基本使用


:::demo ApiCrmPanel
```js
  class App extends React.Component{
  
    constructor(props){
      super(props);
    };

    render() {
     return (
      <div className="component-demo">
        <ApiCrmPanel data={[{"index":0,"key":"account","label":"账号","value":"zhangsan"},{"index":1,"key":"name","label":"姓名","value":"土豪","edit":true,"map":"real_name","href":"url"},{"index":2,"key":"phone","label":"手机","value":"13800000000","edit":true,"map":"mobile_phone","href":"url"},{"index":3,"key":"email","label":"EMail","value":"13800000000@163.com","edit":true,"map":"email","href":"url"},{"index":4,"key":"vip","label":"会员","value":[{"id":0,"name":"类型一"},{"id":1,"name":"类型三","check":true},{"id":2,"name":"类型二"}],"select":true}]}></ApiCrmPanel>
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
| data | 数据列表 | Array | - |
| onChange | 字段修改时回调 | ([{key,value}]) => void | - |

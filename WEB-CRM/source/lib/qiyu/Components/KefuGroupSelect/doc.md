# KefuGroupSelect 客服组选择组件

> 客服组选择组件，如果要选择到客服，请使用KefuSelect

## 基本使用


:::demo KefuGroupSelect
```js
  class App extends React.Component{
  
    constructor(props){
      super(props);
    };
    handleRequest = () =>{

      /*
        如果自己的组件需要展示对应id的客服组名称是什么（能拿到客服组id，但是不知道客服组名称，所以还得自己请求一次获取客服组的列表）
        可以直接用组件的静态方法
         return KefuGroupSelect.requestKefuGroup().then(response => {
          this.setState({
            kefuGroup: response.result,
          });
          return response.result
        })
      */


      if(!this.req){
        this.req = new Promise((res, rej) => {
          setTimeout(() => {
            res({
              code:200,
              result:[{
                id: 89578,
                isLeaf: 38498,
                leaders: [{IMtoken: "jKyEn4a8Hu", id: 90166, realname: "I3gM3b6VaD", nickname: "KxZflbsoDs", role: 2}],
                level: 72966,
                name: "uVuaoQqhfz",
                parentId: 89806,
                pinyin: "yNpdVvRnoU",
                staffCount: 0,
              }]});
          },3000)
        }).then(res=>res.result);
      }
      return this.req;
    }
    render() {
     return (
      <div className="component-demo">
        <KefuGroupSelect customRequest={this.handleRequest} optionBefore={[{key:1, text: '默认客服组'}]} onChange={(e) => console.log(e)}/>
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
| customRequest | 自定义请求方法，Promise返回结果是一个客服数组 | Promise<Array> | 默认值请看源码 |
| optionBefore| 自定义的选项 | Array\|null | - |
| value | 表单受控组件的value赋值 | number | - |
| onChange | 表单受控组件的onChange赋值 | (value : number) => void | - |
| defaultValue | 表单非受控组件的初始化值，只在constructor中使用 | number | - |

## 组件方法

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| KefuGroupSelect.requestKefuGroup | 组件暴露的静态方法，获取客服组 | () => Promise<Response> |
| value | 用于非受控组件时返回组件的value |  () => number |
| retry | 出错后重新获取数据 | () => void |

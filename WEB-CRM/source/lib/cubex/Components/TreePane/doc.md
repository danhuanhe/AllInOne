# TreePane 

TODO： 文档待更新

## 基本使用


:::demo TreePane
```js
  class App extends React.Component{
  
    constructor(props){
      super(props);
      this.state={
        data:[
          {
          text:"树形选择器面板一级",
          key:"leve1",
          values:[{
            key:"leve2",
            text:"二级",
            values:[{
            key:"leve3",
            text:"三级",
          },{
            key:"leve3-1",
            text:"三级",
          }]

          }]
        },
         {
          text:"树形选择器面板一级(没有values 子集)",
          key:"leve1-1",
          }
        ]
      }
    };

    render() {
     const {data} = this.state;
     return (
      <div className="component-demo">
        <TreePane defaultData={data}/>
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
| -- | -- | -- | -- |


## 组件方法

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| -- | -- | -- |

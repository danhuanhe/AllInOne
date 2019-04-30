# 用于嵌入Iframe的类。自定义iframe以及客服知识库中都有加载iframe

## 基本使用


:::demo Iframe
```js
  class App extends React.Component{
  
    constructor(props){
      super(props);
      
      this.state = {
          url: 'https://www.baidu.com'
      };
    };
    render() {
     return (
      <div className="component-demo">
            <Iframe src={this.state.url} listeners={{
                    'jump': (params) => {
                        postMessage({
                            method: 'onOpenUrl',
                            params
                        });
                    }
                }}>
            </Iframe>                       
    </div>
     );
    }
  }
  
  ReactDOM.render(<App/>, mountNode);
```
:::


## API

| 属性      | 说明                                                                          | 类型   | 默认值 |
| --------- | ----------------------------------------------------------------------------- | ------ | ------ |
| src       | iframe的url                                                                   | string | -      |
| listeners | 监听iframe内上报的事件                                                        | object | -      |
| message   | 发送到iframe内的消息。必须包含两个属性 method,params。 callback可选为回调函数 | object | -      |



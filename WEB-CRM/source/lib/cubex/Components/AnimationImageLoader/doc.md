# AnimationImageLoader 

把gif图片的每一帧放到一张图片里，从上往下开始

## 基本使用


:::demo AnimationImageLoader
```js
  class App extends React.Component{
  
    constructor(props){
      super(props);
    };

    render() {
     return (
     <div style={{margin:100}}>
          <AnimationImageLoader
            extraCls="u-nav-icon"
            src={'//ysf.nosdn.127.net/unanqvsjrxhnpwqrulcuumqxicpwsojh'}
            zoom={0.5}
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
| src | 图片地址 | String | - |
| zoom  | 缩放比例{0.5倍缩放，默认两倍图} | - | - |

# DropdownDatePicker
## 基本使用


:::demo DropdownDatePicker
```js
  class App extends React.Component{
  
    constructor(props){
      super(props);
    };

    render() {
     return (
      <div >
        <DropdownDatePicker />
        <br />
        <p>时间范围选择组件</p>
        <p>onError同ppfish 的DateRangePicker相同；仅当返回一个()=>Node 类型的函数时,这个函数会赋值给footer</p>
         <DropdownDatePicker.DropdownDateRangePicker  
            onError={(arrayOfTwoDate)=>()=><span style={{color:'red'}}>错误消息内容</span>} 
            maxDateRange={7} 
          />
        <p>不传onError时，保持默认行为</p>
         <DropdownDatePicker.DropdownDateRangePicker  
            maxDateRange={7} 
          />
      </div>
     );
    }
  }
  
  ReactDOM.render(<App/>, mountNode);
```
:::


## API

### DropdownDatePicker
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
待补充

### DropdownDatePicker.DropdownDateRangePicker  
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| maxDateRange|最大时间范围,ppfish已废弃，尽快迁移| `number` | 无 | 
| onError | 用户自定义判断错误的方法 ，仅当返回一个()=>Node 类型的函数时,这个函数会赋值给footer| `() => bool \| () => node \| undefined` | 无 |

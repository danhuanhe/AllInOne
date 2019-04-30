# NumberRangeSelect 数字范围筛选

## 基本使用

:::demo

```js
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            min: '',
            max: ''
        }
    }

    onChange = (ret) => {
        console.log(ret);
    }
    render() {
        const { min, max } = this.state;
        return ( 
            <div>
                <NumberRangeSelect
                    title="重复咨询"
                    dropdownTitle="重复咨询次数范围："
                    style={{width:'250px'}}
                    dropdownStyle={{width:'250px'}}
                    min={min}
                    max={max}
                    disabled={false}
                    onChange={this.onChange}
                >
                </NumberRangeSelect>
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
| title | 展示文案 | String | '全部' |
| dropdownTitle | dropdown提示文案 | String | '选择数字范围' |
| disabled | 是否禁用 | Boolean | false |
| style | 样式 | Object | - |
| dropdownStyle | dropdown样式 | Object | - |
| min | 最小值 | String | '' |
| max | 最大值 | String | '' |
| rangeLimit | 范围值上下限 | Object | { min, max } |
| onChange | 数字范围改变的回调 | ({ min, max }) => Void | - |
# TimeSectionSelect 时间范围筛选

## 基本使用

:::demo

```js
const Button = deps.Button;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minMinute: '',
            minSecond: '',
            maxMinute: '',
            maxSecond: ''
        }
    }

    onChange = (ret) => {
        this.setState({
            minMinute: ret.minMinute,
            minSecond: ret.minSecond,
            maxMinute: ret.maxMinute,
            maxSecond: ret.maxSecond
        })
    }
    reset = () => {
        this.setState({
            minMinute: '',
            minSecond: '',
            maxMinute: '',
            maxSecond: ''
        })
    }
    render() {
        const { minMinute, minSecond, maxMinute, maxSecond } = this.state;
        return ( 
            <div>
                <TimeSectionSelect
                    title="全部时长"
                    dropdownTitle="选择时长范围"
                    disabled={false}
                    onChange={this.onChange}
                    minMinute={minMinute}
                    minSecond={minSecond}
                    maxMinute={maxMinute}
                    maxSecond={maxSecond}
                >
                </TimeSectionSelect>
                <Button 
                    className="btn-reset"
                    type="primary"
                    onClick={this.reset}
                >Click me to reset</Button>
            </div>
        );
    }
}

ReactDOM.render(<App/>, mountNode);
```

```less
.btn-reset {
    margin-left: 10px;
}
```
:::

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 展示文案 | String | '全部时长' |
| dropdownTitle | dropdown提示文案 | String | '选择数字范围' |
| disabled | 是否禁用 | Boolean | false |
| style | 样式 | Object | - |
| minMinute | 最小时长分钟数 | String | '' |
| minSecond | 最小时长秒数 | String | '' |
| maxMinute | 最大时长分钟数 | String | ''
| maxSecond | 最大时长秒数 | String | ''
| onChange | 数字范围改变的回调 | ({ minMinute, minSecond, maxMinute, maxSecond }) => Void | - |
# SpecInput 特殊输入

## 整形

:::demo

```js
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: ''
        }
    }

    onInputChange = (changedValue) => {
        this.setState({
            num: changedValue
        })
    }
    render() {
        return ( 
            <div>
                <IntInput
                    value={this.state.num}
                    onChange={this.onInputChange}
                >
                </IntInput>
            </div>
        );
    }
}

ReactDOM.render(<App/>, mountNode);
```
:::

## 浮点

:::demo

```js
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: ''
        }
    }

    onInputChange = (changedValue) => {
        this.setState({
            num: changedValue
        })
    }
    render() {
        return ( 
            <div>
                <FloatInput
                    value={this.state.num}
                    onChange={this.onInputChange}
                >
                </FloatInput>
            </div>
        );
    }
}

ReactDOM.render(<App/>, mountNode);
```
:::
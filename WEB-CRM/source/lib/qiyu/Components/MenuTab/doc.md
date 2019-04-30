# MenuTab 横向导航tab

## 基本使用

:::demo

```js
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 'qiyu',
            tabs: [{
                key: 'qiyu',
                name: '七鱼',
                url: 'qiyu'
            }, {
                key: 'cubex',
                name: '先知',
                url: 'cubex'
            }]
        }
    }
    render() {
        const { selected, tabs } = this.state;
        return ( 
            <div>
                <MenuTab 
                    selected={selected}
                    tabs={tabs}
                >
                </MenuTab>
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


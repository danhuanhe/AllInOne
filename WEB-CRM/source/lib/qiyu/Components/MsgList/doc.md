# MsgList 消息列表

用于展示七鱼在线会话消息流

## 用在何处

- 当前会话-消息流
- 当前会话-用户信息-服务记录
- 留言-留言详情
- 留言-用户信息-服务记录
- 呼叫中心-通话记录-通话详情-服务记录
- 智能监控-会话详情
- 智能监控-用户信息-服务记录
- 历史会话-会话详情
- 历史会话-会话详情-用户信息-服务记录
- 质量检测-会话详情
- 质量检测-会话详情-用户信息-服务记录
- 工单中心-工单详情-咨询记录
- 客户中心-客户详情-服务记录
- 知识库-相似问法学习-用户显示问法-查看上下文
- 知识库-问题学习-查看会话记录
- 知识库-问题统计-未解决会话记录
- 知识库-问题统计-差评会话记录

## 基本使用

:::demo 消息列表
```js
const msgList = deps.msgList;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msgList: msgList
        }
    }
    msgEventHandler = (msg, ev) => {
        console.log(ev);
    }
    render() {
        return (
            <div className="component-demo">
                <MsgList
                    list={this.state.msgList}
                    showName={true}
                    hidePortrait={false}
                    msgEventHandler={this.msgEventHandler}
                ></MsgList>
            </div>
        );
    }
}

ReactDOM.render(<App/>, mountNode);
```

```less
.component-demo {
    width: 900px;
    padding: 0 20px;
    border: 1px solid #e6eaeb;
}
```
:::

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| list | 消息列表 | Array | - |
| showName | 是否显示客服和访客名 | Boolean | false |
| hidePortrait | 是否隐藏头像 | Boolean | false |
| msgEventHandler | 各类事件的处理函数 | Function | - |
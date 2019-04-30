# VoiceMsgList 语音转文本消息列表

用于展示七鱼呼叫语音转文本后的会话消息流

## 用在何处

- 机器人-知识运营-知识挖掘-问题学习-文本记录

## 基本使用

:::demo 语音转文本消息列表

```js
const ajaxData = {
  code: 200,
  message: "T51pzqj9wK",
  result: {
    user: {
      id: 123213,
      name: "用户昵称",
      logoUrl: ""
    },
    robot: {
      id: 12222,
      name: "机器人名称",
      logoUrl: ""
    },
    session: {
      id: 111111,
      direction: 1,
      startTime: 1500000000,
      endTime: 15000100000,
      closeReason: 0
    },
    msgs: [
      {
        id: 1111111,
        fromType: 0,
        content: "这是一条文本消息",
        createTime: 15000000100
      },
      {
        id: 2111111,
        fromType: 1,
        content: "我是考拉机器人，请问有什么可以帮您？",
        createTime: 15000000100
      },
      {
        id: 1111112,
        fromType: 0,
        content: "来一盘新疆大盘鸡",
        createTime: 15000000100
      },
      {
        id: 2111112,
        fromType: 1,
        content: "对不起，我不是服务生，没有",
        createTime: 15000000100
      },
      {
        id: 1111113,
        fromType: 0,
        content: "rg",
        createTime: 15000000100
      }
    ]
  }
};
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const data = ajaxData.result;
    return (
      <div className="component-demo">
        <VoiceMsgList
          {...data}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
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

| 属性            | 说明               | 类型     | 默认值 |
| --------------- | ------------------ | -------- | ------ |
| user            | 用户           | Object    | -      |
| robot            | 机器人           | Object    | -      |
| msgs            | 消息列表           | Array    | -      |
| session            | 会话信息           | Object    | -      |

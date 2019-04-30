# 在线会话详情

## 用在何处


## 基本使用

:::demo
```js
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            session: {
                "id": 14493750,
                "description": "444",
                "referrer": {
                    "title": "七鱼金融首页",
                    "url": "https://8.163.com/"
                },
                "status": 1,
                "startTime": 1546837276420,
                "closeTime": 1546837460022,
                "user": {
                    "id": 6155575,
                    "realname": "Guest6155575",
                    "mobile": "",
                    "email": "",
                    "yxId": "8d592826f1fdeda16804032136379526",
                    "foreignId": "考虑考虑",
                    "vipLevel": 0,
                    "card": 0,
                    "crmId": "5c32dd13bc3f3b7ffbdcea01",
                    "showInCrm": 1,
                    "leadsLevel": ""
                },
                "kefu": {
                    "id": 105280,
                    "username": "jnn",
                    "realname": "jnnn00000",
                    "nickname": "jnn000000000",
                    "role": 1,
                    "email": "",
                    "theme": 0,
                    "pinyin": "jnnn00000",
                    "portrait": "",
                    "onlineStatus": 0,
                    "isformal": 1,
                    "status": 1,
                    "maxSession": 10,
                    "rightStatus": 36015568519692160,
                    "skillScoreChat": 5,
                    "skillScoreIpcc": 5,
                    "callEnable": 1,
                    "subRoleId": 345491,
                    "userHttps": 0,
                    "imid": "070ff6f6be8205c5ada1d2f984df@kf@",
                    "imtoken": "5b08efbc556c47ad9ac4ff1aa1612550"
                },
                "category": {
                    "id": -100,
                    "name": "无效会话",
                    "path": "无效会话"
                },
                "userAgent": "Win32 - Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
                "platform": "WEB",
                "lastMessage": {
                    "id": "1546847808002",
                    "sid": 14493750,
                    "time": 1546837460022,
                    "flag": 1,
                    "type": "sys",
                    "isSysClose": true,
                    "isSysBegin": false,
                    "index": 2,
                    "content": "系统关闭"
                },
                "unread": 0,
                "address": "[中国, 浙江, 杭州, netease.com, 电信/联通/移动]",
                "foreignId": "5c32dd13bc3f3b7ffbdcea01",
                "vipLevel": 0,
                "fromType": 1,
                "foreign": {
                    "profile": [
                    {
                        "hidden": true,
                        "value": "48",
                        "key": "sdk_version"
                    }
                    ],
                    "hidden": {},
                    "disabled": {},
                    "thrdParam": {},
                    "userThrdParam": {},
                    "orderThrdParam": {}
                },
                "interaction": 0,
                "relatedSessionType": 1,
                "relatedSessionId": 14493749,
                "closeType": 2,
                "type": 0,
                "treatedTime": 0,
                "satisfaction": 0,
                "satisfactionType": 5,
                "satisfactionName": "未评价",
                "satisfactionRemarks": "",
                "qualityInfo": {
                    "inspectTime": 0,
                    "status": 0,
                    "totalScore": 0,
                    "isBan": 0
                },
                "warnCount": 1,
                "version": 48,
                "beginer": 1,
                "ender": 3,
                "inTime": 1546837276420,
                "visitTimes": 0,
                "reConsultTime": 0,
                "firstRespDuration": 0,
                "firstMsgTime": 0,
                "firstRespTime": 0,
                "sessionDuration": 183602,
                "queueDuration": 0,
                "sessionExt": {
                    "originPlatform": "直接访问",
                    "searchKey": "",
                    "area": "",
                    "landPage": "",
                    "ext": "",
                    "stickSwitch": 0,
                    "stickTime": 0,
                    "satisfyMsgCount": 0,
                    "unsatisfyMsgCount": 0,
                    "stickDuration": 0,
                    "landPageTitle": "",
                    "fromPage": "",
                    "fromPageTitle": "七鱼金融首页",
                    "staffLastestReadTime": 1546837277705,
                    "userLastestReadTime": 1546837276531
                },
                "cannotCallBack": false,
                "withdraw": 0,
                "foreignUser": {
                    "id": 6155575,
                    "realname": "Guest6155575",
                    "mobile": "",
                    "email": "",
                    "yxId": "8d592826f1fdeda16804032136379526",
                    "foreignId": "考虑考虑",
                    "vipLevel": 0,
                    "card": 0,
                    "crmId": "5c32dd13bc3f3b7ffbdcea01",
                    "showInCrm": 1,
                    "leadsLevel": ""
                },
                "matchFilter": true,
                "isFromMobile": false,
                "alarmDetail": {
                    "warnCount": 1,
                    "ignore": 1,
                    "alarmList": [
                    {
                        "key": null,
                        "value": 1,
                        "name": "会话超时",
                        "show": 0
                    }
                    ],
                    "sensitiveList": []
                },
                "userTags": [],
                "userTagMap": {
                    "0": {
                    "id": 0,
                    "name": "其他"
                    }
                }
            }
        }
    }
    onStatusChange = (ev) => {
        console.log(ev);
    }
    updateRemark = (ev) => {
        console.log('updateRemark', ev.target.value);
        this.setState({
            session: Object.assign(this.state.session, {
                description: 'www'
            })
        })
    }
    render() {
        return (
            <div className="component-demo">
                <OnlineSessionDetail
                    isLoading={this.state.isLoading}
                    session={this.state.session}
                    updateRemark={this.updateRemark}
                    onStatusChange={this.onStatusChange}
                ></OnlineSessionDetail>
            </div>
        );
    }
}

ReactDOM.render(<App/>, mountNode);
```

```less
.component-demo {
    padding: 0 20px;
    border: 1px solid #e6eaeb;
}
```
:::

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| session | 会话对象 | Object | - |
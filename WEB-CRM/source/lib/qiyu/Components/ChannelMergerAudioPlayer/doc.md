# ChannelMergerAudioPlayer 支持双通道混合的音频播放器

## 基本使用

:::demo

```js
class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return ( 
            <div>
                <ChannelMergerAudioPlayer
                    src="http://122.226.161.11/amobile.music.tc.qq.com/C400002xZgxW0MuaUG.m4a?guid=3362875200&vkey=13C42045C0A1F2819CCA1AF60D48701E1706201F42E2A58E0F33445EA845BB3ECD652822A8034063807C5DB6FBB69BEF43EB825FA431753F&uin=0&fromtag=66"
                    download={true}
                />
            </div>
        );
    }
}

ReactDOM.render(<App/>, mountNode);
```

```less
```
:::

## API
ChannelMergerAudioPlayer从AudioPlayer封装过来，API全部参照AudioPlayer

| 属性      | 说明    | 类型      | 默认值   |
|---------- |-------- |----------   |-------- |
| className | 设置类名 | String | '' |
| controlVolume | 是否需要手动控制音量 | Boolean | true |
| controlProgress | 是否需要手动控制播放进度 | Boolean | true |
| displayTime | 是否显示时间 | Boolean | true |
| download | 是否需要下载按钮 | Boolean | false |
| src |  音频元素的当前来源 | String | '' |
| title   | 鼠标hover之后展示的音频描述 | String | '' |

支持常用的H5 audio 标签属性和事件

| 属性      | 说明    | 类型      | 默认值   |
|---------- |-------- |----------   |-------- |
| autoPlay | 设置是否在加载完成后随即播放音频 | Boolean | false |
| loop | 设置音频是否应在结束时重新播放 | Boolean | false |
| muted | 设置音频是否静音 | Boolean | false |
| onAbort  | 当音频的加载已放弃时(如切换到其他资源)的回调  | 	(e) => Void  |  -  |
| onCanPlay  | 当浏览器能够开始播放音频时的回调    | 	(e) => Void   |  -  |
| onCanPlayThrough  | 当浏览器可在不因缓冲而停顿的情况下进行播放时的回调    | 	(e) => Void  | - |
| onEnded  | 当目前的播放列表已结束时的回调  | 	(e) => Void    |  -  |
| onError  | 当在音频加载期间发生错误时的回调    | 	(e) => Void   | - |
| onLoadedMetadata     | 当浏览器已加载音频的元数据时的回调   | 	(e) => Void  |   -   |
| onPause  | 当音频暂停时的回调  | 	(e) => Void   |  -  |
| onPlay  | 当音频已开始或不再暂停时的回调   |	(e) => Void   |  -  |
| onSeeked  | 当用户已移动/跳跃到音频中的新位置时的回调   | 	(e) => Void   | -  |
| preload  | 音频是否应该在页面加载后进行加载。 可选值有：`auto`指示一旦页面加载，则开始加载音频；`metadata`指示当页面加载后仅加载音频的元数据；`none` 指示页面加载后不应加载音频。 | Enum {'auto', 'metadata', 'none'} | 'metadata' |
| volume  | 设置音频的当前音量, 必须是介于 0.0 与 1.0 之间的数字。例如：1.0 是最高音量（默认）0.5 是一半音量 （50%）0.0 是静音  | Number |  1.0  |

其他H5 audio属性和事件配置参见 [H5 audio属性说明](http://www.w3school.com.cn/jsref/dom_obj_audio.asp)。


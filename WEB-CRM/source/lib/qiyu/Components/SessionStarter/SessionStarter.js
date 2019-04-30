import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getPlatform, canSessionRestart, iframeWrapper } from '../../utils';
import { Button } from 'ppfish';
import './SessionStarter.less';

const iframeWrapperInst = iframeWrapper(window.top);
const statusMap = {
    0: '发起会话', //可发起
    1: '正在发起', //正在发起
    2: '发起会话'  //不可发起
};
const infoMap = {
    'web': (
        <>
            <p>当前为网页端用户，需再次打开网站后才能收到新消息</p>
            <p>（若用户更换浏览器或清理浏览器记录则无法收到）</p>
        </>
    ),
    'android': '此用户为移动端用户，可点击发起会话按钮推送消息',
    'ios': '此用户为移动端用户，可点击发起会话按钮推送消息',
    'timeWx': '此用户为微信端用户，可点击发起会话按钮推送消息',
    'timeoutWx': '已超过48小时，无法主动发起会话',
    'open': '此用户为自定义消息接口用户，可点击发起会话按钮推送消息',
    'unknown': '无法主动发起会话',
    'unreach': '由于场景限制，无法主动发起会话',
    'timeWb': '此用户为微博端用户，可点击发起会话按钮推送消息',
    'timeoutWb': '已超过48小时，无法主动发起会话',
};

class SessionStarter extends Component {
    static propTypes = {
        session: PropTypes.object.isRequired,
        onStartSuccess: PropTypes.func
    }
    
    constructor(props) {
        super(props);
        const canStart = canSessionRestart(props.session);
        this.state = {
            status: canStart ? 0 : 2,
            timestamp: null
        }
    }

    componentDidMount() {
        iframeWrapperInst.addEventListener('startSessionResult', this.onStartResult);
    }

    componentWillUnmount() {
        iframeWrapperInst.removeEventListener('startSessionResult', this.onStartResult);
    }

    doStart = () => {
        const timestamp = + new Date();
        this.setState({
            status: 1,
            timestamp
        })
        iframeWrapperInst.postMessage({
            method: 'startSession',
            params: {
                session: this.props.session,
                timestamp
            }
        });
    }

    onStartResult = (res) => {
        // 时间戳用于识别回调来源
        if (res.timestamp && res.timestamp != this.state.timestamp) return;
        if (!res || res.last != this.props.session.id) return;
        switch (res.code) {
            // 成功
            case 200: 
                this.setState({
                    status: 0
                })
                this.props.onStartSuccess && this.props.onStartSuccess();
                break;
            // 正在会话中
            case 401: {
                this.setState({
                    status: 0
                })
                break;
            }
            // 会话不存在
            case 402:
            // 超过48小时
            case 403:
            // 会话已结束
            case 405: {
                this.setState({
                    status: 2
                })
                break;
            }
            default: {
                this.setState({
                    status: 0
                })
                break;
            }
        }
    }

    render() {
        const { session } = this.props;
        const platform = getPlatform(session);
        return (
            <div className="m-sessionStarter">
                <div className="info">{infoMap[platform]}</div>
                <Button 
                    style={{width:'100%'}}
                    disabled={this.state.status !== 0}
                    onClick={this.doStart}
                >{statusMap[this.state.status]}</Button>
            </div>
        )
    }
}

export default SessionStarter;
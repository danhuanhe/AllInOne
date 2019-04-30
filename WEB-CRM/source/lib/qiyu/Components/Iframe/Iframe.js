/**
 * 封装加载Iframe的组件。用于七鱼内嵌第三方的Iframe
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';

import './Iframe.less';

const modulePrefix = 'm-Iframe';

const callbacks = {};//缓存回调函数。当需要回调函数时，

class Iframe extends Component {

    static defaultProps = {
        src: '',
        listeners: {
            onload: () => {
                console.log('iframe:加载成功');
            }
        }
    }

    static propTypes = {
        src: PropTypes.string.isRequired,
        listeners: PropTypes.object,
        message: PropTypes.object//必须包含两个属性 method,params。 callback可选为回调函数
    }

    constructor(props) {

        super(props);
    }

    componentWillReceiveProps(nextProps) {
        //发送消息的逻辑还没有使用，没有测试过
        if (this.props.message != nextProps.message && nextProps.message && this.iframer) {

            const message = { ...nextProps.message };

            if (message.callback) {
                let _callbackMethod = Math.random().toString(36).substr(2); //生成一个随机字符串，用于作为回调函数的key，传到目标窗口。

                message.params = { ...message.params, '_cb': _callbackMethod };

                callbacks[_callbackMethod] = message.callback;
            }

            this.iframer.postMessage({
                method: message.method,
                params: message.params
            }, '*');
        }
    }

    componentDidMount() {
        window.addEventListener("message", (...rest) => {
            this.onMessage(...rest);
        });
    }
    componentWillUnmount() {
        window.removeEventListener("message", (...rest) => {
            this.onMessage(...rest);
        });
    }

    onLoad = (...rest) => {
        const { listeners: { onload } } = this.props;
        if (isFunction(onload)) onload.call(this, ...rest);
    }

    onMessage = ({ source, data = {} }) => {

        if (source !== this.iframer.contentWindow) return; //非本iframe窗口发过来的消息不处理

        const { listeners } = this.props;

        const callback = callbacks[data.method];
        const listener = listeners[data.method];
        const params = data.params;

        if (isFunction(callback)) { //该条通知是作为回调函数处理的

            callback.call(null, params, event.source);
            delete callbacks[data.method];

        } else if (isFunction(listener)) {
            listener.call(null, params, event.source);
        }
    }

    render() {
        const { src } = this.props;

        return (<iframe ref={f => this.iframer = f} frameBorder="0" allow="fullscreen;microphone" className={modulePrefix} src={src} onLoad={this.onLoad} />);

    }
}

export default Iframe;

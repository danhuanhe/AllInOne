import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getSys, getNav, userAgentFormat, isFromMobile } from '../../utils';
import './index.less';

const UserTerminalInfo = function({platform='web', userAgent, referrer, showText, iconMap }) {
    iconMap = {
        'h5': 'hx',
        'mobile': 'phonex',
        'pc': 'computerx',
        'wx': 'wechatx',
        'wx_ma': 'miniProgram',
        'wb': 'weibo',
        'open': 'connectorx',
        ...iconMap
    };
    let iconType, title, text;
    platform = platform.toLocaleLowerCase();
    switch (platform) {
        case 'web':
            if(isFromMobile(userAgent)) {
                platform ='h5';
            }else {
                platform ='pc';
            }
            title = userAgentFormat(userAgent || '未知平台');
            text = getSys(userAgent) + '-' + getNav(userAgent).split(' ')[0];
            break;
        case 'wx':
            title = userAgent || '来自微信';
            break;
        case 'wb':
            title = userAgent || '来自微博';
            break;
        case 'wx_ma':
            title = userAgent || '来自小程序';
            break;
        case 'open':
            title = '消息接口('+ userAgent + ')';
            break;    
        default:
            title = platform + ' ' + userAgent;
            if(referrer && referrer.appName) {
                title = referrer.appName + '-' + title;
            } 
            break;
    }

    return (
        <span className="u-terminal">
            <i 
                className={"u-icon iconfont icon-" + (iconMap[platform] || iconMap['mobile'])}
                title={title}
            ></i>
            {showText?
                <span title={title}>{text||title}</span>
                :null
            }
        </span>
    )
}

export default UserTerminalInfo;
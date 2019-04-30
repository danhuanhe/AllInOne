import React, { Component } from 'react';

// 高阶组件，暂时放这了
export const addPropsHOC = (WrappedComponent, props) => {
    return class extends Component {
        render() {
            return <WrappedComponent {...props} {...this.props}></WrappedComponent>;
        }
    }
}
/**
 * 头像url格式化
 * @param {string} url 
 */
export const formatPortrait = (url) => {
    if (!url) return '';
    if (url.indexOf('?') == -1) {
        url += '?';
    }
    url += '&imageView&thumbnail=76y76&axis=5';
    return url;
}

/**
 * 违禁词提示
 * @param  {Object} msgExt
 * @return {String} 
 */
export const formatTrashWords = (msgExt) => {
    var trashWords = msgExt.trashWords;
    if (msgExt.auditResult == 2) {
        var trashText = trashWords.join(',');
        var count = 0,
            max = 15;
        for (var i = 0, length = trashText.length; i < length; i++) {
            if (count > max) {
                trashText = trashText.slice(0, i) + '...';
                break;
            } else if (trashText[i] != ',') {
                count++;
            }
        }
        return '消息包含违禁词"' + trashText + '"，发送失败';
    } else {
        return '消息包含违禁信息，发送失败';
    }
};

/**
 * 过滤html标签
 * @param  {string} string 
 * @return {string} 
 */
export const filterTag = (string) => {
    var tagReg = /<\/?[^>]*>/g;
    return string.replace(tagReg, '');
};
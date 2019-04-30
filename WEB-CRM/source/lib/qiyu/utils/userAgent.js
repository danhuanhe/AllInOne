import UAParser from 'ua-parser-js';

let parser = new UAParser();

// 获取系统信息
export const getSys = function(str) {
    parser.setUA(str);
    let result = parser.getResult();
    let ret = ((result.os.name || '') + ' ' + (result.os.version || '')).trim();
    return ret || '未知系统';
};

// 获取浏览器信息
export const getNav = function (str) {
    parser.setUA(str);
    let result = parser.getResult();
    let ret = ((result.browser.name || '') + ' ' + (result.browser.version || '')).trim();
    return ret || '未知浏览器';
};

// 判断来自移动端
export const isFromMobile = function (str) {
    parser.setUA(str);
    let result = parser.getResult();
    let type = result.device.type;
    if (type && /(mobile|tablet|wearable)/gi.test(type)) {
        return true;
    }
    let os = (result.os.name || '').toLowerCase();
    if (os && /(android|ios)/gi.test(os)) {
        return true;
    }
    return false;
};

// 终端信息显示
export const userAgentFormat = function(str) {
    return getSys(str) + '-' + getNav(str);
};
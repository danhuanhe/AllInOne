/**
 * 根据会话获取访客终端信息
 * @param {Object} session
 * @return {String} 
 */
export const getPlatform = (session) => {
    let platform;
    // 特殊场景无法发起会话
    if (session.cannotCallBack) {
        return 'unreach';
    }
    switch (session.platform.toLowerCase()) {
        case 'wx': {
            if (new Date() - session.startTime <= 48 * 60 * 60 * 1000) {
                platform = 'timeWx';
            } else {
                platform = 'timeoutWx';
            }
            break;
        }
        case 'wx_ma': {
            if (new Date() - session.startTime <= 48 * 60 * 60 * 1000) {
                platform = 'timeWxProgram';
            } else {
                platform = 'timeoutWxProgram';
            }
            break;
        }
        case 'wb': {
            if (new Date() - session.startTime <= 48 * 60 * 60 * 1000) {
                platform = 'timeWb';
            } else {
                platform = 'timeoutWb';
            }
            break;
        }
        case 'open':
        case 'web':
        case 'android':
        case 'ios':
            platform = session.platform.toLowerCase();
            break;
        default:
            platform = 'unknown';
    }
    return platform;
};

/**
 * 判断会话是否可重新发起
 * @param {Object} session
 * @return {Bool}
 */
export const canSessionRestart = (session) => {
    return getPlatform(session).indexOf('timeout') === -1;
};
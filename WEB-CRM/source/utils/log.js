/* eslint-disable no-console */
/**
 * @module utils/log
 */
/**
 * @method 记录js error并发送到服务端日志服务器
 * @param message {String} 错误信息
 * @param source {String} 错误来源页面url
 * @param lineno {Number} 错误所在行号
 * @param colno {Number} 错误所在列号
 * @param error {Object} Error对象
 * @param error.message {String} 错误信息
 * @param error.stack {String} 错误堆栈
 */
export const logToServer = (message, source, lineno, colno, error) => {
  const logToServer = window.onerror;
  // 基于前端监控sdk在window.onerror绑定的事件处理函数，上报js error
  // sdk地址：'/source/vendor/js/lib/napm-web-min-1.1.6.js'
  if (typeof logToServer === 'function') {
    try {
      logToServer(message, source, lineno, colno, error);
    } catch (e) {
      console.error('React componentDidCatch error logToServer occur error');
    }
  }
};

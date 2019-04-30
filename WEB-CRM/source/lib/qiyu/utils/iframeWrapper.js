/**
 * 对postMessage的封装，用于窗口之间的通信。增加回调机制，消息发过去可以方便的添加回调
 */
import * as _ from 'lodash';

/**
 * 对iframe通信的封装，必须传递一个目标窗口进来才能正确使用
 * @param  {[type]} targetWin [description]
 * @return {[type]}           [description]
 */
export const iframeWrapper = (targetWin) => {

  if (!targetWin) {
    console.error('iframeWrapper封装没有提供目标窗口实例！');
    return;
  }

  const Callbacks = {}; //用于缓存回调函数
  const EventListerners = {}; //用于缓存addEventListener添加的，长期监听的事件处理函数
  /**
   * 开放两个接口出去
   * postMessage用于直接向目标窗口发送消息
   * addEventListener用于监听其它窗口发过来的消息
   * @type {Object}
   */
  const iframer = {
    /**
   * 向目标窗口发送消息，通知目标窗口处理某行为
   * @param  {[type]}   method   [description] 方法名
   * @param  {[type]}   params   [description] 传递的参数
   * @param  {Function} callback [description] 目标窗口处理完后的回调
   * @return {[type]}            [description]
   */
    postMessage: ({method, params, callback}) => {

      if (typeof callback === 'function') { //如果有回调函数的情况
        let _cb = Math.random().toString(36).substr(2); //生成一个随机字符串，用于作为回调函数的key，传到目标窗口。
        params = {
          ...params,
          _cb
        };
        Callbacks[_cb] = callback;
      }

      targetWin.postMessage({
        method,
        params
      }, '*');
    },
    /**
     * 添加一些函数，用于处理目标窗口发送过来的事件
     * @param {[type]} method [description]
     * @param {[type]} func   [description]
     */
    addEventListener: (method, func) => {
      EventListerners[method] = func;
    },
    /**
     * @param methods   用于批量添加函数，methods为Object  key为事件名，value为事件处理函数
     */
    addEventListeners: (methods) => {
      for (const event in methods) {
        if (methods.hasOwnProperty(event)) {
          EventListerners[event] = methods[event];
        }
      }
    },
    /**
     * 移除函数
     * @param {[type]} method [description]
     * @param {[type]} func   [description]
     */
    removeEventListener: (method, func) => {
      if(_.isString(method) && _.isFunction(func)) {
        delete EventListerners[method];
      }
    },
  };

  /**
   * 当前窗口添加事件处理函数
   * @type {[type]}
   */
  window.addEventListener('message', event => {

    if (event.source !== targetWin)
      return;

    let data = event.data || {};
    let callback = Callbacks[data.method];
    let listener = EventListerners[data.method];
    let params = data.params;

    if (typeof callback === 'function') { //该条通知是作为回调函数处理的
      callback(params, event.source);
      delete Callbacks[data.method];
    }

    if (typeof listener === 'function') {
      listener(params, event.source);
    }

  }, false);

  return iframer;
};

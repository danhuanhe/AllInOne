/**
 * @module utils/browser
 */
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).

/**
 * 获取浏览器IE版本
 * @method getInternetExplorerVersion
 * @author wushengzhu@corp.netease.com
 * @returns {number}
 */
export const getInternetExplorerVersion = () => {
  let rv = -1; // Return value assumes failure.
  if (navigator.appName === 'Microsoft Internet Explorer') {
    let ua = navigator.userAgent;
    let re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat(RegExp.$1);
  }
  return rv;
};

/**
 * 判断是否是webkit浏览器
 * @method isWebkit
 * @author wushengzhu@corp.netease.com
 * @returns {boolean}
 */
export const isWebkit = () => {
  const agent = navigator.userAgent.toLowerCase();
  const index = agent.indexOf('chrome/');
  const version = parseInt(agent.slice(index + 7, index + 9));
  return index > 0 && version >= 50;
};

/**
 * 用于获取提示文本，支持参数
 */
import * as message from '../constants';

/* Nano Templates - https://github.com/trix/nano */
function nano(template, data) {
  return template.replace(/\{([\w.]*)\}/g, function(str, key) {
    let keys = key.split("."), v = data[keys.shift()];
    for (let i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
    return (typeof v !== "undefined" && v !== null) ? v : "";
  });
}

export function nanoCompile(key, ...params) {
  return nano(message[key]||'',params);
}

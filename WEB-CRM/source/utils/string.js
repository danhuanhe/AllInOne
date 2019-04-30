/**
 * @module utils/string
 */

/**
 * 循环去除空格Trim操作
 * @method deepTrim
 * @author hzqingze@corp.netease.com
 * @param {object} obj
 */
export const deepTrim = (obj) => {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'string') {
        obj[prop] = obj[prop].trim();
      } else if (typeof obj[prop] === 'object') {
        deepTrim(obj[prop]);
      }
    }
  }
};

/**
 * 浅比较对象数组是否相同
 * @method shallowEqual
 * @author hzqingze@corp.netease.com
 * @description 不做深层比较
 * @param {object|array} objA -对象A
 * @param {object|array} objB -对象B
 * @returns {boolean} - 是否相同
 */
export const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true;
  }
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  // Test for A's keys different from B.
  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (let i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }
  return true;
};

/**
 * DOM节点HTML片段逆编码
 * @method decodeHTML
 * @author hzqingze@corp.netease.com
 * @param {node} htmlFragment
 * @returns {string} - 返回逆编码
 */
export const decodeHTML = (htmlFragment) => {
  let temp = document.createElement("div");
  temp.innerHTML = htmlFragment;
  let output = temp.innerText || temp.textContent;
  temp = null;
  return output;
};


/**
 * 类型判断
 * @method isType
 * @example
 * isType('object', {})
 * isType('array', [])
 * @param {string} type - 类型
 * @param {*} target - 目标
 * @returns {boolean}
 */
export const isType = (type, target) => {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === type.toLowerCase();
};

export const deepClone = (obj) => {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

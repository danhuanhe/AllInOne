import * as _ from 'lodash';
import {emojiMap} from '../config';

/**
 * 替换非数字为--
 * @param value
 * @returns {String}
 */
export const formatNonNumber = (value) => {
  if ( typeof value === 'number' ) {
    return value;
  }
  if ( typeof value === 'string' && !isNaN(value) ) {
    return value;
  }
  return '--';
};

/**
 * @method 是否百分比数字
 * @param value
 * @returns {boolean}
 */
const isPercentage = (value) => {
  return /%$/.test(value)
};

/**
 * @method 转换为百分比数字， 0.89 => 89%
 * @param value
 * @returns {*}
 */
export const formatToPercentage = (value, digits = 2) => {
  if ( isPercentage(value) ) {
    return value;
  }
  if ( typeof value === 'number' ) {
    return (value * 100).toFixed(digits) + '%';
  }
  if ( typeof value === 'string' && !isNaN(value) ) {
    return (value * 100).toFixed(digits) + '%';
  }
  return '--';
};
const regKeyword = /([.*+?^=!:${}()|[\]\/\\])/g;
/**
* 富文本内容替换
* @param  {string} string
* @return {string}
*/
export const replaceRich = (string) => {
  if(!_.isString(string)) return '';
  const imgReg = /<img[^>]+>/g;
  string = string.replace(imgReg, '[图片]');
  const tagReg = /<\/?[^>]*>/g;
  string = string.replace(tagReg, '');
  return string;
};

/**
 * 使得a标签点击跳转新页面
 */
export const disableATag = (string) => {
  if(!_.isString(string)) return '';
  string = string.replace(/<a/g,"<a target='_blank'");
  return string;
};

/**
 * 使用dangerouslySetInnerHTML插入的纯文本，先将含有 < 或 > 转义
 * @param {string} text
 */
export const formatTextWithTags = (text) => {
  if(!_.isString(text)) return '';
  if(text.indexOf('<') > -1 || text.indexOf('>') > -1) {
    text =  text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  return text;
};

/**
 * 高亮搜索纯文本字段, 用于高亮 innerHTML 里面
 * @param {*} str
 * @param {*} keyword
 */
export const highlightKeyword = (str, keyword) => {
  if(!_.isString(str)) return '';

  try { //当key含有正则的统配符号，但又非法时，会抛异常
    //替换正则元字符
    if (keyword && str) {
      //搜索关键词含有 < 或 > 需先转义
      if(keyword.indexOf('<') > -1 || keyword.indexOf('>') > -1) {
        keyword =  keyword.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      let reg = new RegExp(keyword.replace(regKeyword, "\\$&"), 'ig');
      //被高亮的文本含有 < 或 > 需先转义
      if(str.indexOf('<') > -1 || str.indexOf('>') > -1) {
        str =  str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      str = str.replace(reg, function(a) {
        //关键字使用mark标签包裹，用于高亮显示
        return '<mark style="background:initial;color:#ed5f5f;padding:0;margin:0">' + a + '</mark>';
      });
    } else if (!keyword) {
      // 搜索关键字为空
      str = formatTextWithTags(str);
    }
  }
  catch (error) {}
  // 将被高亮文本转义
  return str;
};

/**
 * 高亮搜索HTML字符串中纯文本节点匹配的关键词
 * @param {string} str
 * @param {string} keyword
 */
export const highlightKeywordWithHTML = (str, keyword) => {
  if(!_.isString(str)) return '';

  try { //当key含有正则的统配符号，但又非法时，会抛异常
    //替换正则元字符
    if (keyword && str) {
      let strDOM = document.createElement('div');
      strDOM.innerHTML = str;
      str = highlightHTMLStr(highlightTextNode(strDOM.childNodes, keyword));
    }
  }
  catch (error) {}
  return str;
};

/**
 * 高亮纯文本节点匹配的搜索关键词
 * @param {array} nodeArr
 * @param {string} keyword
 */
export const highlightTextNode = (nodeArr, keyword) => {
  nodeArr.forEach(node => {
    if(node.childNodes.length) {
      highlightTextNode(node.childNodes, keyword);
    } else {
      if(node.nodeType === 3 && node.data) {
        let copyNodeData = node.data;
        //文本内容若含有 < 或 > 需先转义，防止被当成html标签处理
        copyNodeData = copyNodeData.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        //搜索关键词含有 < 或 > 需先转义
        if(keyword.indexOf('<') > -1 || keyword.indexOf('>') > -1) {
          keyword =  keyword.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        let reg = new RegExp(keyword.replace(regKeyword, "\\$&"), 'ig');

        //纯文本节点含有搜索关键词
        if(reg.test(copyNodeData)) {
          let newNode = copyNodeData.replace(reg, function(a) {
            return '<mark style="background:initial;color:#ed5f5f;padding:0;margin:0">' + a + '</mark>';
          });
          let spanDOM = document.createElement('span');
          spanDOM.innerHTML = newNode;
          node.parentNode.replaceChild(spanDOM, node);
        }
      }
    }
  });
  return nodeArr;
};

/**
 * 将DOM节点数组拼凑成HTML字符串
 * @param {array} nodeListArr
 */
export const highlightHTMLStr = (nodeListArr) => {
  let html = Array.prototype.reduce.call(nodeListArr, function(html, node) {
    return html + ( node.outerHTML || node.nodeValue );
  }, "");
  return html;
};

/**
 * 使得转人工a标签点击无效
 */
export const disableApplyHumanStaff = (string) => {
  if(!_.isString(string)) return '';
  // eslint-disable-next-line max-len
  string = string.replace(/href="qiyu:\/\/action\.qiyukf\.com\?command=applyHumanStaff"/g,'href=\"javascript:;\"');
  return string;
};

/**
 * 文本转表情
 */
export const text2emoji = (() => {
  const reg = /(\[[^\]]+\])/ig;
  const { protocol, hostname } = window.location;
  const urlPrefix = protocol + '//' + hostname.split('.').slice(1).join('.') + '/sdk/res/portrait/emoji/';
  const getImgHTML = function (obj) {
    let img = '<img class="portrait_icon" data-id="' + obj.id +
      '" src="' + obj.src +
      '" title="' + obj.tag +
      '" alt="' + obj.tag + '">';
    return img;
  };
  return (string, customEmojiMap) => {
    if (!_.isString(string)) return '';
    const pmap = emojiMap.pmap;
    const pmap2 = emojiMap.pmap2;
    let html = string.replace(reg, function (all, $1) {
      if (pmap2[$1]) {
        let img = getImgHTML({
          id: pmap2[$1],
          tag: $1,
          src: urlPrefix + pmap[pmap2[$1]].file
        });
        return img;
      } else if(customEmojiMap && customEmojiMap.length) {
        const ret = customEmojiMap.find((item) => {
          return item.tag === $1;
        })
        if(ret) {
          return getImgHTML({
            id: $1,
            tag: $1,
            src: ret.url
          })
        }else {
          return $1;
        }
      } else {
        return $1;
      }
    });
    return html;
  };
})();

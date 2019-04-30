import React from 'react';
import PropTypes from 'prop-types';

/**
 * 关键字匹配高亮
 * @param {[type]} str     [description]要匹配的源字符串
 * @param {[type]} keyword [description]匹配的关键字
 * //关键字使用mark标签包裹，用于高亮显示。username:'abcabc' keyword:'a' => '<mark>a</mark>bc<mark>a</mark>bc'
 */
const Marker = ({str, keyword}) => (<span dangerouslySetInnerHTML={{
    __html: string2marker(str, keyword)
  }}></span>);

Marker.propTypes = {
  str: PropTypes.string,
  keyword: PropTypes.string
};

/**
 * 高亮显示文本
 * 替换成mark包裹的html
 */
const string2marker = function(str, keyword) {
  try { //当key含有正则的统配符号，但又非法时，会抛异常
    //替换正则元字符
    if (keyword && str)
      str = str.replace(new RegExp(keyword.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$&"), 'ig'), function(a) {
        //关键字使用mark标签包裹，用于高亮显示。username:'abcabc' keyword:'a' => '<mark>a</mark>bc<mark>a</mark>bc'
        return '<mark style="background:initial;color:#ed5f5f;padding:0;margin:0">' + a + '</mark>';
      });
    }
  catch (error) {}

  return str;
}

export default Marker;

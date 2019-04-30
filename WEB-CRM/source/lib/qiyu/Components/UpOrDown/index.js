/**
 * 涨跌箭头组件
 */

import React from 'react';
import PropTypes from 'prop-types';

import './index.less';

const modulePrefix = 'm-upOrDown';

export default function UpOrDown ({
  value,
  text,
  title,
  className = '',
  style,
  upIconStyle,
  downIconStyle,
}) {
  return (
    <span className={`${modulePrefix} ${className}`} style={style} title={title || text || value}>
      {text || value}
      <div className={`${modulePrefix}-icon`}>
        {value > 0 && <i className="iconfont icon-sort-up" style={upIconStyle}/>}
        {value < 0 && <i className="iconfont icon-sort-down" style={downIconStyle}/>}
      </div>
    </span>
  );
}

UpOrDown.propTypes = {
  value: PropTypes.number.isRequired, // 要判断的数值
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // 要展示的文字，若无该值，则展示value的值
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  upIconStyle: PropTypes.object, // 上涨箭头样式，比如颜色什么的
  downIconStyle: PropTypes.object, // 下跌
};

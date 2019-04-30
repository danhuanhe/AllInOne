import React, {Component} from 'react';
import {Tooltip} from 'ppfish';
import PropTypes from 'prop-types';

import './index.less';

const modulePrefix = 'm-Sorters';

const Sorters = ({
  layout = [],
  gap = '10px',
  className,
  onClickTop,
  // onClickBottom,
  onClickUp,
  onClickDown,
  topText = '置顶',
  upText = '上移',
  downText = '下移',
}) => (
  <div className={`${modulePrefix} ${className}`}>
    {layout.map((type, i) => {
      let style = {width: '16px'};
      if (i > 0) {
        style.marginLeft = gap;
      }
      if (type === 'empty') {
        return <div key={i} style={style} />;
      }
      if (type === 'top') {
        return (
          <div key={i} style={style}>
            <Tooltip placement="bottom" title={topText}>
              <i className="iconfont icon-toppingx" onClick={onClickTop} />
            </Tooltip>
          </div>
        );
      }
      // if (type === 'bottom') {
      //   return <div key={i}><i className="iconfont icon-stick-bottom" onClick={onClickBottom} /></div>;
      // }
      if (type === 'up') {
        return (
          <div key={i} style={style}>
            <Tooltip placement="bottom" title={upText}>
              <i className="iconfont icon-arrow-upx" onClick={onClickUp} />
            </Tooltip>
          </div>
        );
      }
      if (type === 'down') {
        return (
          <div key={i} style={style}>
            <Tooltip placement="bottom" title={downText}>
              <i className="iconfont icon-arrow-downx" onClick={onClickDown} />
            </Tooltip>
          </div>
        );
      }
    })}
  </div>
);

Sorters.propTypes = {
  /**
   * layout控制显示什么，如['top', 'up', 'down']表示从左到右依次显示置顶、上移、下移图标。
   * empty表示空出一个位置，如['empty', 'up']表示最左侧先空出一个位置，然后显示上移
   */
  layout: PropTypes.arrayOf(PropTypes.oneOf(['top', 'up', 'down', 'empty'])).isRequired,
  gap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // icon之间的间距
  className: PropTypes.string,
  onClickTop: PropTypes.func,
  onClickUp: PropTypes.func,
  onClickDown: PropTypes.func,
  topText: PropTypes.node,
  upText: PropTypes.node,
  downText: PropTypes.node,
};

export default Sorters;

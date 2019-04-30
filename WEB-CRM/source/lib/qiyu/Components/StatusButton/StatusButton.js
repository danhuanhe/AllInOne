/**
 * 基于ppfish的Button组件，共四种状态：
 * normal：正常状态
 * loading：加载状态，文字左侧会显示加载动画
 * success：加载/操作成功时的状态，文字左侧显示√。（需在外部控制数秒后回到normal状态）
 * error：加载/操作失败时的状态，文字右侧侧显示×。（同上）
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'ppfish';

export default function StatusButton ({
  normalTxt = '',
  loadingTxt = '',
  successTxt = '',
  errorTxt = '',
  status = 'normal',
  ...others
}) {
  let content = normalTxt;
  if (status === 'loading') content = loadingTxt;
  else if (status === 'success') {
    content = <span><i className="iconfont icon-correct" style={{marginRight: '5px'}} />{successTxt}</span>;
  }
  else if (status === 'error') {
    content = <span><i className="iconfont icon-wrong" style={{marginRight: '5px'}} />{errorTxt}</span>;
  }
  return (
    <Button
      loading={status === 'loading'}
      {...others}
    >
      {content}
    </Button>
  );
}

StatusButton.propTypes = {
  normalTxt: PropTypes.string, // status === 'normal'时展示的文字
  loadingTxt: PropTypes.string, // status === 'loading'时展示的文字
  successTxt: PropTypes.string, // status === 'success'时展示的文字
  errorTxt: PropTypes.string, // status === 'error'时展示的文字
  status: PropTypes.string, // button状态，normal、loading、success、error
  // 其它属性与ppfish的Button一致
};

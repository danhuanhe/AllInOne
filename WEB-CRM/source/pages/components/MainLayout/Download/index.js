import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import "./index.less";

class Download extends PureComponent {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="ctner">
        <div className="empty-status">
        </div>
        <div className="notify-tip">
          <label className="tip-content">导出记录将保存7天，7天后自动删除</label>
          <a className="tip-confirm" href="#">知道了</a>
        </div>
      </div>
    );
  }
}

export default Download;

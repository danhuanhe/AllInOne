import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isWebkit } from '../utils';
import googleChromeSrc from '../assets/image/google.png';
import './Notice.less';

export default class Notice extends Component {
  static propTypes = {
  };
  constructor(props) {
    super(props);
    this.handleCloseNotice = this.handleCloseNotice.bind(this);
  }

  handleCloseNotice() {
    const notice = this.refs.notice;
    notice.style.display = 'none';
  }

  render() {
    const isMac = (navigator.platform.toLowerCase().indexOf('mac') === 0 );
    const googlechrome = isMac ? 'http://ysf.nosdn.127.net/googlechrome.dmg' : 'http://ysf.nosdn.127.net/ChromeStandaloneSetup.exe';
    if ( !isWebkit() ) {
      return (
        <div className="full-notice" ref="notice">
          <p className="clearfix full-notice-bd">
            当前浏览器无法获得最佳显示效果，推荐使用新版本
            <a href={googlechrome} target="_blank">
              <img src={googleChromeSrc} width="14" height="14"/>谷歌浏览器
            </a>访问网易先知
            <i className="iconfont icon-guanbi" onClick={this.handleCloseNotice} />
          </p>
        </div>
      );
    }
    return null;
  }
}

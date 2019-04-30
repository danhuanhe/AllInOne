import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Ellipsis, Icon, Popover, Modal } from 'ppfish';
import Download from '../Download';
import Message from '../Message';
import './index.less';

class Header extends Component {
  static propTypes = {
    siderCollapsed: PropTypes.bool,
    handleToggleSider: PropTypes.func,
    extraContent: PropTypes.node, // 顶部导航动态附加内容
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    // let resRoot = config.protocol + '://' + config.domain + config.pathSDK;
    this.defaultPortrait = "//qiyukf.com/sdk/res/default/robot_portrait.png";

    this.state = {
      showMessageCenter: false
    };
  }

  handleOpenKefuWorkBench = () => {
    let url = window.location.origin + "/chat/",
      newWinRef = window.open(url, "layout_kefu_workbench");

    if (newWinRef) {
      newWinRef.opener = null;
    }
  };

  handleShowMessageCenter = () => {
    this.setState({
      showMessageCenter: true
    });
  };

  handleCloseMessageCenter = () => {
    this.setState({
      showMessageCenter: false
    });
  };

  render() {
    let {
      siderCollapsed,
      handleToggleSider,
      extraContent
    } = this.props;

    let {
      showMessageCenter
    } = this.state;

    const userInfo = (
      <div className="ctner">
        <a className="user-info" href="/admin/setting/">
          <img className="portrait" src={this.defaultPortrait} width="40px" height="40px"></img>
          <div className="info">
            <div className="item">
              <Ellipsis length={20} tooltip={false}>超长的用户名称</Ellipsis>
            </div>
            <div className="item">
              <Ellipsis length={20} tooltip={false}>abc@corp.netease.com</Ellipsis>
            </div>
          </div>
        </a>
        <a className="logout" href="/api/kefu/logout">退出登录</a>
      </div>
    );

    const helpInfo =(
      <div className="ctner">
        <a className="item" target="_blank" noopener="true" href="http://help.qiyukf.com/">帮助中心</a>
        <a className="item" target="_blank" noopener="true" href="#">联系客服</a>
        <a className="item" href={window.location.origin + '/admin/guide/'}>探索七鱼</a>
      </div>
    );

    return (
      <div className="g-header">
        <Modal
          className="message"
          title={null}
          footer={null}
          width={'850px'}
          visible={showMessageCenter}
          onCancel={this.handleCloseMessageCenter}
        >
          <Message />
        </Modal>

        <Icon
          className="trigger"
          type={siderCollapsed ? 'menu-line-right' : 'menu-line'}
          onClick={handleToggleSider}
        />

        {/* 公告 */}

        { extraContent ? extraContent : null }

        <div className="status">
          <div className="message" onClick={this.handleShowMessageCenter}>
            <i className="message-icon iconfont icon-sound-loudx" />
            消息
          </div>

          <Popover
            placement="bottom"
            title={null}
            content={<Download></Download>}
            trigger="click"
            overlayClassName="download-popover"
          >
            <div className="download">
              <i className="download-icon iconfont icon-downloadcenterx" />
              下载
              <i className="expand-icon iconfont icon-triangle-down" />
            </div>
          </Popover>

          <Popover
            placement="bottom"
            title={null}
            content={helpInfo}
            trigger="click"
            overlayClassName="help-info-popover"
          >
            <div className="help">
              <i className="help-icon iconfont icon-circle-question-revert" />
              帮助
              <i className="expand-icon iconfont icon-triangle-down" />
            </div>
          </Popover>

          <div className="kefu-workbench" onClick={this.handleOpenKefuWorkBench} >
            <i className="iconfont icon-member" />
            客服工作台
          </div>

          <Popover
            placement="bottomRight"
            title={null}
            content={userInfo}
            trigger="click"
            overlayClassName="user-info-popover"
          >
            <div className="user-info">
              <img className="portrait" src={this.defaultPortrait} width="40px" height="40px"></img>
              <div className="name">
                <Ellipsis length={5} tooltip={false}>超长的用户名称</Ellipsis>
                <i className="iconfont icon-triangle-down" />
              </div>
            </div>
          </Popover>
        </div>
      </div>
    );
  }
}

export default Header;

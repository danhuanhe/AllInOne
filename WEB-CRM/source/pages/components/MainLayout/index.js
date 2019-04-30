import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'ppfish';
import ErrorBoundary from '../../../lib/qiyu/Components/ErrorBoundary.js';
import Header from './Header';
import './index.less';

class MainLayout extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    extraContent: PropTypes.node, // 顶部导航内容占位
    menu: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  handleToggleSider = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    let {
      extraContent
    } = this.props;

    return (
      <Layout className="main-layout">
        <Layout.Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo-ctner">
            <i className={this.state.collapsed ? "logo-mini-s" : "logo-mini"}></i>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['2']}
          >
            <Menu.Item key="1">
              <i className="iconfont icon-home" />
              <span>主页</span>
            </Menu.Item>
            <Menu.Item key="2">
              <i className="iconfont icon-home" />
              <span>应用</span>
            </Menu.Item>
            <Menu.Item key="3">
              <i className="iconfont icon-kefu" />
              <span>员工</span>
            </Menu.Item>
            <Menu.Item key="4">
              <i className="iconfont icon-people" />
              <span>客户</span>
            </Menu.Item>
            <Menu.Item key="5">
              <i className="iconfont icon-people" />
              <span>系统</span>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout>
          <Layout.Header className="layout-header" >
            <Header
              siderCollapsed={this.state.collapsed}
              handleToggleSider={this.handleToggleSider}
              extraContent={extraContent}
            >
            </Header>
          </Layout.Header>
          <Layout.Content>
            <ErrorBoundary>
              { this.props.children }
            </ErrorBoundary>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export default MainLayout;

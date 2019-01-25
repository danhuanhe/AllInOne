/**
 * 前端应用入口文件
 */

/**
 * 导入依赖
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';

import '../assets/css/index.less';


import {Popover, Layout} from 'antd';
const {Content, Sider} = Layout;

import MenuNav from '../components/MenuNav';
import {config} from '../config';
import {postMessage} from '../utils';

//import './app.less';

const moduelPerfix = 'm-app';

const pathnameMap = {
  [config.ADMIN_ROUTES.HOME]: '/daily/',
};
const chatHome = '/chat/callcenter/page/';

class App extends Component {

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {

    const {children} = this.props;

    const {MENUS} = this.state;
    let {pathname} = location;

    //外呼任务详情页面，特殊处理二级导航的选中
    if (pathname === config.ADMIN_ROUTES.CALLTASK_DETAIL) {
      pathname = config.ADMIN_ROUTES.CALLTASK;
    }
    if (pathname === config.CHAT_ROUTES.CALLTASK_DETAIL) {
      pathname = config.CHAT_ROUTES.CALLTASK;
    }

    if (pathname === config.ADMIN_ROUTES.SETTING_IVR_EDIT) {
      pathname = config.ADMIN_ROUTES.SETTING_IVR;
    }
    if (pathname === config.ADMIN_ROUTES.SETTING_ROUTER_EDIT) {
      pathname = config.ADMIN_ROUTES.SETTING_ROUTER;
    }
    if (pathname === config.ADMIN_ROUTES.SETTING_OVERFLOW_EDIT) {
      pathname = config.ADMIN_ROUTES.SETTING_OVERFLOW;
    }
    if (pathname === config.ADMIN_ROUTES.SETTING_TRUNK_CALLOUT) {
      pathname = config.ADMIN_ROUTES.SETTING_TRUNK_CALLIN;
    }

    return (<Layout className={`${moduelPerfix}`}>
      <Sider width={200} className={`${moduelPerfix}-sider`}>
        <MenuNav menu={MENUS} selected={pathname}>
          <span>日常管理</span>
          <Popover content={(<a href="http://help.qiyukf.com/archives/444" target="_blank">查看使用说明</a>)}>
            <i className="iconfont icon-circle-question"/>
          </Popover>
        </MenuNav>
      </Sider>
      <Content className={`${moduelPerfix}-content`}>
        {children}
      </Content>
    </Layout>);
  }
}

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const mapStateToProps = (state) => {
  return {...state};
};

const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, bindActionCreators({}, dispatch));
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

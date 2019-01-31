/**
 * 前端应用入口文件
 */

/**
 * 导入依赖
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';

import {Popover, Layout,Menu} from 'antd';
const {Content, Sider,Header,Footer} = Layout;

import MenuNav from '../components/MenuNav';
import {config} from '../config';
import {postMessage} from '../utils';

import '../assets/css/index.less';
import './app.less';

const moduelPerfix = 'm-app';
const pathnameMap = {
  [config.ADMIN_ROUTES.HOME]: '/daily/',
};
class App extends Component {

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    const {route} = props;
    this.state = {
       MENUS: config.MENUS
    };
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {

    const {children} = this.props;

    const {MENUS} = this.state;
    let {pathname} = location;

    return (<Layout className={`${moduelPerfix}`}>
          <Header className={`${moduelPerfix}-header`}>
            <Layout>
              <Sider width={200} className="logo">logologologo</Sider>
              <Content className="menu">
                  <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={['2']}
                  style={{ lineHeight: '64px' }}
                >
                  <Menu.Item key="1">日报</Menu.Item>
                  <Menu.Item key="2">工作流</Menu.Item>
                  <Menu.Item key="3">培训</Menu.Item>
                </Menu>
              </Content>
              <Sider width={200} className="user">useruseruser</Sider>
            </Layout>
            
          </Header>
          <Layout>
            <Sider width={200} className={`${moduelPerfix}-sider`}>
             <Menu
                  theme="dark"
                  mode="inline"
                  defaultSelectedKeys={['2']}
                  style={{ lineHeight: '64px' }}
                >
                  <Menu.Item key="1">日常记录</Menu.Item>
                  <Menu.Item key="2">创建日报</Menu.Item>
                  <Menu.Item key="3">明细分类</Menu.Item>
                </Menu>
            </Sider>
            <Content className={`${moduelPerfix}-content`}>
            {children}
            </Content>
          </Layout>
          <Footer className={`${moduelPerfix}-footer`}>Footer</Footer>
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

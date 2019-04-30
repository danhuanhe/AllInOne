/**
 * menu菜单导航  用于模块的中使用到的树形导航
 */

import React, {Component} from 'react';
import {Router, Route, Link} from 'react-router';

import PropTypes from 'prop-types';

import {Menu, Layout} from 'ppfish';
const {SubMenu, ItemGroup} = Menu;
const {Header, Content} = Layout;

import './MenuNav.less';

class MenuNav extends Component {
  static propTypes = {
    selected: PropTypes.string,
    menu: PropTypes.array.isRequired,
    contentStyle: PropTypes.object,//设置导航栏content的样式，呼叫中心客服端有需求，要把content的overflow设置成hidden
    disabled: PropTypes.bool  //导航栏禁用
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {selected, menu, children, disabled, contentStyle} = this.props;
    const moduelPerfix = 'm-menuNav';

    //获取分组菜单的key,默认全部展开
    const groupkeys = menu.filter(m => {
      return !!m.children;
    }).map(m => {
      return m.key;
    });

    return (<Layout className={`${moduelPerfix}`}>
      <Header className={`${moduelPerfix}-header`}>
        {children}
      </Header>
      <Content className={`${moduelPerfix}-content`} style={contentStyle}>
        <Menu defaultSelectedKeys={[menu[0].key]} selectedKeys={[selected]} defaultOpenKeys={groupkeys} mode="inline">

          {
            menu.map((item) => {
              if (item.url) {
                return (<Menu.Item key={item.key} disabled={disabled}>
                  <Link to={item.url}>
                    {item.name}                    
                  </Link>
                  {item.exNode}
                </Menu.Item>);
              } else if(React.isValidElement(item.children)){//增加上层业务直接配置节点的功能
                return (<SubMenu key={item.key} title={item.name} disabled={disabled}>
                  {item.children}
                </SubMenu>);
              } else if (Array.isArray(item.children)) {
                const children = item.children.map(c => {
                  return (<Menu.Item key={c.key} disabled={disabled}>
                    <Link to={c.url}>
                      {c.name}                      
                    </Link>
                    {c.exNode}
                  </Menu.Item>);
                });
                return (<SubMenu key={item.key} title={item.name} disabled={disabled}>
                  {children}
                </SubMenu>);
              }

            })
          }
        </Menu>
      </Content>
    </Layout>);

  }
}

export default MenuNav;

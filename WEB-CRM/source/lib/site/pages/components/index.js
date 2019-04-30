import React from 'react';
import { Link } from 'react-router';
import { Divider, BackTop, Icon, Row, Col, Menu } from 'ppfish';
import './index.less';
import { componentList } from '../../const';
import Layout from '../common/layout';
import Demo from './demo';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

export default class Components extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { belonger } = this.props,
            currentComponentList = componentList[belonger].list;
        var componentKey = this.props.params.componentKey;
        if(!componentKey && currentComponentList.length > 0) {
            componentKey = currentComponentList[0].key;
        }
        const current = currentComponentList.find(item => item.key === componentKey);
        if (!current) {
            location.assign('/#/home');
        }
        return (
            <Layout>
                <div className="m-page m-page-components">
                    <Row className="m-row">
                        <Col className={'col-left'} xs={24} sm={24} md={24} lg={6} xl={5} xxl={4}>
                            <div className="side-nav">
                                <Menu
                                    selectedKeys={[current.key]}
                                    defaultOpenKeys={[belonger]}
                                    mode="inline"
                                >
                                    {Object.keys(componentList).map((belonger) => {
                                        const item = componentList[belonger];
                                        return (
                                            <SubMenu
                                                key={belonger} 
                                                title={item.name}
                                            >
                                                {item.list.map((componentInfo) => (
                                                    <MenuItem 
                                                        key={componentInfo.key}
                                                    >
                                                        <a href={'#components/'+belonger+'/'+ componentInfo.key}>{componentInfo.name}</a>
                                                    </MenuItem>
                                                ))}
                                            </SubMenu>
                                        )
                                    })}
                                </Menu>
                            </div>
                        </Col>
                        <Col className={'col-right'} xs={24} sm={24} md={24} lg={18} xl={19} xxl={20}>
                            <div className="content">
                                {/* key属性保证路由参数变化时组件重新挂载 */}
                                <Demo componentInfo={current} key={current.key}/>
                                <BackTop />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Layout>
        );
    }
}

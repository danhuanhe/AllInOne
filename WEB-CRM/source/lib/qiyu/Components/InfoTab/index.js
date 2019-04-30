import React, {Component} from 'react';
import {Tabs, Button, Modal} from 'ppfish';
import isEqual from 'lodash/isEqual';
import View from './View';
import './index.less';
import {windowVar} from "../../utils";
import Sorters from "../Sorters";
import PropTypes from 'prop-types';

const keySuffix = '-' + windowVar.get('setting.base.user.username');//srotKey使用用户名做后缀，不同用户不同排序

function getNewStateFromProps(props) {
  const {sortKey, tabList} = props;
  const tabListMap = {};
  for (const tab of tabList) {//将[{key:1,value:11},{key:2,value:22}] => {1:{key:1,value:11},2:{key:2,value:22}} 减少排序的遍历
    tabListMap[tab.key] = tab;
  }


  //如果之前存的有排序，并且tab内容一样。那么使用之前保存的排序
  const nowSort = JSON.parse(localStorage.getItem(sortKey + keySuffix));
  let tabListSort = null;
  if (nowSort && nowSort.map(({key}) => key).sort().join(',') == tabList.map(({key}) => key).sort().join(',')) {
    tabListSort = nowSort.map(({key}) => ({
      key,
      text: tabListMap[key].text
    }));
  } else {
    tabListSort = tabList.map(({key, text}) => ({key, text}));//用来排序的简易tabList只包含 key和text
  }
  return {
    tabListSort,
    tabListMap,
    activeKey: String(tabListSort[0].key),
    sortModalVisible: false,
  };
}

class InfoTab extends Component {

  static propTypes = {
    tabList: PropTypes.array,
    session: PropTypes.object,
    sortKey: PropTypes.string,
    from: PropTypes.string,
    extraNode: PropTypes.node
  };

  static defaultProps = {
    sortKey: 'YSF-CALLCENTER-TABS-SORT',
    from: 'qiyu-callcenter'
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {prevProps = {}} = prevState;
    const newState = {prevProps: nextProps};
    if (!isEqual(prevProps.session, nextProps.session)) {
      return {
        ...getNewStateFromProps(nextProps),
        ...newState,
      };
    }
    return newState;
  }

  constructor(props) {
    super(props);
    this.state = {
      ...getNewStateFromProps(props),
      prevProps: props,
    };
  }

  handleChange = (activeKey) => {
    this.setState({
      activeKey: activeKey
    });
  };

  /**
   * 排序弹窗取消
   */
  handleCancelModal = () => {
    this.setState({
      sortModalVisible: false
    });
  };

  /**
   * 点击排序按钮
   */
  handleTabsSort = () => {
    this.setState({
      tabListSortTmp: [...this.state.tabListSort],
      sortModalVisible: true,
    });
  };

  /**
   * 执行排序操作
   */
  handleChangeSort = (action, index) => {
    let tabList = this.state.tabListSortTmp;

    switch (action) {
      case 'top':
        tabList.unshift(tabList.splice(index, 1)[0]);
        break;
      case 'up':
        tabList.splice(index - 1, 0, tabList.splice(index, 1)[0]);
        break;
      case 'down':
        tabList.splice(index + 1, 0, tabList.splice(index, 1)[0]);
        break;
      default:
        return;
    }

    this.setState({
      tabListSortTmp: tabList
    });

  };

  /**
   * 排序弹窗确认
   */
  handleOkModal = () => {
    this.setState({
      sortModalVisible: false,
      tabListSort: this.state.tabListSortTmp
    });

    localStorage.setItem(this.props.sortKey + keySuffix, JSON.stringify(this.state.tabListSortTmp));
  };

  render() {
    const {extraNode, session, from} = this.props;
    const {tabListMap} = this.state;
    const operations = <Button className="u-action-btn" onClick={this.handleTabsSort}>{extraNode}</Button>;

    return (
      <div className="m-infotab">

        <Modal title="Tab工具栏管理" visible={this.state.sortModalVisible}
               onCancel={this.handleCancelModal} onOk={this.handleOkModal} className="m-tab-sort-modal">
          {
            this.state.tabListSortTmp && this.state.tabListSortTmp.map(({key, text}, i) => (
              <div className="sortItem" key={key}>
                <span className="sort-text">{text}</span>
                <Sorters 
                  layout={[i > 0 ? 'top' : 'empty', i > 0 ? 'up' : 'empty', i < this.state.tabListSortTmp.length - 1 ? 'down' : 'empty']}
                  onClickTop={this.handleChangeSort.bind(this, 'top', i)}
                  onClickUp={this.handleChangeSort.bind(this, 'up', i)}
                  onClickDown={this.handleChangeSort.bind(this, 'down', i)}
                />
                {/* <span className="sort-item">
                  {
                    index == 0 ? <i className="icon-space"/> :
                      <i className="iconfont icon-sort-top" onClick={this.handleChangeSort.bind(this, 'top', index)}/>
                  }
                  {
                    index == 0 ? <i className="icon-space"/> :
                      <i className="iconfont icon-sort-up" onClick={this.handleChangeSort.bind(this, 'up', index)}/>
                  }
                  {
                    index == this.state.tabListSortTmp.length - 1 ? <i className="icon-space"/> :
                      <i className="iconfont icon-sort-down" onClick={this.handleChangeSort.bind(this, 'down', index)}/>
                  }
                </span> */}
              </div>
            ))
          }
        </Modal>

        <Tabs onChange={this.handleChange} tabBarExtraContent={operations} activeKey={this.state.activeKey}>
          {
            this.state.tabListSort.map(({key, text}) => {
              if (tabListMap[key].component) {//自带component的不依赖session,直接返回
                return (
                  <Tabs.TabPane tab={text} key={key}>
                    {key == this.state.activeKey 
                      ? tabListMap[key].component 
                      : null}
                  </Tabs.TabPane>
                );
              } else if (session) {//没有component的，就是自定义iframe。依赖session
                return (
                  <Tabs.TabPane tab={text} key={key}>
                    { key == this.state.activeKey 
                    ? <div className="view">
                        <View id={key} from={from} isActive={this.state.activeKey == key} session={session}/>
                      </div>
                    : null }
                  </Tabs.TabPane>);
              }
            })
          }
        </Tabs>
      </div>
    );
  }
}

export default InfoTab;

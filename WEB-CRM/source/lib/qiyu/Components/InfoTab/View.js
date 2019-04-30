/**
 * 自定义iframe的封装。主要包括获取自定义iframe url的逻辑
 */

import React, { Component } from 'react';
import { request, windowVar } from "../../utils";

import PropTypes from 'prop-types';

import Iframe from '../Iframe';

class View extends Component {
  static propTypes = {
    session: PropTypes.object,
    listeners: PropTypes.object,//监听iframe中上送的事件
    id: PropTypes.number,//iframe的id
    from: PropTypes.string,//来源参数
    isActive: PropTypes.bool//当前iframe是否处于tab激活状态
  }

  constructor(props) {
    super(props);
    this.state = {
      url: '',//iframe的当前 url
      updateUrl: ''//重新获取的url后 先存到updateUrl中，等该iframe被激活时，再加载
    };

    //构造成功后，更新url和updateUrl
    this.getUrlByParams(props.session, ({ result }) => {
      this.setState({
        url: result,
        updateUrl: result
      });
    });
  }

  getUrlByParams = (session, callback) => {

    let params = {
      from: this.props.from,
      id: this.props.id,
      foreignId: session.mobile,
      phone: session.user.mobile,
      anyId: session.id,
      account: windowVar.get('setting.base.user.username')
    };

    request({
      url: '/api/iframe/target/url/param',
      method: 'GET',
      params: params
    }).then(callback);
  }

  componentWillReceiveProps(nextProps) {

    //Props只有isActive和session会变化。分别表示切换了tab以及切换了会话
    if (nextProps.session.id != this.props.session.id) {//如果session变了，重新获取url
      this.getUrlByParams(nextProps.session, ({ result }) => {//新获取的url存入updateUrl中，等到tab被激活也就是isActive时再 更新到url中重新加载新的url
        this.setState({
          updateUrl: result
        });
      });
    }

    if (nextProps.isActive) {//激活的时候加载新的url
      this.setState({
        url: this.state.updateUrl
      });
    }

  }


  render() {
    return (
      <Iframe src={this.state.url} listeners={this.props.listeners} />
    );
  }

}

export default View;

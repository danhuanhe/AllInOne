import React, {Component} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {Popover, Row, Col} from 'ppfish';

import {iframeWrapper} from "../../utils";
import './index.less';

const postMessage = iframeWrapper(window.top).postMessage;

// 工单处理状态对应class
export const statusClass = {
  '5': 'z-status-undo',
  '10': 'z-status-doing',
  '20': 'z-status-done',
  '25': 'z-status-reject'
};

// 工单处理状态对应文案
export const statusText = {
  '5': '未受理',
  '10': '受理中',
  '20': '已完结',
  '25': '已驳回'
};

/**
 * 关联工单模块
 *
 * @params mobile {Number|String} 电话
 * @params sessionId {Number} 会话id
 * @params sheets {object} 会话列表{list,total}
 * @params user  {Object} sessionDetail中的user对象
 */
export default class RelativeWorksheet extends Component {

  static propTypes = {
    mobile: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    sessionId: PropTypes.number,
    sheets: PropTypes.object,
    user: PropTypes.object,
  };

  static defaultProps = {
    sheet: [],
    user: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 163
    };
  }

  // 原来的老逻辑，沿用
  trim = (str) => {
    return str.substr(0, this.state.count) + '...';
  };

  // 弹出新建工单
  onCreate = () => {
    const {user, sessionId, mobile} = this.props;
    const o_query = {
      userId: user.id,
      realname: user.realname || '',
      mobile: user.mobile || '',
      email: user.email || ''
    };
    if (sessionId) o_query.sessionId = sessionId;
    if (mobile) o_query.callmobile = mobile; //呼叫session的mobile.用于在新建工单时获取crm信息
    const query = queryString.stringify(o_query);
    postMessage({
      method: 'onCreateSheet',
      params: {
        url: `/worksheet/create/?${query}`,
      }
    });
  };

  // 弹出已创建工单
  onDetail = (sheetId) => {
    const {user} = this.props;
    const query = {
      id: sheetId,
      uid: user.id
    };
    postMessage({
      method: 'onDetailSheet',
      params: {query},
    });
  };

  // 弹出更多关联工单
  onMoreSheet = () => {
    const {user} = this.props;
    const o_query = {
      uid: user.id
    };
    if (user.foreignId) o_query.foreignId = user.foreignId;
    postMessage({
      method: 'onMoreSheet',
      params: {query: o_query}
    });
  };

  render() {
    const {sheets} = this.props;
    const {count} = this.state;
    const {list, total} = sheets;
    return (
      <div className="u-relative-worksheet">
        <a onClick={this.onCreate}><i className="iconfont icon-plus-circlex icon-add-worksheet"/>新建关联工单</a>
        <ul className="u-worksheet-list">
          {
            list.map(sheet => (
              <li key={sheet.id}>
                <a onClick={() => this.onDetail(sheet.id)} title={sheet.title}>{sheet.title}</a>
                <Popover content={
                  <div>
                    <p>{sheet.content.length > count ? this.trim(sheet.content) : sheet.content}</p>
                    {
                      sheet.targetGroup &&
                      <Row>
                        <Col span={12}>工单受理组</Col>
                        <Col span={12}>{sheet.targetGroup}</Col>
                      </Row>
                    }
                    {
                      sheet.targetPerson &&
                      <Row>
                        <Col span={12}>工单受理人</Col>
                        <Col span={12}>{sheet.targetPerson}</Col>
                      </Row>
                    }
                  </div>} title={sheet.title}>
                    <span className={`m-sheet-status ${statusClass[sheet.actionStatus]}`}>
                    {statusText[sheet.actionStatus]}
                  </span>
                </Popover>
              </li>
            ))
          }
          {
            total - list.length > 0 &&
            <li>
              <a className="m-sheet-relative" onClick={this.onMoreSheet}>
                更多关联工单（{total - list.length}）
              </a>
            </li>
          }
        </ul>
      </div>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { timestamp2fixedDate } from "../../utils";
import TextMsg from "./TextMsg";
import SysMsg from "./SysMsg";
import CharAvator from "./CharAvator";

class MsgFactory extends Component {
  static propTypes = {
    portraitUrl: PropTypes.string,
    // 0 文本消息， 1 系统消息
    type: PropTypes.number,
    msg: PropTypes.object.isRequired,
    userName: PropTypes.string,
    highlightMsgId: PropTypes.number,
    getRef: PropTypes.func,
  };
  static defaultProps = {
    type: 0
  };

  /* msg = {
      id
      content
      createTime
      fromType
    } */

  static msgConfigMap = {
    // 文本消息
    0: {
      component: TextMsg,
      showTime: true,
      showPortrait: true,
    },
    // 系统消息
    1: {
      component: SysMsg,
      showTime: false,
      showPortrait: false,
    }
  };

  constructor(props) {
    super(props);
  }

  renderPortrait(fromType, portraitUrl, userName) {
    const defaultLogo = fromType === 0 ?
      <CharAvator str={userName}/> : <i className="iconfont icon-robotBB8"/>;
    return (
      <div className="u-icon-portrait">
        {
          portraitUrl ?
            <img
              src={portraitUrl}
              alt=""
            /> :
            defaultLogo
        }
      </div>
    );
  }

  renderTime(msgConfig, msg) {
    if (msgConfig.showTime) {
      return <span className="time">{timestamp2fixedDate(msg.createTime, 'MM-dd HH:mm:ss', true)}</span>;
    }
  }

  render() {
    const { msg, userName, type, portraitUrl, highlightMsgId, getRef } = this.props;
    const msgConfig = this.constructor.msgConfigMap[type];
    if (!msgConfig) return null;
    const MsgComp = msgConfig.component;
    const msgPosition = msg.fromType === 0 ? "left" : "right";
    const msgClassList = ['msg', `msg-${type === 0 ? 'text' : 'sys'}`, `msg-${msgPosition}`, 'z-showPortrait'];
    const msgBubbleClassList = ['msg-bubble', !isNaN(highlightMsgId) && highlightMsgId == msg.id ? 'z-current' : ''];
    return (
      <div className={msgClassList.join(' ')} ref={getRef}>
        <div className="msg-main">
          {msgConfig.showPortrait ? this.renderPortrait(msg.fromType, portraitUrl, userName) : null}
          <div className={msgBubbleClassList.join(' ')}>
            <MsgComp {...msg} />
          </div>
        </div>
        <div className="msg-footer">{this.renderTime(msgConfig, msg)}</div>
      </div>
    );
  }
}

export default MsgFactory;

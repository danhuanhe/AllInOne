import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { timestamp2fixedDate1 } from '../../utils';
import { addPropsHOC, formatPortrait, formatTrashWords } from './util';
import { Avatar } from 'ppfish';
import TextMsg from './TextMsg';
import ImageMsg from './ImageMsg';
import FileMsg from './FileMsg';
import VideoMsg from './VideoMsg';
import AudioMsg from './AudioMsg';
import RichTextMsg from './RichTextMsg';
import SysMsg from './SysMsg';
import UnidentifiedMsg from './UnidentifiedMsg';
import QaMsg from './QaMsg';
import CardMsg from './CardMsg';
import MiniProgramCardMsg from './MiniProgramCardMsg';
import BotMsg from './BotMsg';

const nosysMsgConfig = {
  showName: true,
  showTime: true,
  showPortrait: true,
  showReadState: true,
  showSendState: true
};
const msgConfigMap = {
  // 前端类型
  unidentified: {
    component: UnidentifiedMsg,
    ...nosysMsgConfig,
    showReadState: false
  },
  text: {
    component: TextMsg,
    ...nosysMsgConfig
  },
  image: {
    component: ImageMsg,
    ...nosysMsgConfig
  },
  audio: {
    component: AudioMsg,
    ...nosysMsgConfig
  },
  video: {
    component: VideoMsg,
    ...nosysMsgConfig
  },
  file: {
    component: FileMsg,
    ...nosysMsgConfig
  },
  richtext: {
    component: RichTextMsg,
    ...nosysMsgConfig
  },
  qa: {
    component: QaMsg,
    ...nosysMsgConfig
  },
  // 前端类型，对应后端custom-cmd112
  card: {
    component: CardMsg,
    ...nosysMsgConfig
  },
  // 前端类型，对应后端custom-cmd112
  miniProgramCard: {
    component: MiniProgramCardMsg,
    ...nosysMsgConfig
  },
  workflow: {
    component: BotMsg,
    ...nosysMsgConfig
  },
  // 前端类型
  rg: {
    component: RichTextMsg,
    ...nosysMsgConfig
  },
  // 前端类型
  sys: {
    component: addPropsHOC(SysMsg, {
      showTime: true
    })
  },
  tip: {
    component: SysMsg
  },
  ainvalid: {
    component: SysMsg
  },
  cnotify: {
    component: SysMsg
  },
  // 前端类型
  receiptinfo: {
    component: SysMsg
  },
  transkefu: {
    component: addPropsHOC(SysMsg, {
      showTime: true
    })
  }
};

class MsgFactory extends Component {
  static propTypes = {
    msg: PropTypes.object.isRequired,
    emojiMap: PropTypes.array,
    eventHandler: PropTypes.func.isRequired,
    showPortrait: PropTypes.bool,
    showName: PropTypes.bool
  };

  /* msg = {
        id
        sessionId
        type
        content
        time
        fromUser
        state
        readState
        push
        ext
        kefu
        user
    } */

  renderName(msgConfig ,msg) {
    const { kefu, user } = msg;
    let name;
    if (msg.fromUser) {
      name = user.name;
    } else {
      name = kefu.name;
    }
    return (
      <div className="chater-name">
        <span>{name}</span>
      </div>
    );
  }
  renderPortrait(msgConfig, msg) {
    let portrait;
    let avatarJSX;
    if (msg.fromUser) {
      portrait = formatPortrait(msg.user.avatar);
      if (portrait) {
        avatarJSX = <Avatar src={portrait} />;
      } else {
        const name = msg.user.name;
        avatarJSX = <Avatar>{name.substr(name.length - 1, 1)}</Avatar>;
      }
    } else {
      portrait = formatPortrait(msg.kefu.portrait);
      if (portrait) {
        avatarJSX = <Avatar src={portrait} />;
      } else {
        avatarJSX = <Avatar icon="user-line" />;
      }
    }
    return (
      <div className="u-icon-portrait">
        {avatarJSX}
        {msg.type === "qa" && msg.content.is_robot_help_human ? (
          <span className="robot-corner">
            <i className="iconfont icon-robotBB8" />
          </span>
        ) : null}
      </div>
    );
  }
  renderSendState(msgConfig, msg) {
    if (!msgConfig.showSendState || msg.fromUser || !msg.state) return;
    const stateTextMap = {
      "-1": "fail",
      "1": "loading"
    };
    const classList = ["sendState", "u-icon-" + stateTextMap[msg.state]];
    return <i className={classList.join(" ")} />;
  }
  renderTime(msgConfig, msg) {
    if (msgConfig.showTime) {
      return <span className="time">{timestamp2fixedDate1(msg.time)}</span>;
    }
  }
  renderReadState(msgConfig, msg) {
    if (msgConfig.showReadState) {
      const classList = ["readState"];
      if (!msg.read) {
        classList.push("z-unread");
      }
      return (
        <span className={classList.join(" ")}>
          {msg.read ? "已读" : "未读"}
        </span>
      );
    }
  }
  renderWithdrawStatus(msg) {
    if (msg.withdrawStatus == 1) {
      return <div className="withdraw-status">已撤回</div>;
    }
  }
  render() {
    const { msg, emojiMap, eventHandler } = this.props;
    const msgPosition = msg.fromUser ? "left" : "right";
    const msgClassList = ["msg", `msg-${msg.type}`, `msg-${msgPosition}`];
    let msgConfig = msgConfigMap[msg.type];
    if (!msgConfig) {
      msgConfig = msgConfigMap["unidentified"];
      msgClassList.push("msg-unidentified");
    }
    const MsgComp = msgConfig.component;
    const showName = this.props.showName && msgConfig.showName;
    const showPortrait = this.props.showPortrait && msgConfig.showPortrait;
    if (showPortrait) {
      msgClassList.push("z-showPortrait");
    }
    if (msg.withdrawStatus == 1) {
      msgClassList.push("z-withdraw");
    }
    if (msg.ext.auditResult) {
      msgClassList.push("z-trashed");
    }
    return (
      <div className={msgClassList.join(" ")}>
        <div className="msg-header">
          {showName ? this.renderName(msgConfig, msg) : null}
        </div>
        <div className="msg-main">
          {showPortrait ? this.renderPortrait(msgConfig, msg) : null}
          <div className="msg-bubble">
            <MsgComp {...msg}
              emojiMap={emojiMap}
              eventHandler={eventHandler}
            />
            {this.renderSendState(msgConfig, msg)}
            {this.renderWithdrawStatus(msg)}
          </div>
        </div>
        {msg.push ? (
          <div className="msg-push-state">
            <span className="push-mark">推送消息</span>
          </div>
        ) : null}
        {msg.ext.auditResult ? (
          <div className="msg-trash-info">{formatTrashWords(msg.ext)}</div>
        ) : null}
        <div className="msg-footer">
          {this.renderTime(msgConfig, msg)}
          {this.renderReadState(msgConfig, msg)}
        </div>
      </div>
    );
  }
}

export default MsgFactory;

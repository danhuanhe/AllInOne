import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import MsgFactory from "./MsgFactory";
import { timestamp2fixedDate } from "../../utils";
import "./index.less";

const CLOSE_REASON_MAP = {
  1: '用户结束通话',
  31: '用户转接人工服务'
};
class VoiceMsgList extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    robot: PropTypes.object.isRequired,
    msgs: PropTypes.array.isRequired,
    session: PropTypes.object.isRequired,
    highlightMsgId: PropTypes.number,
    scrollIntoView: PropTypes.bool,  //会话消息流滚动到视野中
  };

  constructor(props) {
    super(props);
    this.msgFactory = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.scrollIntoMsg();
    }, 0);
  }

  componentDidUpdate() {
    this.scrollIntoMsg();
  }

  scrollIntoMsg = () => {
    const { highlightMsgId, msgs, scrollIntoView } = this.props;
    if ( !isNaN(highlightMsgId) ) {
      const highlightMsg = msgs.find(({id}) => id == highlightMsgId);
      if ( highlightMsg ) {
        const el = this.msgFactory[highlightMsg.id];
        this.scrollIntoView(el);
      }
    } else if ( scrollIntoView ) {
      const el = this.robotVoiceContent;
      this.scrollIntoView(el);
    }
  }

  //会话消息流滚动到视野中
  scrollIntoView = (el) => {
    if(el && el.scrollIntoViewIfNeeded) {
      el.scrollIntoViewIfNeeded(true);  
    }
  }

  render() {
    const {user, robot, session, msgs, highlightMsgId} = this.props;
    // 1-用户挂断 31-转接人工
    const closeReasonCode = session.closeReason;
    // 未关闭或通话异常
    const sessionClosed = closeReasonCode != 0;
    const closeReason = CLOSE_REASON_MAP[closeReasonCode] || '';

    return (
      <div className="m-voice-msgList" ref={ref => this.robotVoiceContent = ref} >
        <MsgFactory
          type={1}
          msg={{
            content: `${timestamp2fixedDate(session.startTime, 'MM-dd HH:mm ss')} 用户呼入
由 ${robot.name} 接待`
          }}
        />
        {msgs.map(msg => {
          const portraitUrl = msg.fromType === 0 ? user.logoUrl : robot.logoUrl;
          return (
            <MsgFactory
              type={0}
              key={msg.id}
              userName={user.name}
              portraitUrl={portraitUrl}
              msg={msg}
              highlightMsgId={highlightMsgId}
              getRef={(node) => this.msgFactory[msg.id] = node}
            />
          );
        })}
        {
          sessionClosed ?
            <MsgFactory
              type={1}
              msg={{
                content: `${timestamp2fixedDate(session.endTime, 'MM-dd HH:mm ss')} ${closeReason}`
              }}
            /> : null
        }
      </div>
    );
  }
}

export default VoiceMsgList;

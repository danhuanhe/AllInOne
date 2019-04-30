import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input, Tabs, Select, DatePicker, message } from 'ppfish';
import { getMailboxInboxList } from '../services.js';
import "./index.less";

class Message extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    this.last30Days = [start, end];
    this.state = {
      msgList: [],
      date: [start, end]    // 最近30天
    };

    this.dateRangePickerRef = null;
  }

  componentDidMount() {
    // 默认获取最近30天的消息
    getMailboxInboxList({
      limit: 15,
      offset: 0,
      startTime: this.last30Days[0],
      endTime: this.last30Days[1],
      read: 0
    }).then((res) => {
      if (res && res.code == 200) {
        this.setState({
          msgList: res.result
        });
      } else {
        message.error(res.message);
      }
    });
  }

  saveDateRangePicker = (node) => {
    this.dateRangePickerRef = node;
  }

  handleDateRangePickerChange = (date) => {
    console.log('DateRangePicker changed: ', date);
    this.setState({ date });
  }

  handleReadStatusChange = (value) => {
    console.log('>> handleReadStatusChange: ', value);
  }

  renderFilterPane = () => {
    let { date } = this.state;
    const contentCls = classNames('content', {
      'hide': false
    });

    return (
      <div className="filter-pane">
        <DatePicker.DateRangePicker
          value={date}
          placeholder="选择日期范围"
          ref={this.saveDateRangePicker}
          onChange={this.handleDateRangePickerChange}
          shortcuts={[{
            text: '今天',
            onClick: () => {
              const curDate = new Date();
              const end = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 23, 59, 59);
              const start = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 0, 0, 0);

              this.setState({date: [start, end]});
              this.dateRangePickerRef.togglePickerVisible();
            }
          }, {
            text: '最近7天',
            onClick: () => {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

              this.setState({date: [start, end]});
              this.dateRangePickerRef.togglePickerVisible();
            }
          }, {
            text: '最近30天',
            onClick: () => {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

              this.setState({date: [start, end]});
              this.dateRangePickerRef.togglePickerVisible();
            }
          }]}
        />

        <Select defaultValue={0} onChange={this.handleReadStatusChange}>
          <Select.Option value={0}>全部消息</Select.Option>
          <Select.Option value={1}>已读消息</Select.Option>
          <Select.Option value={2}>未读消息</Select.Option>
        </Select>

        <Input.Search
          placeholder="搜索消息的标题或内容"
          onSearch={this.handleSearch}
          onChange={this.handleInputChange}
        />

        <div className="content">
          <ul className="item-list">
            <li className="item selected">
              <div className="title-ctner">
                <span className="title">工单回复通知</span>
                <time className="time">今天 17:56</time>
                <a className="noread"></a>
              </div>
              <div className="cont">
                您创建的工单#271<b className="search-key">8</b>282502136有了新的回复
              </div>
            </li>
            <li className="item">
              <div className="title-ctner">
                <span className="title"><b className="search-key">8</b></span>
                <time className="time">今天 17:53</time>
                <a className="noread" style={{display: 'none'}}></a>
              </div>
              <div className="cont">
                <b className="search-key">8</b>
              </div>
            </li>
          </ul>
          <p className="nomore" style={{display: 'none'}}>没有更多内容啦</p>
        </div>

        <div className="empty" style={{display: 'none'}}>
          <i className="iconfont icon-empty"></i>
          <p>暂无收到任何消息</p>
        </div>
      </div>
    );
  };

  renderMessageList = () => {
    return <div className="detail">全部消息</div>;
  };

  render() {
    const TabPane = Tabs.TabPane;

    return (
      <div className="ctner">
        <Tabs defaultActiveKey="1">
          <TabPane tab="全部消息" key="1">
            {this.renderFilterPane()}
            {this.renderMessageList()}
          </TabPane>
          <TabPane tab="系统公告" key="2">系统公告</TabPane>
          <TabPane tab="工单消息" key="3">工单消息</TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Message;

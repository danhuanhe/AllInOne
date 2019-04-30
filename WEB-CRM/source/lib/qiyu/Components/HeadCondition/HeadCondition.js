/**
 * 报表头部的筛选条件组件
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {DatePicker, Button, Row, Col, message} from 'ppfish';
const {DateRangePicker} = DatePicker;

import './HeadCondition.less';

import {
  pastDay,
  DAY_BEGIN,
  DAY_END,
  defaultShortcuts,
  today,
  pastAlltime,
  addYear
} from '../../utils';

export const STORAGE_KEY_STARTTIME = 'HEADCONDITION_STARTTIME';
export const STORAGE_KEY_ENDTIME = 'HEADCONDITION_ENDTIME';

class HeadCondition extends Component {
  static propTypes = {
    head: PropTypes.node,
    dateProps: PropTypes.object, //由外层定义的时间选择器的属性，开放部分能力由外层配置，譬如{showTime: false}。
                                 //但shortcuts 格式如下[{text:'过去一年',section:pastYear()},{text:'过去一月',section:pastMonth()}]
    handleChange: PropTypes.func, //参数变化后通知外层
    handleExport: PropTypes.func, //通知外层导出
    hideDatePicker: PropTypes.bool, //不显示日期选择
    scene: PropTypes.string //设置当前月显示在面板左边还是右边
  }

  static defaultProps = {
    dateProps: {},
    scene: "past"
  }

  constructor(props) {
    super(props);

    //如果sessionStorage中有时间就使用sessionStorage内的时间,如果sessionStorage中的时间超过dateRange的范围，裁剪时间相应时间。
    //如果没有，就使用props中指定的时间，如果也没有指定，就用过去一天的时间
    const dt_b = sessionStorage.getItem(STORAGE_KEY_STARTTIME);
    const dt_e = sessionStorage.getItem(STORAGE_KEY_ENDTIME);

    const {
      dateProps: {
        showTime = false,
        dateRange = pastAlltime(),
        defaultTimeValue = pastDay()
      }
    } = props;

    let datetime;

    if (dt_b && dt_e) { //如果sessionStorage中存在时间

      let beginTime = new Date((Number(dt_b))),
        endTime = new Date((Number(dt_e)));

      if (dateRange && endTime > dateRange[1]) {
        endTime = dateRange[1]; //如果结束时间比时间范围的结束时间晚，使用时间范围的的结束时间
      }
      if (dateRange && beginTime < dateRange[0]) {
        beginTime = dateRange[0]; //如果开始时间比时间范围的开始时间早，使用时间范围的开始时间
      }

      if (showTime === false) { //从能设置小时和分的页面进入不能设置小时和分的页面，取开始的时间的00：00：00和结束时间的23：59：59
        datetime = [DAY_BEGIN(beginTime), DAY_END(endTime)];
      } else {
        datetime = [beginTime, endTime];
      }

      if (datetime[0] >= datetime[1]) { //通过时间矫正过后，如果开始时间大于等于结束时间，那么使用默认时间
        datetime = defaultTimeValue;
      }

    } else { //如果sessionStorage中不存在时间，就使用默认值
      datetime = defaultTimeValue;
    }

    this.state = {
      datetime: datetime
    };

    const {handleChange} = props;
    handleChange && handleChange({
      ...this.state
    });
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  setDateTime = (datetime) => {
    this.setState({datetime});
    sessionStorage.setItem(STORAGE_KEY_STARTTIME, datetime[0].getTime());
    sessionStorage.setItem(STORAGE_KEY_ENDTIME, datetime[1].getTime());

    const {hideDatePicker, handleChange} = this.props;
    !hideDatePicker && handleChange({
      ...this.state,
      datetime
    });
  }

  render() {
    const {
      head,
      dateProps,
      hideDatePicker,
      dateProps: {
        popupContainer = document.body,
        shortcuts = defaultShortcuts,
        dateRange = pastAlltime()
      },
      handleExport,
      scene
    } = this.props;

    const {datetime} = this.state;
    const moduelPerfix = 'm-headCondition';

    const datePropsReal = Object.assign({
      className: `${moduelPerfix}-dateSelect`,
      separator: '至',
      value: datetime,
      showTime: false,
      placeholder: "选择日期范围",
      align: "left",
      allowClear : false,
      format: 'yyyy-MM-dd',
      getPopupContainer:() => popupContainer,
      style: Object.assign({
        flexShrink: 0,
        width: 246,
        minWidth: 240
      }, dateProps.style)
    }, dateProps, {
      shortcuts: shortcuts.map(s => ({ //对shortcuts做一层转化，添加onClick事件
        text: s.text,
        onClick: () => {
          this.setDateTime(s.section);
          this.daterangepicker.togglePickerVisible();
        }
      }))
    });

    return (<Row className={`${moduelPerfix}`} type="flex" justify="space-between">
      <Col span={5}>
        {head}
      </Col>
      <Col span={19} className={`${moduelPerfix}-content`}>
        {hideDatePicker ? null :<DateRangePicker
          {...datePropsReal}
          ref={e => this.daterangepicker = e}
          onChange={date => {

            if (date && date[0] && date[1]) {
              if (date[1] - date[0] <= 0) {

                this.setState({
                  ...this.state
                });
                message.error('结束时间必须晚于开始时间');

              } else if (date[1] > addYear(1,date[0])) {

                this.setState({
                  ...this.state
                });
                message.error('时间跨度不能超过一年');

              } else {
                this.setDateTime(date);
              }
            }

          }}
          disabledDate={date => date > dateRange[1] || date < dateRange[0]}
          scene={scene}
        />}
        {this.props.children}
        {
          handleExport && <Button type="primary" className={`${moduelPerfix}-export`} onClick={() => {
                handleExport({
                  ...this.state
                });
              }}><i className="iconfont icon-export"/>导出当前数据</Button>
        }

      </Col>
    </Row>);

  }
}

export default HeadCondition;

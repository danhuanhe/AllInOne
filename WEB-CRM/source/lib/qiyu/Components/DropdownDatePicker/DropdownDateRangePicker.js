import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DatePicker, Icon, message, Popover, Select } from 'ppfish';
import format from 'date-fns/format';
import { timestamp2date } from '../../utils';


//https://date-fns.org/v1.28.0/docs/format
// 默认快速选择时间选项
const defaultQuickTimeOption = [
  {
    text: '今天', value: [
      new Date(new Date().setHours(0, 0, 0, 0)),
      new Date(new Date().setHours(23, 59, 59, 59))
    ]
  },
  {
    text: '过去一周', value: [
      new Date(new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000),
      new Date(new Date().setHours(23, 59, 59, 59))
    ]
  }
];

// value传进来有两种格式：{ text: '今天', value: [Date, Date] } 或 [Date, Date]
const getShowDateFromValue = (value, Stringformat = 'yy-MM-dd') => {
  let result = { text: null, value: null };
  if (value instanceof Object && 'text' in value && 'value' in value) {
    result = value;
  } else if (value instanceof Array) {
    result = { text: `${timestamp2date(value[0], Stringformat)} ~ ${timestamp2date(value[1], Stringformat)}`, value: value };
  }
  return result;
};

export const diffDate = (dateA, dateB) => {
  const time = dateB.getTime() - dateA.getTime();
  const days = parseInt(time / (1000 * 60 * 60 * 24));
  return days;
};
class DropdownDateRangePicker extends React.Component {

  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    placement: PropTypes.oneOf(['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight']),//组件弹出方向
    popupAlign: PropTypes.oneOf(['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight']),//组件弹出方向以后，日期选择器的弹出方向
    format: PropTypes.string,
    quickTimeOption: PropTypes.array,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    open: PropTypes.bool,               //用于手动控制浮层显隐
    disabled: PropTypes.bool,
    showTime: PropTypes.bool,
    disabledDate: PropTypes.func,
    onVisibleChange: PropTypes.func,       //弹出或关闭浮层的回调
    onChange: PropTypes.func,
    separator: PropTypes.string,
    maxDateRange: PropTypes.number,
    onError: PropTypes.func,
  }

  static defaultProps = {
    prefixCls: 'biz-date-picker-',
    placement: 'bottomLeft',  // popover弹出定位
    popupAlign: 'bottomLeft',// 日历弹出定位
    quickTimeOption: defaultQuickTimeOption,
    open: false,
    disabled: false,
    showTime: false,
    disabledDate: () => { },
    onVisibleChange: () => { },
    onChange: () => { },
    maxDateRange: null,
    format: "yyyy-MM-dd",
  }

  constructor(props) {
    super(props);
    const value = props.value || props.defaultValue;
    this.state = {
      showDate: getShowDateFromValue(value, props.format),
      open: props.open,
      extraFoot: null, // extraFoot : () => Node
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value || [];
      this.setState({
        showDate: getShowDateFromValue(value, this.props.format) || this.state.showDate,
      });
    }
    if ('open' in nextProps && this.props.open != nextProps.open) {
      this.setState({
        open: nextProps.open,
      });
    }
  }

  // 快速时间选择
  handleQickTime(item) {
    this.setState({
      showDate: item,
      open: false,
    }, () => {
      this.props.onChange(this.state.showDate);
    });
  }
  onError = (value) => {
    const { onError } = this.props;
    if (typeof onError == 'function') { // 使用者自己来处理错误
      let error = onError(value);
      if (
        typeof error === 'function' ||
        error === null
      ) {
        this.setState({ extraFoot: error });
      }

      // 返回True类型的内容表明用户自定义判断有错误
      return error;
    } else {
      //兼容ppfish旧版本 如果是string，表明是原来旧的DateRangePicker组件,照旧处理
      if (typeof value === 'string') {
        message.error(value);
      } else if (Array.isArray(value)) {
        //新的写法,要自己处理maxDateRange，建议使用者自己使用onError自定义
        const { maxDateRange } = this.props;
        if (typeof maxDateRange === 'number') {
          if (diffDate(value[0], value[1]) + 1 > maxDateRange) {
            message.error(`最大选择范围不能超过${maxDateRange}天`);
            return true;
          }
        }
      }
    }
  }
  // 自定义时间选择
  handleCustomerTimeChange = (date) => {

    if (date && date.length == 2) {
      this.setState({
        open: false,
        showDate: {
          text: timestamp2date(date[0], this.props.format) + ' ~ ' + timestamp2date(date[1], this.props.format),
          value: date
        },
      }, () => {
        this.props.onChange(this.state.showDate);
      });
    }
  }

  // 打开、关闭Popover
  handleVisibleChange = (open) => {
    if (!this.props.disabled) {
      this.setState({ open }, () => {
        this.props.onVisibleChange(open);
      });
    }
  }

  render() {
    const {
      className,
      prefixCls,
      style,
      placeholder,
      quickTimeOption,
      disabled,
      disabledDate,
      format,
      showTime,
      separator,
      placement,
      popupAlign,
      maxDateRange,
    } = this.props;
    const { showDate, open, extraFoot } = this.state;

    const clickAreaClass = classNames({
      [`${prefixCls}-click-area`]: true,
      'disabled': disabled
    });
    const clickAreaIconClass = classNames({
      [`${prefixCls}-click-area-icon`]: true,
      'active': open
    });
    const content = (
      <div className={`${prefixCls}-content`}>
        {
          quickTimeOption.map((item, index) =>
            <li
              className={classNames("quick-picker-item", { "active": item.text === showDate.text })}
              key={`quick-item-${index}`}
              onClick={this.handleQickTime.bind(this, item)}>
              <span>{item.text}</span>
            </li>
          )
        }
        <div className={`${prefixCls}-custom-time`}>
          <div className={`${prefixCls}-custom-time-text`}>自定义时间</div>
          <DatePicker.DateRangePicker
            format={format.replace('YYYY', 'yyyy').replace('DD', 'dd')}
            placement={popupAlign}
            style={{width: 280}}
            showTrigger={true}
            allowClear={false}
            showTime={showTime}
            disabledDate={disabledDate}
            onChange={this.handleCustomerTimeChange}
            value={showDate.value}
            onError={this.onError}
            footer={extraFoot}
            onVisibleChange={(status) => {
              this.setState({ extraFoot: null });
            }}
            maxDateRange={maxDateRange}
            getPopupContainer={node => node.parentElement}
            separator={separator}
          />
        </div>
      </div>
    );

    return (
      <div className={[`${prefixCls}-container`, className].join(' ')} >
        <Popover
          action={disabled ? [] : ['click']}
          // builtinPlacements={placements}
          getPopupContainer={node => node.parentElement}
          onVisibleChange={this.handleVisibleChange}
          content={content}
          placement={placement}
          visible={open}
          trigger="click"
        >
          <div>
            <Select
              style={style}
              placeholder={placeholder}
              value={showDate.text}
              dropdownClassName={`${prefixCls}-hiddenDropdown`}
            />
            {/* <span className={`${prefixCls}-click-area-text`}>{showDate.text}</span> */}
            {/* <span className={clickAreaIconClass} >
              <Icon
                className="iconfont"
                type="down-fill"
                onClick={this.handleClickCloseIcon}
              />
            </span> */}
          </div>
        </Popover>
      </div>
    );
  }
}

export default DropdownDateRangePicker;

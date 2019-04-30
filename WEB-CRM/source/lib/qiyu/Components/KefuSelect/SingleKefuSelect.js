
/**
 * 工作报表头部的选择客服组件
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Base from './Base';

export default class SingleKefuSelect extends Component {
  static propTypes = {
    /**
     * 该组件可接受的其它参数和各工具函数见同文件夹下的Base.js
     */
    value: PropTypes.array, // value可不传
    onChange: PropTypes.func.isRequired, // 选项改变时的回调
  }

  constructor(props) {
    super();

    this.defaultValue = '0';
    if (props.hasOwnProperty('defaultValue')) {
      this.defaultValue = props.defaultValue;
    }

    this.state = {
      id: this.defaultValue
    };
  }

  onSelect = (id, valueList, infoList) => {
    this.setState({id});
    if (id == 0) {
      this.props.onChange({
        groupId: '',
        kefuId: '',
        value: id
      });
    } else {
      const {type, idValue} = infoList[0];
      if (type == 1) this.props.onChange({groupId: idValue, kefuId: '', value: id});
      else this.props.onChange({groupId: '', kefuId: idValue, value: id});
    }
  }

  render() {
    const {onChange, value, ...others} = this.props;

    return (
      <Base
        TreeSelectProps={{
          onSelect: this.onSelect,
          value: value == undefined ? this.state.id : value,
        }}
        {...others}
      />
    );
  }
}
  
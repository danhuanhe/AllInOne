
/**
 * 工作报表头部的选择客服组件
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Base from './Base';

export default class KefuSelect extends Component {
  static propTypes = {
    /**
     * 该组件可接受的其它参数和各工具函数见同文件夹下的Base.js
     */
    value: PropTypes.array, // value可不传
    onChange: PropTypes.func.isRequired, // 选项改变时的回调
  }

  constructor(props) {
    super();

    this.defaultValue = ['0'];
    if (props.hasOwnProperty('defaultValue')) {
      this.defaultValue = props.defaultValue;
    }

    this.state = {
      idList: this.defaultValue
    };
  }

  onConfirm = (valueList, valueObjList) => {
    this.setState({idList: valueList});
    if (valueList[0] == 0) {
      this.props.onChange({
        groupIds: [],
        kefuIdList: [],
        value: valueList
      });
    } else {
      const groupIds = [], kefuIdList = [];
      valueObjList.forEach(({type, idValue}) => {
        if (type == 1) groupIds.push(idValue);
        else kefuIdList.push(idValue);
      });
  
      this.props.onChange({
        groupIds,
        kefuIdList,
        value: valueList
      });
    }
  }

  onCancel = (valueObjList) => {
    this.setState({idList: valueObjList.map(idValue => idValue)});
  }

  render() {
    const {onChange, value, ...others} = this.props;
    return (
      <Base
        TreeSelectProps={{
          onConfirm: this.onConfirm,
          onCancel: this.onCancel,
          value: value == undefined ? this.state.idList : value,
          treeCheckable: true,
        }}
        {...others}
      />
    );
  }
}

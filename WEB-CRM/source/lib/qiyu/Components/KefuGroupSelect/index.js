
/**
 * 工作报表头部的选择客服组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';


import { pySegSort } from '../../utils/pySegSort';
import { request } from '../../utils/ajax';
import { Select } from 'ppfish';

const Option = Select.Option;
const OptGroup = Select.OptGroup;


class KefuGroupSelect extends Component {
  static propTypes = {
    optionBefore: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.number,
        text: PropTypes.string,
      })
    ),
    defaultValue: PropTypes.oneOfType([ PropTypes.number, PropTypes.array]),
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.array]),
    onChange: PropTypes.func,
    customRequest: PropTypes.func,
  }

  static requestKefuGroup = () => request({
    url: '/api/kefuGroup/list',
    method: 'get',
    params: {
      offset: 0,
    }
  })

  static defaultProps = {
    customRequest: () => KefuGroupSelect.requestKefuGroup().then(json => json.result),
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      value: props.value || props.defaultValue,
      KefuGroupList: [],
      error: false,
    };
    this.loadData();
  }

  componentWillUpdate({ value }) {
    if (value !== this.props.value && value !== this.state.value) {
      this.setState({ value: value });
    }
  }

  loadData = () => {
    this.props.customRequest().then(json => {
      this.setState({
        loading: false,
        error: false,
        KefuGroupList: json,
      });
    },
      error => {
        this.setState({
          loading: false,
          error: error,
        });
      });
  }

  value = () => this.state.value;

  onChange = value => {
    this.setState({
      value: value,
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }

  retry = () => {
    this.setState(state => {
      state.loading = true;
      return state;
    }, () => {
      this.loadData();
    });
  }

  render() {
    const {
      optionBefore, customRequest, onChange,
      value: _1, loading: _2,
      ...restProps
    } = this.props;
    const { KefuGroupList, loading, value, error } = this.state;
    if (!loading && error) {
      return <a href="javascript:;" onClick={this.retry}>请求出错，点击重试</a>;
    }
    return (
      <Select className="m-KefuGroupSelect"
        {...restProps}
        style={{ width: '100%' }}
        showSearch
        loading={loading}
        value={value}
        filterOption={(input, option) =>
          option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onChange={this.onChange}
      >
        {optionBefore ? optionBefore.map(({ key, text }) => <Option key={key} value={key}>{text}</Option>) : null}
        {
          pySegSort(KefuGroupList, ({ pinyin }) => pinyin).map(({ group, values }) => (
            <OptGroup label={group} key={group}>
              {
                values.map(({ id, name }) => (
                  <Option key={id} value={id}>{name}</Option>
                ))
              }
            </OptGroup>
          ))
        }
      </Select>
    );
  }
}

export default KefuGroupSelect;

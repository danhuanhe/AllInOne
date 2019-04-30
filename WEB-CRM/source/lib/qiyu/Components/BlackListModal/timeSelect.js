import React from 'react';
import PropTypes from 'prop-types';
import {Select, InputNumber, Radio} from 'ppfish';
import {timestamp2date} from '../../utils';

const Option = Select.Option;
const RadioGroup = Radio.Group;
export default class TimeSelect extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      number: value.number,
      dateUnit: value.dateUnit || 1,
      effective: value.effective || 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  handleNumberChange = (number) => {
    if (isNaN(number)) {
      return;
    }
    if (number > 1000) number = 1000;
    if (!('value' in this.props)) {
      this.setState({number});
    }
    this.triggerChange({number});
  };

  handleDateUnitChange = (dateUnit) => {
    if (!('value' in this.props)) {
      this.setState({dateUnit});
    }
    this.triggerChange({dateUnit});
  };

  handleTypeChange = (e) => {
    let changed = {
      effective: e.target.value
    };
    if (changed.effective === 0) {
      changed.dateUnit = 1;
      changed.number = undefined;
    }
    if (!('value' in this.props)) {
      this.setState(changed);
    }
    this.triggerChange(changed);
  };

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const state = this.state;
    return (
      <div className="m-blacklist-timeselect">
        <RadioGroup onChange={this.handleTypeChange} value={state.effective}>
          <Radio value={0}>永久</Radio>
          <Radio value={1}>自定义</Radio>
        </RadioGroup>
        {
          state.effective === 1 &&
          <div className="timeselect-group">
            <InputNumber
              className="timeselect-item"
              value={state.number}
              onChange={this.handleNumberChange}
              min={1}
              max={1000}
            />
            <Select
              className="timeselect-item"
              value={state.dateUnit}
              onChange={this.handleDateUnitChange}
            >
              <Option value={1}>时</Option>
              <Option value={24}>天</Option>
            </Select>
          </div>
        }
        {
          state.effective === 1 && state.number &&
          <p className="timeselect-tip"> 失效时间为{timestamp2date(new Date().getTime() + state.number * state.dateUnit * 60 * 60 * 1000)}</p>
        }
      </div>
    );
  }
}

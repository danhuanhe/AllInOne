import React from 'react';
import { Input } from 'ppfish';

class FloatInput extends React.Component {
  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      number: value.number
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  handleNumberChange = (e) => {
    const { value } = e.target;
    //const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    const reg = /^-?\d+\.?\d{0,2}$/;
    if ((!isNaN(value) && reg.test(value)) || value === '') {
      if (!('value' in this.props)) {
        this.setState({ number: value });
      }
      this.triggerChange({ number: value });
    } else {
      return;
    }
    
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const { size, placeholder, width, maxLength, ...others } = this.props;
    const state = this.state;
    return (
        <Input
          {...others}
          type="text"
          size={size}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{width: width}}
          value={state.number}
          onChange={this.handleNumberChange}
        />
    );
  }
}

export default FloatInput;
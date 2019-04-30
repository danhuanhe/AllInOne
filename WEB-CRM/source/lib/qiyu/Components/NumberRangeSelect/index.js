import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input } from 'ppfish';
import SectionSelect from '../SectionSelect';
import { IntInput } from '../SpecInput';
import './index.less';

export default class NumberRangerSelect extends Component {
    static propTypes = {
        title: PropTypes.string,
        dropdownTitle: PropTypes.string,
        disabled: PropTypes.bool,
        style: PropTypes.object,
        dropdownStyle: PropTypes.object,
        min: PropTypes.string,
        max: PropTypes.string,
        rangeLimit: PropTypes.object,
        onChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        title: '全部',
        dropdownTitle: '选择数字范围',
        disabled: false,
        min: '',
        max: '',
        rangeLimit: { max: null, min: null }
    }

    constructor(props) {
        super(props);
        this.state = {
            showDropdown: false,
            min: props.min,
            max: props.max,
            errorInfo: '',
            rangeLimit: props.rangeLimit
        }
    }

    componentWillReceiveProps(nextProps) {
        const { min:nextMin, max:nextMax } = nextProps,
            {min, max} = this.props;
        if(nextMin !== min || nextMax != max) {
            this.setState({
                min: nextMin,
                max: nextMax
            })
        }
    }
    getValidValue = newValue => {
        const {min: limitMin, max: limitMax} = this.state.rangeLimit;
        if(limitMin!=null && limitMin > newValue) {
            newValue = limitMin;
        }
        if(limitMax!=null && limitMax < newValue) {
            newValue = limitMax;
        }
        return newValue;
    }

    onMinChange = ({ number }) => {
        this.setState({
            min: this.getValidValue(number)
        })
    }

    onMaxChange = ({ number }) => {
        this.setState({
            max: this.getValidValue(number)
        })
    }

    onInputFocus = () => {
        this.setState({
            errorInfo: ''
        })
    }

    onToggle = (showDropdown) => {
        this.setState({
            showDropdown: showDropdown
        })
    }

    ok = () => {
        const { min, max } = this.state;
        if(min && max && min*1 > max*1) {
            this.setState({
                errorInfo: '截止值不得小于初始值'
            })
            return;
        }
        this.setState({
            errorInfo: '',
            showDropdown: false
        })
        this.props.onChange({
            min: min,
            max: max
        })
    }

    cancel = () => {
        // this.reset();
        this.setState({
            showDropdown: false
        })
    }

    reset() {
        const {min, max} = this.props;
        this.setState({
            min: min,
            max: max,
            errorInfo: ''
        })
    }

    render() {
        const { title, dropdownTitle, disabled, style, dropdownStyle } = this.props;
        const { min, max, showDropdown, errorInfo } = this.state;
        return (
            <SectionSelect
                className="m-numberRange-select"
                title={title}
                dropdownTitle={dropdownTitle}
                disabled={disabled}
                style={style}
                dropdownStyle={dropdownStyle}
                showDropdown={showDropdown}
                onToggle={this.onToggle}
                onOk={this.ok}
                onCancel={this.cancel}
            >
                <div className="input-area">
                    <IntInput
                        value={{number: min}}
                        onChange={this.onMinChange}
                        onFocus={this.onInputFocus}
                    >
                    </IntInput>
                    <span className="separator"></span>
                    <IntInput
                        value={{number: max}}
                        onChange={this.onMaxChange}
                        onFocus={this.onInputFocus}
                    >
                    </IntInput>
                </div>
                {
                    errorInfo ?
                    <div className="u-status-error">
                        <p>{errorInfo}</p>
                    </div> : null
                }
            </SectionSelect>
        )
    }
}
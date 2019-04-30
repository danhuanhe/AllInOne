import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionSelect from '../SectionSelect';
import { IntInput } from '../SpecInput';
import './index.less';

export default class TimeSectionSelect extends Component {
    static propTypes = {
        title: PropTypes.string,
        dropdownTitle: PropTypes.string,
        disabled: PropTypes.bool,
        style: PropTypes.object,
        minMinute: PropTypes.string,
        minSecond: PropTypes.string,
        maxMinute: PropTypes.string,
        maxSecond: PropTypes.string,
        onChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        title: '全部',
        dropdownTitle: '选择时间范围',
        disabled: false,
        minMinute: '',
        minSecond: '',
        maxMinute: '',
        maxSecond: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            showDropdown: false,
            minMinute: props.minMinute,
            minSecond: props.minSecond,
            maxMinute: props.maxMinute,
            maxSecond: props.maxSecond,
            errorInfo: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        // 范围改变
        const { minMinute:nextMinMinute, minSecond:nextMinSecond, maxMinute:nextMaxMinute, maxSecond:nextMaxSecond } = nextProps;
        const { minMinute, minSecond, maxMinute, maxSecond } = this.props;

        if(nextMinMinute !== minMinute || nextMinSecond !== minSecond || nextMaxMinute !== maxMinute || nextMaxSecond !== maxSecond ) {

            const times = this.formatTime({
                minMinute: nextMinMinute,
                minSecond: nextMinSecond,
                maxMinute: nextMaxMinute,
                maxSecond: nextMaxSecond,
            }, true);

            this.setState({
                title: this.getTitle(nextProps),
                ...times,
                errorInfo: ''
            })
        }
    }
    
    onInputChange(key, newValue) {
        var number = newValue.number;
        if(key === 'minSecond' || key === 'maxSecond') {
            if(newValue.number*1 > 59) number = '59';
        }
        this.setState({
            [key]: number
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
        const { minMinute, minSecond, maxMinute, maxSecond }  = this.state;

        if((minMinute || minSecond) && (maxMinute || maxSecond)) {
            const min = minMinute*60 + minSecond*1,
                max = maxMinute*60 + maxSecond*1;
            if(min > max) {
                this.setState({
                    errorInfo: '起始时长不得大于截止时长'
                })
                return;
            }
        }
        
        this.setState({
            title: this.getTitle(this.state),
            errorInfo: '',
            showDropdown: false
        })

        this.props.onChange({ minMinute, minSecond, maxMinute, maxSecond } );
    }

    cancel = () => {
        // this.reset();
        this.setState({
            showDropdown: false
        })
    }

    reset() {
        const { minMinute, minSecond, maxMinute, maxSecond } = this.props;
        this.setState({
            minMinute: minMinute,
            minSecond: minSecond,
            maxMinute: maxMinute,
            maxSecond: maxSecond,
            errorInfo: ''
        })
    }

    formatTime = ({ minMinute, minSecond, maxMinute, maxSecond }, isShow=false) => {
        minMinute = parseInt(minMinute, 10);
        minSecond = parseInt(minSecond, 10);
        maxMinute = parseInt(maxMinute, 10);
        maxSecond = parseInt(maxSecond, 10);
        if(isShow) {
            minMinute = minMinute || '';
            minSecond = minSecond || '';
            maxMinute = maxMinute || '';
            maxSecond = maxSecond || '';
        }
        return { minMinute, minSecond, maxMinute, maxSecond };
    }
    getTitle(data) {
        let { minMinute, minSecond, maxMinute, maxSecond } = this.formatTime(data);
        let title='';
        if (!minMinute && !minSecond && !maxMinute && !maxSecond) {
            title = this.props.title;
        } else if (!minMinute && !minSecond) {
            title = '小于' + (!maxMinute ? '' : maxMinute + '分') + (!maxSecond ? '' : maxSecond + '秒');
        } else if (!maxMinute && !maxSecond) {
            title = '大于' + (!minMinute ? '' : minMinute + '分') + (!minSecond ? '' : minSecond + '秒');
        } else {
            title = (!minMinute ? '' : minMinute + '分') + (!minSecond ? '' : minSecond + '秒') +
                '-' + (!maxMinute ? '' : maxMinute + '分') + (!maxSecond ? '' : maxSecond + '秒');
        }
        return title;
    }

    render() {
        const { dropdownTitle, disabled, style } = this.props;
        const { title, minMinute, minSecond, maxMinute, maxSecond, showDropdown, errorInfo } = this.state;
        // const { title, showDropdown, errorInfo } = this.state;
        // const { minMinute, minSecond, maxMinute, maxSecond } = this.formatTime(this.state, true);

        var controlClasslist = ['sel-control', 'fishd-select'];
        if(disabled) controlClasslist.push('fishd-select-disabled');
        var dropdownClassList = ['sel-dropdown', 'fishd-select-dropdown'];
        if(showDropdown) dropdownClassList.push('z-open');
        return (
            <SectionSelect
                className="m-timeSection-select"
                title={title}
                dropdownTitle={dropdownTitle}
                disabled={disabled}
                style={style}
                showDropdown={showDropdown}
                onToggle={this.onToggle}
                onOk={this.ok}
                onCancel={this.cancel}
            >
                <div className="input-area">
                    <div className="input-wrap">
                        <IntInput
                            value={{number: minMinute}}
                            onChange={this.onInputChange.bind(this, 'minMinute')}
                            onFocus={this.onInputFocus}
                        >
                        </IntInput>
                        <span className="unit">分</span>
                    </div>
                    <div className="input-wrap">
                        <IntInput
                            value={{number: minSecond}}
                            onChange={this.onInputChange.bind(this, 'minSecond')}
                            onFocus={this.onInputFocus}
                        >
                        </IntInput>
                        <span className="unit">秒</span>
                    </div>
                    <span className="separator"></span>
                    <div className="input-wrap">
                        <IntInput
                            value={{ number: maxMinute }}
                            onChange={this.onInputChange.bind(this, 'maxMinute')}
                            onFocus={this.onInputFocus}
                        >
                        </IntInput>
                        <span className="unit">分</span>
                    </div>
                    <div className="input-wrap">
                        <IntInput
                            value={{ number: maxSecond }}
                            onChange={this.onInputChange.bind(this, 'maxSecond')}
                            onFocus={this.onInputFocus}
                        >
                        </IntInput>
                        <span className="unit">秒</span>
                    </div>
                </div>
                {
                    errorInfo?
                    <div className="u-status-error">
                        <p>{errorInfo}</p>
                    </div> : null
                }
            </SectionSelect>
        )
    }
}
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popover } from 'ppfish';
import './index.less';

export default class SecitonSelect extends Component {
    static propTypes = {
        title: PropTypes.string,
        dropdownTitle: PropTypes.string,
        disabled: PropTypes.bool,
        showDropdown: PropTypes.bool,
        style: PropTypes.object,
        dropdownStyle: PropTypes.object,
        onToggle: PropTypes.func.isRequired,
        onOk: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {
        title: '全部',
        dropdownTitle: '选择范围',
        disabled: false
    }

    constructor(props) {
        super(props);
    }

    toggle = () => {
        if(this.props.disabled) return;
        this.props.onToggle(!this.props.showDropdown);
    }

    render() {
        const { style, dropdownStyle, title, dropdownTitle, disabled, showDropdown } = this.props;
        var classList = ['m-section-select'];
        var controlClasslist = ['sel-control', 'fishd-select'];
        if(disabled) controlClasslist.push('fishd-select-disabled');
        var dropdownClassList = ['m-section-select-dropdown', 'fishd-select-dropdown'];
        if(this.props.className) {
            classList.push(this.props.className);
            dropdownClassList.push(this.props.className + '-dropdown');
        } 
        if(showDropdown) dropdownClassList.push('z-open');

        const dropdown = (
            <div className={dropdownClassList.join(' ')} style={dropdownStyle}>
                <div className="dropdown-content">
                    <p className="sel-dropdown-title">{dropdownTitle}</p>
                    {this.props.children}
                </div>
                <div className="dropdown-footer fishd-select-dropdown-footer">
                    <Button 
                        className="cancel fishd-select-dropdown-footer-btn"
                        onClick={this.props.onCancel}
                    >取消
                    </Button>
                    <Button 
                        type={'primary'} 
                        className="ok fishd-select-dropdown-footer-btn"
                        onClick={this.props.onOk}
                    >确定
                    </Button>
                </div>
            </div>
        )
        return (
            <Popover
                overlayClassName="m-section-select-popover"
                placement="bottomLeft"
                content={dropdown}
                visible={showDropdown}
                trigger="click"
                onVisibleChange={this.toggle}
            >
                <div className={classList.join(' ')} style={style}>
                    <div className={controlClasslist.join(' ')} onClick={this.toggle}>
                        <div className="fish-select-content">
                            <div className="fishd-select-caret">
                                <Icon type="down-fill" className={showDropdown?'z-open':''} />
                            </div>
                        </div>
                        <span className="fishd-select-option-single">{title}</span>
                    </div>
                </div>
            </Popover>
        )
    }
}
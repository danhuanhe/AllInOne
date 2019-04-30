import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Popover} from 'ppfish';
import DropdownButton from '../DropdownButton';
import debounce from 'lodash/debounce';

import './index.less';

const modulePrefix = 'm-DropdownPopover';

class DropdownPopover extends Component {

  static propTypes = {
    resetTxt: PropTypes.string, // 重置的文字
    onReset: PropTypes.func, // 点击重置的回调
    selectors: PropTypes.arrayOf(PropTypes.element),
    selectorWidth: PropTypes.number,
    children: PropTypes.node, // 按钮上显示的内容
  };

  static defaultProps = {
    resetTxt: '重置筛选条件',
    onReset: () => {},
    children: '筛选',
  };

  state = {
    visible: false,
    selectorsLineWidth: 1040,
  };

  componentDidMount() {
    this.checkWidth();

    this.debounceCheckWidth = debounce(() => {
      this.checkWidth();
    }, 500);
    window.addEventListener('resize', this.debounceCheckWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceCheckWidth)
  }

  checkWidth = () => {
    // 防止popup覆盖到左侧导航栏
    const {selectorWidth, selectors} = this.props;

    // selectors.length >= 4是考虑到selectors一共只有3个时的情况，selectors.length >= 3同理
    if (window.innerWidth > 1395 && selectors.length >= 4) {
      this.setState({selectorsLineWidth: (selectorWidth + 10) * 4});
    } else if (window.innerWidth > 1137 && selectors.length >= 3) {
      this.setState({selectorsLineWidth: (selectorWidth + 10) * 3});
    } else {
      this.setState({selectorsLineWidth: (selectorWidth + 10) * 2});
    }
  };

  render() {
    let {resetTxt, onReset, selectors, children, ...others} = this.props;

    return (
      <Popover
        placement="bottomRight"
        content={
          <div
            className={`${modulePrefix}-content`}
          >
            <div className={`${modulePrefix}-reset`}>
              <div className={`${modulePrefix}-reset-txt`} onClick={onReset}>{resetTxt}</div>
            </div>
            <div className={`${modulePrefix}-selectors`} style={{width: this.state.selectorsLineWidth}}>
              {selectors}
            </div>
          </div>
        }
        trigger="click"
        onVisibleChange={visible => this.setState({visible})}
        {...others}
      >
        <DropdownButton visible={this.state.visible}>
          {children}
        </DropdownButton>
      </Popover>
    );
  }
}

export default DropdownPopover;

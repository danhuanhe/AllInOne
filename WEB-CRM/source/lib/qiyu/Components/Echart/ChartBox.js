import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Button} from 'ppfish';
const ButtonGroup = Button.Group;
import _ from 'lodash';

import './ChartBox.less';

const modulePrefix = 'm-echart-ChartBox';

import HeadConditionTitle from '../HeadConditionTitle';


export default class ChartBox extends Component {
  static propTypes = {
    title: PropTypes.node, // 标题
    onSwitch: PropTypes.func, // 图/表切换时调用的函数。不传则不展示图/表按钮
  }

  state = {
    curShow: 'chart'
  }

  render() {
    const {title, onSwitch, className = '', style, titleStyle, children} = this.props;
    return (
      <div className={`${modulePrefix} ${className}`} style={style}>
        <div className={`${modulePrefix}-title`} style={titleStyle}>
          {
            _.get(title, 'type.name', undefined) === HeadConditionTitle.name ? (
              <title.type
                style={{display: 'inline-block'}}
                titleStyle={{fontSize: '16px', color: '#22222'}}
                {...title.props}
              />
            ) : title
          }
          {onSwitch ? (
            <div className={`${modulePrefix}-switch`}>
              <ButtonGroup>
                <Button
                  type={this.state.curShow === 'chart' ? 'primary' : 'normal'}
                  onClick={() => {
                    this.setState({curShow: 'chart'});
                    onSwitch('chart');
                  }}
                >
                  图
                </Button>
                <Button
                  type={this.state.curShow === 'table' ? 'primary' : 'normal'}
                  onClick={() => {
                    this.setState({curShow: 'table'});
                    onSwitch('table');
                  }}
                >
                  表
                </Button>
              </ButtonGroup> 
            </div>
          ): null}
        </div>
        {children}
      </div>
    );
  }
}
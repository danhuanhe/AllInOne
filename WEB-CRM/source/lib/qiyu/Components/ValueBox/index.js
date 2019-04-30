import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {number2fixed} from '../../utils';

import './index.less';

const moduelPerfix = 'm-ValueBox';

export default class ValueBox extends Component  {
  shouldComponentUpdate(nextProps) {
    // 是否存在一个prop发生变化。如果该prop是object，仅比较第一层属性
    return Object.keys(nextProps).some((key) => {
      if (typeof nextProps[key] === 'object') {
        return Object.keys(nextProps[key]).some((key2) => nextProps[key][key2] !== this.props[key][key2]);
      }
      return nextProps[key] !== this.props[key];
    });
  }

  render() {
    const {
      set1 = ['', ''],
      set2 = ['', ''],
      set3 = ['', ''],
      className = '',
      simple,
      body,
      ...others
    } = this.props;
  
    const checkValue = (val) => {
      if (val < 0) return '--';
      return val;
    };

    const parseNumber = number => number === parseInt(number, 10) ? number2fixed(number) : number;

    if (set1[1]) set1[1] = parseNumber(set1[1]);
    if (set2[1]) set2[1] = parseNumber(set2[1]);
    if (set3[1]) set3[1] = parseNumber(set3[1]);

    return (
      <div className={`${moduelPerfix} ${className}`} {...others}>
        <div className={`${moduelPerfix}-top`}>
          <div title={checkValue(set1[0])}>
            {checkValue(set1[0])}
          </div>
          <div title={checkValue(set1[1])}>
            {checkValue(set1[1])}
          </div>
        </div>
        {!simple && (
          <div className={`${moduelPerfix}-bottom`}>
          {
            body ? body : (
              <React.Fragment>
                <div title={`${checkValue(set2[0])} ${checkValue(set2[1])}`}>
                  {checkValue(set2[0])}<span>{checkValue(set2[1])}</span>
                </div>
                <div title={`${checkValue(set3[0])} ${checkValue(set3[1])}`}>
                  {checkValue(set3[0])}<span>{checkValue(set3[1])}</span>
                </div>
              </React.Fragment>
            )
          }
          </div>
        )}
      </div>
    );
  }
}

ValueBox.propTypes = {
  // 上半身显示的一对属性和值
  set1: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  // 下半身第一行显示的一对属性和值
  set2: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  // 下半身第二行显示的一对属性和值
  set3: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  // 是否显示下半身，simple为true则不显示
  simple: PropTypes.bool,
  className: PropTypes.string,
};

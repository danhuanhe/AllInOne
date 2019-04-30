/**
 * 筛选条件组件标题
 */

import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { Popover } from 'ppfish';
import _ from 'lodash';

import InfoBanner from '../InfoBanner';

import './HeadConditionTitle.less';

const TIP_STYLE = {
  p_style: {
    marginBottom: '6px',
    fontSize: '14px',
    display: 'flex',
    maxWidth: '780px'
  },
  key_style: {
    width: '165px',
    display: 'inline-block',
    color: '#333',
    flexShrink: 0,
  },
  value_style: {
    color: '#666',
    display: 'inline-block',
  }
};

class HeadConditionTitle extends Component {

  static defaultProps = {
    placement: 'bottomLeft',
    getPopupContainer: () => document.body
  }

  static propTypes = {
    title: PropTypes.node.isRequired,
    tips: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    tipStyle: PropTypes.object,
    placement: PropTypes.string,
    style: PropTypes.object,
    right: PropTypes.node,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { className = '', title, tips, info, placement, style, titleStyle, tipStyle = TIP_STYLE, getPopupContainer, right } = this.props;
    const moduelPerfix = 'm-headCondition';

    let Tip;
    if (Array.isArray(tips)) {
      Tip = (
        <Popover
          content={tips.map((tip, index) => {
            return (<p style={{...tipStyle.p_style, ...(index === tips.length - 1 ? {marginBottom: 0} : {})}} key={index}>
              {tip.title && <span style={tipStyle.key_style}>{tip.title}</span>}
              {tip.content && <span style={tipStyle.value_style}>{tip.content}</span>}
              {tip.image && <img style={tipStyle.image_style} src={tip.image} />}
            </p>);
          })}
          placement={placement}
          arrowPointAtCenter
          getPopupContainer={getPopupContainer}
        >
          <i className="iconfont icon-prompt-informationx" />
        </Popover>
      );
    } else if (tips) {
      Tip = (
        <Popover
          content={
            <p style={{...tipStyle.p_style, marginBottom: 0}}>
              {tips}
            </p>
          }
          placement={placement}
          arrowPointAtCenter
          getPopupContainer={getPopupContainer}
        >
          <i className="iconfont icon-prompt-informationx" />
        </Popover>
      );
    }

    let infoContent;
    if (info) {
      if (_.get(info, 'type.name', undefined) === InfoBanner.name) {
        infoContent = <info.type {...info.props} />;
      } else {
        infoContent = <InfoBanner>{info}</InfoBanner>;
      }
    }

    return (
      <div className={className}>
        <div className={`${moduelPerfix}-head`} style={style}>
          <span className={`${moduelPerfix}-head__title`} style={titleStyle}><span className={`${moduelPerfix}-head__title__txt`}>{title}</span>{Tip}</span>
          {right ? <div className={`${moduelPerfix}-head__right`} >{right}</div> : null}
        </div>
        {info && <div style={{marginTop: '11px'}}>
          {infoContent}
        </div>}
      </div>
    );

  }
}

export default HeadConditionTitle;

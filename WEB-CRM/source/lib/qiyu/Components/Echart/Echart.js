/**
 * 对图表的简单封装
 * @type {Object}
 */
import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Echart, Popover, Spin} from 'ppfish';

import './Echart.less';
import './Tooltip.less';

//Popover的提示样式，全局统一
const TIP_STYLE = {
  p_style: {
    marginBottom: '6px',
    fontSize: '14px'
  },
  key_style: {
    width: '165px',
    display: 'inline-block',
    color: '#333'
  },
  value_style: {
    color: '#666'
  }
};

export default class EchartComponent extends Component {
  static propTypes = {
    className: PropTypes.string, // 给EchartComponent最外层div额外加上class，方便写样式
    loading: PropTypes.bool, // 数据是否正在加载，为true时会显示加载动画
    title: PropTypes.string, //图表的标题
    children: PropTypes.node, //图表附属展示，目前饼图用于展示legend
    help: PropTypes.oneOfType([PropTypes.array, PropTypes.string]), //图表的tootip提示
    showType: PropTypes.node, //图表的显示形式，按天还是按日的选择
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hasBorder: PropTypes.bool, //是否有边框
    bordered: PropTypes.bool, //是否有整体的边框 例子见呼叫中心管理端 - 实时看板 - 呼损数据
    option: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]), //图表的配置  为false时表示没有数据，此时图表显示暂时没有数据
    name: PropTypes.string,
    legend: PropTypes.node, // 加载Legend组件
    pieTitle: PropTypes.string, // 饼图下方的title（文字超过最大长度时末尾省略，hover展示全部。直接用echart的title比较难做到）
  }

  constructor(props) {
    super(props);
    this.option = props.option;
  }

  componentWillUpdate({option}) {
    this.option = option;
    const prevType = this.echartRef && this.echartRef.getInstance()._api.getOption().series[0].type;
    if (_.get(this, 'option.toolbox.show', false) && prevType) {
      this.option.series.forEach(s => {
        s.type = prevType;
      });
    }
  }

  getEchartInstance = () => {
    if (this.echartRef) {
      return this.echartRef.getInstance();
    }
  };

  render() {
    const {
      option,
      title,
      help,
      showType,
      hasBorder = false,
      height = 420,
      className = '',
      loading,
      legend,
      pieTitle,
      children,
      name,
      forwardedRef,
      bordered,
      style,
    } = this.props;
    const moduelPerfix = 'm-echart';
    let tip = '';

    if (_.isArray(help)) {
      tip = help.map((h, index) => {
        return (<p style={TIP_STYLE.p_style} key={index}>
          <span style={TIP_STYLE.key_style}>{h.title}</span>
          <span style={TIP_STYLE.value_style}>{h.content}</span>
        </p>);
      });
    } else if (_.isString(help)) {
      tip = (<span style={TIP_STYLE.value_style}>{help}</span>);
    }

    return (<div className={`${moduelPerfix} ${bordered ? moduelPerfix + '-bordered' : '' } ${className}`} style={style}>

      {(title || showType) && <div className={`${moduelPerfix}-title`} style={showType ? {} : {marginBottom: '10px'}}>
        <div>
          {
            tip
              ? <Popover content={tip} placement="right">
                  <span className={`${moduelPerfix}-titleTxt`}>{title}</span>
                  <i className="iconfont icon-prompt-informationx"/>
                </Popover>
              : <span className={`${moduelPerfix}-titleTxt`}>{title}</span>
          }
        </div>
        {showType}
      </div>}
      <div className={`${moduelPerfix}-body ${hasBorder
          ? 'border'
          : ''}`}>
        {loading && (
          <Spin.Container
            style={{
              width: '100%',
              height,
              position: 'absolute',
              zIndex: 100,
          }}>
            <Spin />
          </Spin.Container>
        )}
        {
          this.option
            ? <span>
              <div className={`${moduelPerfix}-chart`}>
                <Echart
                  ref={ref => this.echartRef = ref}
                  option={this.option}
                  style={{
                    width: '100%',
                    height: legend ? `${String(height).split('px')[0] * .9}px` : height,
                    margin: legend ? `${String(height).split('px')[0] * .05}px 0` : ''
                  }}
                />
                {pieTitle &&
                  <div title={pieTitle} className={`${moduelPerfix}-pieTitle`}>{pieTitle}</div>
                }
              </div>
              {legend &&
                // 把option传给legend组件
                <legend.type {...legend.props} option={this.option} />
              }
              {children}
            </span>
            : <span style={{
              height
            }}>
              {!loading &&
                <i className="iconfont icon-list" style={{
                  flex: 'none'
                }}>暂无数据</i>}
            </span>
        }
      </div>
    </div>);
  }
}

// export default React.forwardRef((props, ref) => {
//   return <EchartComponent {...props} forwardedRef={ref} />;
// });

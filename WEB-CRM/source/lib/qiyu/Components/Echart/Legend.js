/**
 * 对饼图的Legend简单封装
 * @type {Object}
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Echart, Modal, Table} from 'ppfish';
import {getRatio} from './initOption';
import {number2ratio} from '../../utils';

import './Legend.less';

class Legend extends Component {
  static propTypes = {
    series: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // modal里table每行的key
      name: PropTypes.string.isRequired, // 名称
      color: PropTypes.string, // 颜色
      tip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // 名称后面显示的东西
      renderTip: PropTypes.func, // 名称后显示的东西，调用时会把当前对象传进去(类似renderTip(series[i]))，方便取用。若无该值则用上面的tip
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // modal里table每行的值，用于计算每行占比
      occupy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // modal里table每行占比。若无该值则取上面value计算的值
    })),

    // EchartComponent传进来的值，为了绘制modal中的图
    option: PropTypes.object,
    /**
     * 默认有“分类名称”、“占比”两个column，分别对应series中的name和occupy的值，
     * 不够在这里加，格式与ppfish的Table里columns属性一样。从series中取值
     */
    additionalColumns: PropTypes.array,

    // 完全覆盖默认的column
    columns: PropTypes.array,

    // modal的prop，会覆盖默认的值，比如想改变modal的title就传{title: “lalala”}
    modalProps: PropTypes.object,

    // 对series进行filter，filter结果仅影响饼图右侧的展示，不影响表格展示（表格依旧展示全部series）（该属性是为了满足咨询分类模块需求）
    mainContentFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  state = {
    showModal: false,
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  handleClickMore = () => this.setState({showModal: true})

  handleModalCancel = () => this.setState({showModal: false})

  render() {
    let {
      series = [],
      option,
      columns,
      mainContentFilter = () => true,
      additionalColumns = [],
      modalProps = {},
    } = this.props;
    const moduelPerfix = 'm-echart-legend';

    if (series[0] && !series[0].occupy) {
      series.forEach((s, i) => s.occupy = getRatio(i, series, undefined, o => o.value));
    }
    // table组件需要key属性，漏掉会报错
    if (series[0] && !series[0].key) {
      series.forEach((s, i) => s.key = i);
    }

    const defaultColumns = columns || [{
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      width: additionalColumns ? '45%' : '50%'
    }, {
      title: '个数',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
      render: (v) => v + '个',
    }, {
      title: '占比',
      dataIndex: 'occupy',
      key: 'occupy',
      sorter: (a, b) => a.value - b.value,  // 不按照occupy的值排序是因为occupy的值只保留整数，排序时可能会有一定误差，按照value排则是准确的
      render: (o) => o + '%',
      defaultSortOrder: 'descend',
    }];

    const mainContentSeries = series.filter(mainContentFilter).slice(0, 5);

    return (
      <div>
        <ul className={moduelPerfix}>
          {
            mainContentSeries.map((s, i) => (
              (s.renderTip || s.tip) && (
                <li key={i}>
                  <div className={`${moduelPerfix}-txt`}>
                    <span>
                      <i className={`${moduelPerfix}-circle`} style={{
                        backgroundColor: s.color
                      }}/>
                    </span>
                    <span className={`${moduelPerfix}-txt-left`} title={s.name}>{s.name.slice(0,14)}</span>
                    <span className={`${moduelPerfix}-txt-right`} title={s.renderTip ? '' : s.tip}>{
                      s.renderTip ? s.renderTip(s) : s.tip
                    }</span>
                  </div>
                </li>
              )
            ))
          }
        </ul>
        {
          (series.length > mainContentSeries.length) && (
            <div
              className={`${moduelPerfix}-btn-more`}
              onClick={this.handleClickMore}
            >更多</div>
          )
        }
        {
          (series.length > mainContentSeries.length) && option && (
            <Modal
              title="更多"
              visible={this.state.showModal}
              onCancel={this.handleModalCancel}
              footer={null}
              width="600px"
              bodyStyle={{
                display: 'flex',
              }}
              draggable
              {...modalProps}
            >
              <Echart
                option={option}
                style={{
                  height: '260px',
                  flex: 0.8,
                  margin: 'auto'
                }}
              />
              <Table
                className={`${moduelPerfix}-table`}
                columns={[...defaultColumns, ...additionalColumns]}
                dataSource={series}
                pagination={false}
                onChange={this.hanleTableChange}
                style={{
                  flex: 1
                }}
              />
            </Modal>
          )
        }
      </div>
    );
  }
}

export default Legend;

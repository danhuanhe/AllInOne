import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Trend, Table, Button, Ellipsis} from 'ppfish';
const ButtonGroup = Button.Group;
import _ from 'lodash';

import {number2ratio, number2fixed} from '../../utils';
import HeadConditionTitle from '../HeadConditionTitle';

import Echart from './Echart';

import './DoughnutChart.less';

const modulePrefix = 'm-echart-DoughnutChart';

export default class DoughnutChart extends Component {
  static propTypes = {
    customMiddleContent: PropTypes.node, // 自定义的环形图中间内容，不传则会生成默认的
    option: PropTypes.object, // 就是Echarts的option，见https://echarts.baidu.com/option.html#title
    loading: PropTypes.bool, // 是否正在加载
    height: PropTypes.number, // 图的高度
    title: PropTypes.node, // 标题。一般可传String，或HeadConditionTitle
    showTable: PropTypes.bool, // 是否显示表格（通过右上角图/表按钮切换）。默认为true
    column1Title: PropTypes.node, // 表格第一列标题
    customTable: PropTypes.node, // 自定义的表格，不传则会生成默认的表格

    className: PropTypes.string,
    middleContentClassName: PropTypes.string,
  }

  state = {
    middleData: undefined,
    curShow: 'chart',
  }

  componentDidMount() {
    // 第一次不一定能取到instance
    let tryCount = 0;
    let interval = setInterval(() => {
      tryCount++;
      this.echartInstance = this.getEchartInstance();
      if (this.echartInstance) {
        this.echartInstance.on('mouseover', (params) => {
          this.setState({middleData: {...params.data, color: params.color, percent: params.percent}});
        });
      }
      if (tryCount > 20) {
        clearInterval(interval);
      }
    } , 150);
  }

  // componentDidUpdate() {
  //   if (this.props.column1Title == '二级分类名称') {
  //     console.log(this.echartInstance != this.getEchartInstance())
  //   }
  //   if (this.echartInstance != this.getEchartInstance()) {
  //     this.echartInstance = this.getEchartInstance();
  //     this.echartInstance.on('mouseover', (params) => {
  //       this.setState({middleData: {...params.data, color: params.color, percent: params.percent}});
  //     });
  //   }
  // }

  getEchartInstance = () => {
    if (this.categoryPieRef) {
      return this.categoryPieRef.getEchartInstance();
    }
  };

  render() {
    let {
      customMiddleContent,
      option,
      loading,
      height = 300,
      title = '',
      showTable = false,
      column1Title = '',
      customTable,
      className = '',
      middleContentClassName = '',
      ...otherProps
    } = this.props;
    const {middleData, curShow} = this.state;


    const dataSource = _.get(option, 'series.data', null);

    let columns = [];
    if (dataSource) {
      const sum = dataSource.reduce((prev, cur) => prev + cur.value, 0);
      columns = [{
        title: column1Title,
        dataIndex: 'name',
      }, {
        title: '数量',
        dataIndex: 'value',
        width: '25%'
      }, {
        title: '占比',
        dataIndex: 'percent',
        width: '25%',
        render: (percent, {value}) => number2ratio(percent || value / sum, 2)
      }];
    }

    if (_.get(dataSource, '[0].chain', undefined) !== undefined) {
      columns.push({
        title: '环比',
        dataIndex: 'preValue',
        width: '22%',
        render: (preValue, {value, chain}) => {
          if (chain == 0) {
            return number2ratio(chain);
          }
          let upOrDown = 'up';
          if (chain < 0) upOrDown = 'down';
          return <Trend flag={chain > 0 ? 'up': 'down'}>{number2ratio(chain)}</Trend>;
        }
      });
      columns[1].width = '18%';
      columns[2].width = '18%';
    }

    let middleContent = customMiddleContent;
    if (!middleContent) {
      middleContent = middleData && (
        <div className={`${modulePrefix}-content ${middleContentClassName}`} style={{color: middleData.color}}>
          <div title={`${middleData.name}：${number2fixed(middleData.value, 0)}个`}>
            <div className={`${modulePrefix}-content-left`}>
              <Ellipsis width="100%">{middleData.name}</Ellipsis>
            </div>
            <div className={`${modulePrefix}-content-middle`}>:</div>
            <div className={`${modulePrefix}-content-right`}>
              <Ellipsis width="100%">{number2fixed(middleData.value, 0)}个</Ellipsis>
            </div>
          </div>
          <div title={`占比：${middleData.percent}%`}>
            <div className={`${modulePrefix}-content-left`}>占比</div>
            <div className={`${modulePrefix}-content-middle`}>:</div>
            <div className={`${modulePrefix}-content-right`}>{`${middleData.percent}%`}</div>
          </div>
          {middleData.chain !== undefined && <div title={`环比${number2ratio(middleData.chain)}`}>
            <div className={`${modulePrefix}-content-left`}>环比</div>
            <div className={`${modulePrefix}-content-middle`}>:</div>
            <div className={`${modulePrefix}-content-right`}>
              <Trend flag={middleData.chain > 0 ? 'up': 'down'}>{number2ratio(middleData.chain)}</Trend>
            </div>
          </div>}
        </div>
      );
    }

    return (
      <div className={`${modulePrefix} ${className}`}>
        <div className={`${modulePrefix}-title`} style={showTable ? {minHeight: '20px'} : {}}>
          {
            _.get(title, 'type.name', undefined) === HeadConditionTitle.name ? (
              <title.type
                style={{fontSize: '16px', color: '#22222', display: 'inline-block'}}
                {...title.props}
              />
            ) : title
          }
          {showTable && <ButtonGroup style={{position: 'absolute', right: '10px', top: 0, zIndex: 100}}>
            <Button
              type={curShow === 'chart' ? 'primary' : 'normal'}
              onClick={() => this.setState({curShow: 'chart'})}
            >
              图
            </Button>
            <Button
              type={curShow === 'table' ? 'primary' : 'normal'}
              onClick={() => this.setState({curShow: 'table'})}
            >
              表
            </Button>
          </ButtonGroup>}
        </div>
        <div className={`${modulePrefix}-chart`} style={curShow === 'chart' ? {} : {display: 'none'}}>
          <Echart
            ref={ref => this.categoryPieRef = ref}
            option={option}
            loading={loading}
            height={height}
            {...otherProps}
          />
          <div className={`${modulePrefix}-middle`}>
            {/* {middleContent} */}
            {middleContent}
          </div>
        </div>
        {showTable && <div className={`${modulePrefix}-table`} style={curShow === 'chart' ? {display: 'none', height} : {height}}>
          {customTable ? customTable :
            <Table
              loading={loading}
              columns={columns}
              style={{width: '94%', marginTop: '-10px'}}
              dataSource={_.get(option, 'series.data', null)}
              pagination={false}
              rowKey="name"
              // size="small"
              scroll={{
                y: `${height}`.replace('px', '') - 60,
              }}
            />
          }
        </div>}
      </div>
    );
  }
}

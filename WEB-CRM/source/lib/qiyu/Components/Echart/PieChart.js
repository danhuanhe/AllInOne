import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Trend, Table, Button} from 'ppfish';
const ButtonGroup = Button.Group;
import _ from 'lodash';

import {number2ratio, number2fixed} from '../../utils';
import Echart from './Echart';
import HeadConditionTitle from '../HeadConditionTitle';

import './PieChart.less';

const modulePrefix = 'm-echart-PieChart';



export default class PieChart extends Component {
  state = {
    curShow: 'chart',
  }

  render() {
    const {
      title,
      className = "",
      showTable = false,
      column1Title = '',
      customTable,
      style,
      option,
      loading,
      height,
      ...otherProps
    } = this.props;

    const {curShow} = this.state;

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

    return (
      <div className={`${modulePrefix} ${className}`} style={style}>
        <div className={`${modulePrefix}-title`}>
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
            option={option}
            loading={loading}
            height={height}
            {...otherProps}
          />
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

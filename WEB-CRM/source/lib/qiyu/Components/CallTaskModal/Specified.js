import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Form, Spin, Radio, InputNumber, Select, Table, message} from 'ppfish';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const OptGroup = Select.OptGroup;
const Option = Select.Option;
import _ from 'lodash';

import {pySegSort} from '../../utils';


import {
  getKefuIpcclist,
  saveCallTask
} from './actions';

import './index.less';

const modulePrefix = "m-CallTaskModal-Specified";

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

class Specified extends Component {
  constructor({getValidateFunc, initialData}) {
    super();
    this.isEdit = false;
    getValidateFunc && getValidateFunc(this.validateAndSubmit);
    this.reset();
    if (initialData) {
      this.state.seats = initialData.map(({seatId, seatName, count}) => ({id: `${seatId}`, realname: seatName, num: count}));
      this.isEdit = true;
    }
  }

  componentWillReceiveProps({initialData}) {
    if (initialData) {
      this.setState({
        seats: initialData.map(({seatId, seatName, count}) => ({id: `${seatId}`, realname: seatName, num: count}))
      });
      this.isEdit = true;
    }
  }

  reset = () => {
    this.state = {
      seatType: 0,
      seats: [],
    };
  }

  handleInputChange = (id, num) => {
    if (!Number.isInteger(num) || num < 0) return;

    const seats = this.state.seats.map(seat => {
      if (seat.id == id) {
        return {
          ...seat,
          num,
        };
      } else {
        return seat;
      }
    });
    const restCount = this.props.validCount - seats.reduce((prev, {num}) => prev + num, 0);
    if (restCount < 0) {
      // 如果剩余可分配数大于0，仅标识刚修改的坐席hasError为true
      seats.forEach(seat => {
        if (seat.id == id) {
          // 只标识刚修改的
          seat.hasError = true;
        }
      });
    } else {
      // 如果剩余可分配数大于0，则把所有坐席hasError设为false
      seats.forEach(seat => {
        seat.hasError = false;
      });
    }
    this.setState({seats});
  }

  handleRemove = (id) => {
    this.setState({seats: this.state.seats.filter(seat => seat.id != id)});
  }

  validateAndSubmit = () => {
    const restCount = this.props.validCount - this.state.seats.reduce((prev, {num}) => prev + num, 0);
    if (restCount < 0) {
      return;
    }
    if (restCount > 0) {
      message.error(`剩余可分配任务数还剩${restCount}条，请继续分配`);
    } else if (this.state.seats.some(({num}) => num == 0)) {
      message.error('指定坐席分配任务数不可为0');
    } else {
      this.props.submit({
        amount: this.state.seats.map(({id, num}) => ({seatId: id, count: num}))
      });
    }
  }

  render() {
    let {validCount, KefuIpcclist, initialData} = this.props;
    
    const restCount = validCount - this.state.seats.reduce((prev, {num}) => prev + num, 0);
    let seatsNum = this.state.seats.length;
    if (initialData) {
      validCount = initialData.reduce((prev, cur) => prev + cur.count, 0);
      seatsNum = initialData.length;
    }

    const columns = [{
      title: '指定坐席',
      dataIndex: 'realname',
      key: 'realname',
    }, {
      title: '分配任务数',
      dataIndex: 'num',
      key: 'num',
      width: '150px',
      render: (num, {id, hasError}) => (
        <div className={hasError ? `${modulePrefix}-errorInput` : ''}>
          <InputNumber
            style={{width: '110px', marginRight: '8px'}}
            min={0}
            value={num}
            disabled={this.isEdit}
            onChange={value => this.handleInputChange(id, value)}
          />
          条
        </div>
      )
    }, {
      title: '操作',
      key: 'operation',
      width: '70px',
      render: (val, {id}) => this.isEdit ? (
        <a className={`iconfont icon-fd-deletex ${modulePrefix}-disabledDelete`} title="删除" />
      ) : (
        <a className="iconfont icon-fd-deletex" title="删除" onClick={e => this.handleRemove(id)}/>
      )
    }];

    return (
      <div className={modulePrefix}>
        {KefuIpcclist.loading ? (
          <Spin />
        ) : (
          <>
            <FormItem
              {...formItemLayout}
              label="     分配详情"
            >
              <Select
                showSearch
                mode="multiple"
                labelClear={!this.isEdit}
                placeholder="请选择坐席"
                disabled={this.isEdit}
                filterOption={(input, option) => {
                  return (
                    option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                    option.props.pinyin.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                value={this.state.seats.map(({id}) => id)}
                onChange={seatIds => {
                  this.setState({seats: seatIds.map(id => {
                    const find = this.state.seats.find(seat => seat.id == id);
                    if (find) {
                      return find;
                    } else {
                      return {
                        id,
                        realname: KefuIpcclist.data.kefuMap.get(id).realname,
                        num: 0
                      };
                    }
                  })});
                }}
                getPopupContainer={() => document.querySelector('.m-CallTaskModal-Create-modal')}
                notFoundContent="当前暂无坐席"
                style={{width: '100%'}}
              >
                {
                  pySegSort(_.get(KefuIpcclist, 'data.kefu', []), ({pinyin}) => pinyin).map(({group, values}) => (
                    <OptGroup label={group} key={group}>
                      {
                        values.map(({id, realname, pinyin}) => (
                          <Option key={`${id}`} title={realname} pinyin={pinyin}>{realname}</Option>
                        ))
                      }
                    </OptGroup>
                  ))
                }
              </Select>
              <div className={`${modulePrefix}-head`}>
                <div>有效任务<span>{validCount}</span>条</div>
                <div>已指定坐席<span>{this.state.seats.length}</span>人</div>
                {!initialData && <div>剩余可分配数<span>{restCount}</span>条</div>}
              </div>
              <Table
                columns={columns}
                dataSource={this.state.seats}
                scroll={{
                  y: 'calc(100vh - 330px)'
                }}
                rowKey="id"
                pagination={false}
              />
              <div className={`fishd-form-explain ${restCount < 0 ? `${modulePrefix}-txtErr` : `${modulePrefix}-txt`}`}>已达任务数上限，无剩余可分配数</div>
            </FormItem>
          </>
        )}
      </div>
    );
  }
}



const mapStateToProps = state => state;


const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, bindActionCreators({
    getKefuIpcclist,
    saveCallTask
  }, dispatch));
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Specified));
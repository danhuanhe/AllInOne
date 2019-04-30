import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Form, Spin, Radio, Select, message} from 'ppfish';
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

const modulePrefix = "m-CallTaskModal-RandomBox";

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

class RandomBox extends Component {
  constructor({getValidateFunc, initialData}) {
    super();
    getValidateFunc(this.validateAndSubmit);
    if (initialData) {
      this.groupIds = initialData.groupIds;
      this.seatIds = initialData.seatIds;
      this.state = {
          seatType: initialData.seatType,
      };
    } else {
      this.groupIds = [];
      this.seatIds = [];
      this.state = {
        seatType: 0
      };
    }
  }
  
  reset = () => {
    this.setState({seatType: 0});
    this.props.form.setFieldsValue({
      seatIds: [],
      groupIds: [],
    });
    this.groupIds = [];
    this.seatIds = [];
  }

  componentDidMount() {
    this.props.getForm && this.props.getForm(this.props.form);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible && nextProps.initialData) {
      const initialData = nextProps.initialData;
      this.setState({seatType: initialData.seatType});
      this.props.form.setFieldsValue({
        seatIds: initialData.seatIds,
        groupIds: initialData.groupIds,
      });
    } else if (nextProps.show && !this.props.show) {
      this.reset();
    }
  }

  validateAndSubmit = () => {
    const {validateFields} = this.props.form;
    
    return new Promise((resolve, reject) => {
      validateFields((err, values) => {
        if (!err) {
          let data = {seatType: this.state.seatType};
          if (this.groupIds) {
            data.groupIds = this.groupIds.join(',');
          }
          if (this.seatIds) {
            data.seatIds = this.seatIds.join(',');
          }
          const result = this.props.submit(data);
          result && result.then(resolve).catch(reject);
        } else {
          reject();
        }
      });
    });
  }

  render() {
    const {KefuIpcclist, form} = this.props;
    const  {getFieldDecorator, getFieldValue} = form;
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
              <RadioGroup
                value={this.state.seatType}
                ref={ref => this.seatTypeRef = ref}
                onChange={(e) => {
                  this.setState({seatType: e.target.value});
                }}
              >
                <Radio value={0}>指定坐席</Radio>
                <Radio value={1}>指定客服组 </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label=" "
              style={{marginTop: '-10px'}}
            >
            {
              this.state.seatType == 0 && getFieldDecorator('seatIds', {
                initialValue: this.seatIds,
                rules: [{
                  validator: (rule, value, callback) => {
                    if (!value || value.length < 1) {
                      callback('处理坐席不得为空');
                    } else {
                      callback();
                    }
                  }
                }],
              })(
                <Select
                  showSearch
                  mode="multiple"
                  labelClear
                  placeholder="请选择坐席"
                  filterOption={(input, option) => {
                    return (
                      option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                      option.props.pinyin.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={seatIds => this.seatIds = seatIds}
                  // getPopupContainer={() => 
                  //   document.querySelector('.m-CallTaskModal-Create-modal') ||
                  //   document.querySelector('.m-CallTaskModal-Edit-modal .fishd-modal-body')
                  // }
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
              )
            }
            {
              this.state.seatType == 1 && getFieldDecorator('groupIds', {
                initialValue: this.groupIds,
                rules: [{
                  validator: (rule, value, callback) => {
                    if (!value || value.length < 1) {
                      callback('处理客服组不得为空');
                    } else {
                      callback();
                    }
                  }
                }],
              })(
                <Select
                  showSearch
                  mode="multiple"
                  labelClear
                  placeholder="请选择客服组"
                  filterOption={(input, option) => {
                    return (
                      option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                      option.props.pinyin.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={groupIds => this.groupIds = groupIds}
                  // getPopupContainer={() => 
                  //   document.querySelector('.m-CallTaskModal-Create-modal') ||
                  //   document.querySelector('.m-CallTaskModal-Edit-modal .fishd-modal-body')
                  // }
                  notFoundContent="当前暂无客服分组"
                  style={{width: '100%'}}
                >
                  {
                    pySegSort(_.get(KefuIpcclist, 'data.kefuGroup', []), ({pinyin}) => pinyin).map(({group, values}) => (
                      <OptGroup label={group} key={group}>
                        {
                          values.map(({id, name, staffCount, pinyin}) => (
                            <Option key={`${id}`} title={`${name}（${staffCount}坐席）`} pinyin={pinyin}>{`${name}（${staffCount}坐席）`}</Option>
                          ))
                        }
                      </OptGroup>
                    ))
                  }
                </Select>
              )
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(RandomBox));
import React, {Component} from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Modal, Spin, Form, Input, InputNumber, DatePicker, Radio, Popover, Select, Switch, Icon, message} from 'ppfish';
const FormItem = Form.Item;
const DateRangePicker = DatePicker.DateRangePicker;
const Counter = Input.Counter;
const OptGroup = Select.OptGroup;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import _ from 'lodash';

import {DAY, getWindowVar, pySegSort} from '../../utils';
import CustomUploader from '../CustomUploader';
import {
  getKefuIpcclist,
  getDidList,
  checkCallTask,
  saveCallTask,
  saveCallTaskOpenapi
} from './actions';
import RandomBox from './RandomBox';
import Specified from './Specified';
import InfoBanner from '../InfoBanner';

import './index.less';

const modulePrefix = "m-CallTaskModal-Step1";

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

const curDate = (new Date()).setHours(0, 0, 0, 0);

const initialDate = [
  new Date(curDate + DAY),
  new Date(curDate + DAY * 6 - 60 * 1000),
];
const dateRange = [
  new Date(curDate - 1000),
  new Date(curDate + DAY * 180)
];

const calltaskDocUrl = getWindowVar('setting.calltaskDocUrl');

const isRelationType = !!getWindowVar('setting.base.corpPermission.USERCENTER') && !!getWindowVar('setting.base.corpPermission.USERCENTER_SRAFF_SIDE');
const forecastCallEnable = !!getWindowVar('setting.corpPermission.OUTCALL_TASKFORECAST');
let hasForecastCall = false;

class Step1 extends Component {
  static propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    lossIds: PropTypes.string,
    export: PropTypes.bool, // true: 客户中心|呼损列表; false: 外呼任务 
    editData: PropTypes.object, // 外呼任务编辑
  }

  constructor(props) {
    super();
    this.state = {
      forecastType: 0,
      hideNumber: 0,
      CustomUploaderKey: 0,
      seatTypeErrTxt: 0,
      startTimeDisabled: false,
    };

    this.isEdit = !_.isEmpty(props.editData);
    if (!this.isEdit) {
      this.reset(props);
      props.getRestFunc(this.reset);
    }
    props.getSubmit(this.handleSubmit);
  }

  componentDidMount() {
    this.props.getKefuIpcclist();
    this.props.getDidList();

    const {editData} = this.props;
    if (this.isEdit) {
      this.setEditData(editData);
    } else {
      this.props.form.setFieldsValue({
        startTime: initialDate[0],
        endTime: initialDate[1],
      });
    }
  }

  componentWillUpdate({visible, editData, KefuIpcclist}) {
    this.isEdit = !_.isEmpty(editData);

    const setSeatIdsAndGroupIds = () => {
      if (editData.seatType == 0 || editData.seatType == 1) {
        this.seatIds = editData.seatIds.split(',').filter(val => KefuIpcclist.data.kefuMap.get(val));
        this.groupIds = editData.groupIds.split(',').filter(val => KefuIpcclist.data.kefuGroupSet.has(val));
      }
    };
    if (this.isEdit && !KefuIpcclist.loading && this.props.KefuIpcclist.loading) {
      setSeatIdsAndGroupIds();
    }

    if (this.isEdit && visible && !this.props.visible) {
      setSeatIdsAndGroupIds();
      this.setEditData(editData);
    }
  }

  reset = (props) => {
    const setFieldsValue = _.get(this, 'props.form.setFieldsValue', () => {});
    if (props) {
      props.setSeatType(0);
    } else {
      this.setState({
        forecastType: 0,
        hideNumber: 0,
        CustomUploaderKey: this.state.CustomUploaderKey + 1
      });
      this.props.setSeatType(0);
    }
  
    this.description = '';
    this.seatIds = [];
    this.groupIds = [];
    this.forecastRate = '1.00';
    this.forecastDids = [];
    this.fileName = '';
    this.fileSize = 0;
    this.fileUrl = '';

    setFieldsValue({
      name: '',
      startTime: initialDate[0],
      endTime: initialDate[1],
      file: undefined,
      forecastRate: '1.00',
      forecastDids: [],
    });
  }

  setEditData = (editData) => {
    // 编辑模式需要填充初始数据
    this.description = editData.description;
    this.forecastRate = editData.forecastRate;
    this.forecastDids = editData.forecastDids.split(',').filter(val => val !== '');
    this.setState({
      forecastType: editData.forecastType,
      hideNumber: editData.hideNumber
    });
    this.props.setSeatType(editData.seatType || 0);

    const {setFieldsValue, setFields} = this.props.form;
    setFieldsValue({
      name: editData.name,
      endTime: Number.isInteger(editData.endTime) ? new Date(editData.endTime) : initialDate[1],
      forecastRate: this.forecastRate || '1.00',
      forecastDids: this.forecastDids,
    });
    let startTime = Number.isInteger(editData.startTime) ? new Date(editData.startTime) : initialDate[0];

    if (editData.endTime < new Date().getTime()) {
      setFields({'startTime': {value: startTime, errors: [Error('任务已过期，请重新设定任务期限')]}});
      this.setState({
        startTimeDisabled: true,
      });
    } else if (editData.startTime < new Date().getTime() && editData.endTime > new Date().getTime()) {
      setFields({'startTime': {value: startTime, errors: [Error('已进入预设的任务期限，请尽快分配坐席执行任务或重新编辑任务期限')]}});
      this.setState({
        startTimeDisabled: true,
      });
    } else {
      setFields({'startTime': {value: startTime}});
      this.setState({
        startTimeDisabled: false,
      });
    }
  }

  handleClickOpen = () => {
    if (this.props.noAuthority) {
      Modal.warning({
        title: '您没有权限进行该操作。',
      });
      return;
    }
    this.setState({visible: true});
  }

  getUploadInfo = ({url, nosFileName, name, size, fileList}) => {
    this.fileName = name;
    this.fileSize = size;
    this.fileUrl = url; 
  }

  handleSubmit = (params = {}) => {
    const {editData, form} = this.props;
    const {validateFieldsAndScroll, getFieldValue, setFields} = form;

    //-------mock--------
    // return Promise.resolve({
    //   checkResult: "电话号码缺失：Guest6155314,Guest6155369,Guest6155370,Guest6155433,Guest6155434,Guest6155570,Guest6155574,Guest6155575,Guest6155581,Guest6155593,Guest6155615,Guest6155636,Guest6155734,Guest6155735,Guest6155770,Guest6156011,Guest6156212,sccc,ssz-Guest6156214,s毛毛,小瓶盖的欢玺,我们的生活,移动55,默默的我们;电话号码超过15位：e18a62b33e701169ef61fdbc52e61367_1;电话信息重复：16667778880",
    //   invalidCount: 26,
    //   validCount: 147,
    // });

    return new Promise((resolve, reject) => {
      validateFieldsAndScroll((err, values) => {
        if (!err || (this.isEdit && Object.keys(err).length <=1 && err.file)) {
          let forecastRate = `${this.forecastRate}`;
          let match = forecastRate.match(/\.\d*/);
          if (!match) {
            forecastRate = `${forecastRate}.00`;
          } else if (match[0].length == 2) {
            forecastRate = `${forecastRate}0`;
          }

          let data = {
            name: getFieldValue('name'),
            startTime: getFieldValue('startTime').getTime(),
            endTime: getFieldValue('endTime').getTime(),
            description: this.description,
            seatType: this.props.seatType,
            seatIds: (this.seatIds || []).join(','),
            groupIds: (this.groupIds || []).join(','),
            hideNumber: this.state.hideNumber,
            forecastType: this.state.forecastType,
            forecastRate,
            forecastDids: (this.forecastDids || []).join(','),
            fromType: this.props.fromType,
          };

  
          if (this.isEdit) {
            data = {
              ...editData,
              ...data,
              ...params, // 从RandomBox里传进来的值
            };

            const showModal = (json, type) => {
              const msg = json.message;
              const result = json.result;
              let msgs = msg.split(';');
              Modal[type]({
                title: msgs.shift(),
                content: <div style={{wordWrap: 'break-word'}}>
                  {type === 'success' && !(result.seatType== '2' || result.seatType == '3' || result.groupIds || result.seatIds) && <div>外呼任务需指定处理坐席或坐席组后，才会开始执行</div>}
                  {msgs.map((msg, i) => <div className={`${modulePrefix}-ellipsis`} key={i}>{msg}</div>)}
                </div>,
                okText: '好的，我知道了',
              });
            };
    
            const doSave = () => {
              this.props.saveCallTask(data).then((json) => {
                showModal(json, 'success');
                resolve('success');
              }).catch((json) => {
                if (json.code == 18003) {
                  setFields({'name': {value: getFieldValue('name'), errors: [Error('任务名不得重复')]}});
                  ReactDOM.findDOMNode(this.nameRef).scrollIntoView();
                } else if (json.code == 18002) {
                  this.RandomBoxForm.setFields({'seatIds': {errors: [Error(json.message)]}});
                  this.RandomBoxForm.setFields({'groupIds': {errors: [Error(json.message)]}});
                  ReactDOM.findDOMNode(this.seatTypeRef).scrollIntoView();
                } else if (json.code == 18004) {
                  setFields({'file': {errors: [Error(json.message)]}});
                  this.fileRef.scrollIntoView();
                } else if (json.code == 18009) {
                  setFields({'forecastDids': {value: this.forecastDids, errors: [Error(json.message)]}});
                  ReactDOM.findDOMNode(this.forecastDidsRef).scrollIntoView();
                } else {
                  // showModal(json, 'error');
                  message.error(json.message);
                }
                reject('error');
              });
            };

            // 坐席或客服组改变后需要二次确认
            let shouldConfirm = false;
            if (this.isEdit && !_.isEmpty(params)) {
              if (params.seatType !== editData.seatType) {
                shouldConfirm = true;
              } else if (params.seatType == 0) {
                let paramsSeatIdsArr = params.seatIds.split(',');
                let editDataSeatIdsArr = editData.seatIds.split(',');
                if (
                  paramsSeatIdsArr.length !== editDataSeatIdsArr.length ||
                  paramsSeatIdsArr.some(paramsSeatId => !editDataSeatIdsArr.some(editDataSeatId => paramsSeatId == editDataSeatId))
                ) {
                  shouldConfirm = true;
                }
              } else if (params.seatType == 1) {
                let paramsGroupIdsArr = params.groupIds.split(',');
                let editDataGroupIdsArr = editData.groupIds.split(',');
                if (
                  paramsGroupIdsArr.length !== editDataGroupIdsArr.length ||
                  paramsGroupIdsArr.some(paramsGroupId => !editDataGroupIdsArr.some(editDataGroupId => paramsGroupId == editDataGroupId))
                ) {
                  shouldConfirm = true;
                }
              }
            }
            if (shouldConfirm) {
              Modal.confirm({
                title: '外呼任务执行人改动后，未执行的外呼任务会平均分配到新的执行人，是否继续提交？',
                onOk() {
                  doSave();
                },
                onCancel() {
                  reject('');
                },
              });
            } else {
              doSave();
            }
          } else {
            if (this.props.export) {
              data.lossIds = this.props.lossIds;
            } else {
              data.fileName = this.fileName;
              data.fileSize = this.fileSize;
              data.fileUrl = this.fileUrl;
            }
            return this.props.checkCallTask(data)
            .then(json => resolve({params: data, result: json.result}))
            .catch((json) => {
              if (json.code == 18003) {
                setFields({'name': {value: getFieldValue('name'), errors: [Error('任务名不得重复')]}});
                ReactDOM.findDOMNode(this.nameRef).scrollIntoView();
              } else if (json.code == 18002) {
                setFields({'seatType': {value: this.props.seatType, errors: [Error(json.message)]}});
                ReactDOM.findDOMNode(this.seatTypeRef).scrollIntoView();
              } else if (json.code == 18004) {
                setFields({'file': {errors: [Error(json.message)]}});
                this.fileRef.scrollIntoView();
              } else if (json.code == 18009) {
                setFields({'forecastDids': {value: this.forecastDids, errors: [Error(json.message)]}});
                ReactDOM.findDOMNode(this.forecastDidsRef).scrollIntoView();
              } else {
                // this.handleClose('error');
                // showModal(json, 'error');
              }
              reject(json);
            });
          }
  
          return;
        } else {
          reject();
        }
      });
    });
  }

  render() {
    const {children, title, show, form, KefuIpcclist, DidList, visible, onClose, getValidateRandomBoxFunc, seatType, editData = {}} = this.props;
    const {getFieldDecorator, getFieldValue, setFieldsValue, setFields} = form;
    if (seatType == 0 || seatType == 1) {
      hasForecastCall =  true;
    } else {
      hasForecastCall = false;
    }

    let type = seatType;
    if (type == 1) {
      type = 0;
    }

    let tip = '根据表格中用户与负责人的映射关系分配任务';
    if (this.props.export) tip = '根据客户中心用户与负责人的映射关系分配任务';

    let showStep1 = show || this.isEdit;

    return (
      <div className={modulePrefix} style={showStep1 ? {} : {display: 'none'}}>
        <div>
          <FormItem
            {...formItemLayout}
            label="任务名"
          >
          {getFieldDecorator('name', {
            initialValue: editData.name,
            rules: [{
              required: true, message: '任务名不得为空',
            }, {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback();
                  return;
                }
          
                if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/g.test(value)) {
                  callback('任务名不得使用特殊符号');
                } else if (value.length > 20) {
                  callback(`已超过${value.length - 20}个字`);
                } else {
                  callback();
                }
              }
            }],
          })(
            <Input
              ref={ref => this.nameRef = ref}
              placeholder="请输入外呼任务名称"
              autoComplete="off"
              suffix={getFieldValue('name') && <Icon type="close-circle-fill" className={`${modulePrefix}-close-circle`} onClick={() => {
                setFieldsValue({name: ''});
              }}/>}
            />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="任务执行时间"
          >
          {getFieldDecorator('startTime', {
            // initialValue: this.isEdit ? new Date(editData.startTime) : initialDate[0],
            rules: [{
              required: true, message: '任务执行时间不得为空',
            }, {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback();
                  return;
                }

                const endTime = getFieldValue('endTime');
                if (value < new Date() && !this.state.startTimeDisabled) {
                  callback('任务开始时间不能早于当前时间');
                } if (value.getTime() == endTime.getTime()) {
                  callback('任务结束时间不得与开始时间相同');
                } else if (value.getTime() > endTime.getTime()) {
                  callback('任务结束时间不得早于开始时间');
                } else if (endTime.getTime() - value.getTime() < 10 * 60 * 1000) {
                  callback('任务执行时间不得小于10分钟');
                } else {
                  callback();
                }
              }
            }],
          })(
            <DatePicker
              format="yyyy-MM-dd HH:mm"
              showTime={true}
              disabledDate={date => date > dateRange[1] || date < dateRange[0]}
              style={{width: '180px'}}
              disabled={this.state.startTimeDisabled}
            />
          )}
          <div className={`${modulePrefix}-dateMiddle`}>至</div>
          {getFieldDecorator('endTime', {
            // initialValue: this.isEdit ? new Date(editData.endTime) : initialDate[1],
            rules: [{
              validator: (rule, value, callback) => {
                if (!value) {
                  setFields({'startTime': {errors: [Error('任务执行时间不得为空')]}});
                  return;
                }
                const startTime = getFieldValue('startTime');
                if (value.getTime() == startTime.getTime()) {
                  setFields({'startTime': {value: startTime, errors: [Error('任务结束时间不得与开始时间相同')]}});
                } else if (value.getTime() < startTime.getTime()) {
                  setFields({'startTime': {value: startTime, errors: [Error('任务结束时间不得早于开始时间')]}});
                } else if (value.getTime() - startTime.getTime() < 10 * 60 * 1000) {
                  setFields({'startTime': {value: startTime, errors: [Error('任务执行时间不得小于10分钟')]}});
                } else {
                  setFields({'startTime': {value: startTime}});
                }
                callback();
              }
            }],
          })(
            <DatePicker
              format="yyyy-MM-dd HH:mm"
              showTime={true}
              disabledDate={date => date > dateRange[1] || date < dateRange[0]}
              style={{width: '180px'}}
            />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="任务描述"
          >
            <div style={{marginTop: '5px'}}>
              <Counter
                placeholder="请输入任务描述" 
                limit={200}
                value={this.description}
                onChange={e => this.description = e.target.value}
              />
            </div>
          </FormItem>
          <div style={{marginBottom: '-10px'}}>
          {
            (!this.props.export && _.isEmpty(editData)) && (
              <FormItem
                {...formItemLayout}
                label="外呼用户"
              >
                <div ref={ref => this.fileRef = ref}>
                  <InfoBanner style={{marginBottom: '5px'}}>
                    请先下载<a href={calltaskDocUrl} download="filename">外呼任务用户模板</a>，填写完成后上传（支持csv、xls、xlsx格式文件）
                  </InfoBanner>
                </div>
                {getFieldDecorator('file', {
                  normalize: (value) => {
                    // 如果fileList.length是0，需要触发下面’required: true‘的验证，得返回undefined
                    if (_.get(value, 'fileList.length', 0) < 1) {
                      return undefined;
                    }
                    return value;
                  },
                  rules: [{
                    required: true, message: '请上传用户列表',
                  }],
                })(
                  <CustomUploader
                    key={this.state.CustomUploaderKey}
                    onChange={this.getUploadInfo}
                    fileType={'.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
                    maxFileSize={10}
                    maxFileNumber={1}
                  />
                )}
              </FormItem>
            )
          }
          </div>
          <div ref={ref => this.seatTypeRef = ref} />
          <FormItem
            {...formItemLayout}
            label="任务分配方式"
          >
            <RadioGroup value={type} onChange={(e) => {
              this.props.setSeatType(e.target.value);
            }}>
              {(!this.isEdit || this.isEdit && type == 0) && <Radio value={0} >随机</Radio>}
              {(!this.isEdit || this.isEdit && type == 3) && <Radio value={3} >指定坐席任务数量</Radio>}
              {(!this.isEdit && isRelationType || this.isEdit && type == 2) && (
                <Radio value={2} disabled={this.isEdit && editData.seatType != '2'}>
                  按客户关系分配
                  <Popover content={tip}>
                    <i className={`iconfont icon-circle-info ${modulePrefix}-info`}/>
                  </Popover>
                </Radio>
              )}
            </RadioGroup>
          </FormItem>
          {this.isEdit && type == 0 && (
            <div>
              {KefuIpcclist.loading ? (
                <Spin />
              ) : (
                <RandomBox
                  visible={visible}
                  initialData={{
                    seatType: seatType,
                    seatIds: this.seatIds,
                    groupIds: this.groupIds,
                  }}
                  getValidateFunc={getValidateRandomBoxFunc}
                  getForm={form => this.RandomBoxForm = form}
                  submit={this.handleSubmit}
                />
              )}
            </div>
          )}
          {this.isEdit && type == 3 && (
            <div>
              {KefuIpcclist.loading ? (
                <Spin />
              ) : (
                <Specified
                  initialData={editData.amount}
                />
              )}
            </div>
          )}
          {/* <FormItem
            label="   "
            help={this.state.seatTypeErrTxt}
            validateStatus="error"
            {...formItemLayout}
          /> */}
          <FormItem
            {...formItemLayout}
            label={
              <React.Fragment>
                隐号设置
                <Popover 
                  content="开启后外呼号码将进行隐号处理" 
                  // getPopupContainer={getPopupContainer}
                >
                  <i className={`iconfont icon-circle-info ${modulePrefix}-info`}/>
                </Popover>
              </React.Fragment>
            }
          >
            <Switch checked={this.state.hideNumber == 1} onChange={(value) => {
              this.setState({hideNumber: value ? 1 : 0});
            }} />
          </FormItem>
          {
            forecastCallEnable && hasForecastCall && (
              <FormItem
                {...formItemLayout}
                label={
                  <React.Fragment>
                    自动外呼
                    <Popover 
                      content="开启后系统自动外呼，客户接通后转接到坐席" 
                      // getPopupContainer={getPopupContainer}
                    >
                      <i className={`iconfont icon-circle-info ${modulePrefix}-info`}/>
                    </Popover>
                  </React.Fragment>
                }
              >
                <Switch
                  disabled={this.isEdit}
                  checked={this.state.forecastType === 1}
                  onChange={(value) => {
                  this.setState({forecastType: value ? 1 : 0});
                }} />
              </FormItem>
            )
          }
          {
            hasForecastCall && seatType != 2 && this.state.forecastType === 1 && (
              <FormItem
                {...formItemLayout}
                label="倍率值"
              >
              {getFieldDecorator('forecastRate', {
                initialValue: this.forecastRate || '1.00',
                rules: [{
                  required: true, message: '请输入0.01~2.00之间的数值',
                }, {
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback();
                    }
                    const isValid = (_rate) => {
                        if (String(_rate).length <= 4) {
                            _rate = Number(_rate);
                            return _rate > 0 && _rate <= 2;
                        }
                        return false; 
                    };
                    value = String(value);
                    if (Number(value)) {
                        if (isValid(value)) {
                          callback();
                          return;
                        }
                        // if (isValid(value.substr(0, 4))) {
                        //   setFieldsValue({forecastRate: value.substr(0, 4)});
                        // }
                    }
                    callback('请输入0.01~2.00之间的数值');
                  }
                }],
              })(
                <InputNumber
                  style={{width: '110px'}}
                  placeholder="请输入0.01~2.00之间的数值"
                  min={0.01}
                  max={2}
                  precision={2}
                  step={0.01}
                  onChange={forecastRate => this.forecastRate = forecastRate}
                />
              )}
                <InfoBanner style={{marginTop: '10px'}}>
                  系统自动外呼数=倍率值*当前可用坐席数
                </InfoBanner>
              </FormItem>
            )
          }
          {
            hasForecastCall && seatType != 2 && this.state.forecastType === 1 && (
              <FormItem
                {...formItemLayout}
                label="中继号"
              >
              {getFieldDecorator('forecastDids', {
                initialValue: this.forecastDids,
                rules: [{
                  required: true, message: '请选择中继号',
                }],
              })(
                <Select
                  ref={forecastDidsRef => this.forecastDidsRef = forecastDidsRef}
                  style={{width: '100%'}}
                  placeholder="请选择中继电话号码"
                  mode="multiple"
                  showSelectAll={DidList.list.length > 0}
                  selectAllText="所有选项"
                  showMultipleSelectAll={DidList.list.length > 0}
                  multipleSelectAllText="所有中继号"
                  onChange={forecastDids => this.forecastDids = forecastDids}
                >
                  {DidList.list.map((did) => 
                    <Option value={did} key={did}>{did}</Option>
                  )}
                </Select>
              )}
                <InfoBanner style={{marginTop: '10px'}}>
                  系统自动外呼时，使用设定的号码随机外呼
                </InfoBanner>
              </FormItem>
            )
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => state;

const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, bindActionCreators({
    getKefuIpcclist,
    getDidList,
    checkCallTask,
    saveCallTask,
    saveCallTaskOpenapi
  }, dispatch));
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Step1));

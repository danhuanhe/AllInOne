import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button, Input, Switch, Select,DatePicker,InputNumber } from 'antd';
const FormItem = Form.Item;

import { MAX_NAME_LEN } from '../../constants';
import DailyItem from './dailyItem';
const modulePrefix = 'm-daily-modal';

const FormLayout = { labelCol: { span: 3 }, wrapperCol: { span: 13, offset: 0 } };
const FormLayout1 = { labelCol: { span: 3 }, wrapperCol: { span: 13, offset: 0 } };
const dailyTypeOption = [ {key: 0, label: '综合'}, {key: 1, label: '生活'}, {key: 2, label: '工作'}, {key: 3, label: '账本'} ];
const detailTypeOption = [{key: 0, label: '其他'}, {key: 1, label: '衣食'}, {key: 2, label: '住行'}, {key: 3, label: '教育'}, {key: 4, label: '学习'}, {key: 5, label: '零食'}, {key: 6, label: '医药'}, {key: 7, label: '养老'}, {key: 8, label: '养生'} ];
const levelOption = [ {key: 1, label: '可避免'}, {key: 1, label: '一般'}, {key: 2, label: '重要'}, {key: 3, label: '必须'} ];

class DailyModal extends Component{

  static propTypes = {
    edit: PropTypes.bool,
    visible: PropTypes.bool,
    onCreate: PropTypes.func,
    onCancel: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state={
      detail:{
        "type":0,
        "accountId" : 0,
        "date":"2019-02-01",
        "createTime" :new Date().getTime(),
        "editTime" : new Date().getTime(),
        "creatorId" : 0,
        "creator" : "admin",
        "sumMoney" : 0,
        "content" : "无",
        items:[
          {
            "key":0,
            "money" : 12121,
            "time" : 0,
            "place" : "3435",
            "persons" : "dfgdfgfd",
            "content" : "无4534534",
            "type" : 0,
            "level" : 0
          },{
            "key":1,
            "money" : 2323,
            "time" : 0,
            "place" : "setewr",
            "persons" : "twt",
            "content" : "dhdfhdfhdfh",
            "type" : 0,
            "level" : 0,
            _edit:1
          }
        ]
      }
      
    }
  }
  detailDateChange=(moment)=>{
    console.log(moment._d.getTime());
    this.state.detail.date=moment._d.getTime();
  }
  onSave=()=>{
    //console.log(this.itemForm.props.form);
    console.log(this.itemForm.props.form.getFieldsValue());
    console.log(this.state.detail);
    //this.props.handleCreate(this.state.detail);
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const {hideModal, visible, edit } = this.props;
    const {detail}=this.state;
    return (
      <Modal
        className={modulePrefix}
        title={(edit ? '编辑': '新增')}
        width={760}
        visible={visible}
        footer={
        <div>
          <Button key="back" onClick={hideModal} className="u-btn-normal" size="large">取消</Button>
          <Button key="submit" onClick={this.onSave} className="u-btn-normal" type="primary" size="large">确定</Button>
        </div>
        }
      >
        <Form>
          <FormItem label="日期" {...FormLayout}>
            {getFieldDecorator('date', {
              rules: [{ 
                required: true
                }]
            })(
              <DatePicker initialValue={detail.date} onChange={this.detailDateChange} />
            )}
          </FormItem>
          <FormItem label="类型" className="form-item-type"
                  {...FormLayout}
              >
                {getFieldDecorator('type', {
                  rules: [
                    { required: true, message: '请选择中继路径' },
                  ]
                })(
                  <Select initialValue={detail.type} 
                    placeholder="请选择中继路径">
                    {dailyTypeOption.map(item => <Select.Option key={item.key}>{item.label}</Select.Option>)}
                  </Select>
                )}
            </FormItem>
        </Form>
        <hr/>
        {detail.items.map(item =>
        item._edit?
        <DailyItem key={item.key} item={item} wrappedComponentRef={(form) => this.itemForm = form} />:<div key={item.key}>
          11111111
        </div>)}
      </Modal>
    );
  }
}

const WrappedForm = Form.create({
  onFieldsChange(props, changedFields) {
    //props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      
    };
  }
})(DailyModal);
export default WrappedForm;

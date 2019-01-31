import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button, Input, Switch, Select,DatePicker,InputNumber } from 'antd';
const FormItem = Form.Item;

import { MAX_NAME_LEN } from '../../constants';

const modulePrefix = 'm-daily-modal';

const FormLayout = { labelCol: { span: 3 }, wrapperCol: { span: 13, offset: 0 } };
const FormLayout1 = { labelCol: { span: 3 }, wrapperCol: { span: 13, offset: 0 } };
const dailyTypeOption = [ {key: 0, label: '综合'}, {key: 1, label: '生活'}, {key: 2, label: '工作'}, {key: 3, label: '账本'} ];
const detailTypeOption = [{key: 0, label: '其他'}, {key: 1, label: '衣食'}, {key: 2, label: '住行'}, {key: 3, label: '教育'}, {key: 4, label: '学习'}, {key: 5, label: '零食'}, {key: 6, label: '医药'}, {key: 7, label: '养老'}, {key: 8, label: '养生'} ];
const levelOption = [ {key: 1, label: '可避免'}, {key: 1, label: '一般'}, {key: 2, label: '重要'}, {key: 3, label: '必须'} ];

class CreateDailyModal extends Component{

  static propTypes = {
    edit: PropTypes.bool,
    visible: PropTypes.bool,
    onCreate: PropTypes.func,
    onCancel: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state={
      details:[
        {
          "key":0,
          "money" : 0,
          "time" : 0,
          "place" : "",
          "persons" : "",
          "content" : "无",
          "type" : 0,
          "level" : 0
        },{
          "key":1,
          "money" : 0,
          "time" : 0,
          "place" : "",
          "persons" : "",
          "content" : "无",
          "type" : 0,
          "level" : 0,
          _edit:1
        }
      ]
    }
  }
  
  render(){
    const { getFieldDecorator } = this.props.form;
    const {onCancel, onCreate, visible, edit } = this.props;
    const {details}=this.state;
    //const { didList=[], callinKefuList=[], ivrList=[], robotList=[], calloutKefuList=[], robotRight } = common;
    return (
      <Modal
        className={modulePrefix}
        title={(edit ? '编辑': '新增')}
        width={760}
        visible={visible}
        onCancel={onCancel}
        onOk={onCreate}
        footer={
        <div>
          <Button key="back" onClick={onCancel} className="u-btn-normal" size="large">取消</Button>
          <Button key="submit" onClick={onCreate} className="u-btn-normal" type="primary" size="large">确定</Button>
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
              <DatePicker />
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
                  <Select 
                    placeholder="请选择中继路径">
                    {dailyTypeOption.map(item => <Select.Option key={item.key}>{item.label}</Select.Option>)}
                  </Select>
                )}
            </FormItem>
        </Form>
        <hr/>
        {details.map(item =>
        item._edit?
        <Form key={item.key} layout="horizontal">
          <FormItem label="金额" {...FormLayout1}>
            {getFieldDecorator('money', {
              rules: [{ 
                required: true 
                }]
            })(
              <InputNumber min={1} max={1000000} initialValue={item.money} />
            )}
          </FormItem>
          <FormItem label="时间" {...FormLayout1}>
            {getFieldDecorator('time', {
              rules: [{ 
                required: true
                }]
            })(
              <DatePicker showTime />
            )}
          </FormItem>
          <FormItem label="地点" {...FormLayout1}>
            {getFieldDecorator('place', {
              rules: [{ 
                required: true, whitespace: true, message: '请输入地点' 
                },
                { 
                  whitespace: true,
                }]
            })(
              <Input placeholder="请输入中继名称，不超过20个字" autoComplete="off" maxLength={MAX_NAME_LEN} />
            )}
          </FormItem>
          <FormItem label="人物" {...FormLayout1}>
            {getFieldDecorator('persons', {
              rules: [{ 
                required: true, whitespace: true, message: '请输入人物' 
                },
                { 
                  whitespace: true,
                }]
            })(
              <Input placeholder="请输入人物" autoComplete="off" maxLength={MAX_NAME_LEN} />
            )}
          </FormItem>
          <FormItem label="内容" {...FormLayout}>
            {getFieldDecorator('content', {
              rules: [{ 
                required: true, whitespace: true, message: '请输入人物' 
                },
                { 
                  whitespace: true,
                }]
            })(
              <Input.TextArea placeholder="请输入内容" autoComplete="off" maxLength={MAX_NAME_LEN} />
            )}
          </FormItem>
          <FormItem label="分类" className="form-item-type"
                  {...FormLayout1}
              >
                {getFieldDecorator('type', {
                  rules: [
                    { required: true, message: '请选择分类' },
                  ]
                })(
                  <Select 
                    placeholder="请选择分类">
                    {detailTypeOption.map(item => <Select.Option key={item.key}>{item.label}</Select.Option>)}
                  </Select>
                )}
            </FormItem>
            <FormItem label="重要程度" className="form-item-type"
                  {...FormLayout1}
              >
                {getFieldDecorator('level', {
                  rules: [
                    { required: true, message: '请选择重要程度' },
                  ]
                })(
                  <Select 
                    placeholder="请选择重要程度">
                    {levelOption.map(item => <Select.Option key={item.key}>{item.label}</Select.Option>)}
                  </Select>
                )}
            </FormItem>
        </Form>:<div key={item.key}>
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
})(CreateDailyModal);
export default WrappedForm;

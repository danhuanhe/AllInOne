import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button, Input, Switch, Select,DatePicker,InputNumber } from 'antd';
const FormItem = Form.Item;

import { MAX_NAME_LEN } from '../../constants';

const modulePrefix = 'm-daily-modal';

const FormLayout = { labelCol: { span: 3 }, wrapperCol: { span: 13, offset: 0 } };
const detailTypeOption = [{key: 0, label: '其他'}, {key: 1, label: '衣食'}, {key: 2, label: '住行'}, {key: 3, label: '教育'}, {key: 4, label: '学习'}, {key: 5, label: '零食'}, {key: 6, label: '医药'}, {key: 7, label: '养老'}, {key: 8, label: '养生'} ];
const levelOption = [ {key: 1, label: '可避免'}, {key: 1, label: '一般'}, {key: 2, label: '重要'}, {key: 3, label: '必须'} ];

class DailyItem extends Component{

  static propTypes = {
    item: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state={
     
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const {item} = this.props;
    return (
        <Form ref="items" key={item.key} layout="horizontal">
          <FormItem label="金额" {...FormLayout}>
            {getFieldDecorator('money', {
              rules: [{ 
                required: true 
                }]
            })(
              <InputNumber min={1} max={1000000} initialValue={item.money} />
            )}
          </FormItem>
          <FormItem label="时间" {...FormLayout}>
            {getFieldDecorator('time', {
              rules: [{ 
                required: true
                }]
            })(
              <DatePicker showTime />
            )}
          </FormItem>
          <FormItem label="地点" {...FormLayout}>
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
          <FormItem label="人物" {...FormLayout}>
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
                  {...FormLayout}
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
                  {...FormLayout}
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
        </Form>
    );
  }
}

const WrappedForm = Form.create({
  onFieldsChange(props, changedFields) {
  },
  mapPropsToFields(props) {
    return {};
  }
})(DailyItem);
export default WrappedForm;

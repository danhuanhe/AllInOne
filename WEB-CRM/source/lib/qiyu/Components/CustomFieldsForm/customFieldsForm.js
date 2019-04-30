import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Select, InputNumber, DatePicker} from 'ppfish';
import {timestamp2date} from '../../utils';

import './customFields.less';

const noop = () => {
};

const displayMap = {
  1: [1, 3, 5, 7],
  2: [2, 3, 6, 7],
  4: [4, 5, 6, 7]
};

/**
 * 自定义字段form表单
 *
 * disabled 是否disabled
 * onChange 任意字段改变触发
 * onSelect select或时间选择器onChange触发
 * onInputBlur 输入框blur触发
 *
 * 使用方式: 监听onSelect、onInputBlur
 *
 * 传出数据 {id,value}
 */
class CustomFields extends Component {

  static propTypes = {
    customFields: PropTypes.array,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onInputBlur: PropTypes.func,
    form: PropTypes.object,
    displayType: PropTypes.number,
    formItemLayout: PropTypes.object,
  };

  static defaultProps = {
    customFields: [],
    onChange: noop,
    onSelect: noop,
    onInputBlur: noop,
    formItemLayout: {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    },
  };

  onInputBlur = (field) => {
    let value = this.props.form.getFieldValue(field.name);
    if (typeof value === 'string') {
      value = value.trim();
    }
    this.props.onInputBlur({id: field.id, value: value});
  };

  onComponentChange = (field, value = '') => {
    if (typeof value === 'string') {
      value = value.trim();
    }
    const changedValue = {id: field.id, value: value};
    // Select 和 DatePicker 触发 onSelect
    if (field.type === 1 || field.type === 2 || field.type === 3 || field.type === -1) {
      this.props.onSelect(changedValue);
    }
    this.props.onChange(changedValue);
  };

  render() {
    const FormItem = Form.Item;
    const {customFields, disabled, displayType, formItemLayout} = this.props;
    const {getFieldDecorator} = this.props.form;
    let showFields = customFields;

    //根据现实场景进行过滤，如果需要的话，会传递this.data.displayType参数
    if (displayType) {
      showFields = customFields.filter(filed => displayMap[displayType].indexOf(filed.show) > -1);
    }

    return (
      <Form className="m-customfields-form">
        {
          showFields.map((field => {
            let formItem = null;
            const showOnly = field.status === 1 || disabled || field.valueEditable === 0;
            switch (field.type) {
              // 文本类型
              case 0:
                if (showOnly) {
                  formItem = (
                    <FormItem label={field.name}  {...formItemLayout}>
                      <span>{field.value}</span>
                    </FormItem>
                  );
                } else {
                  if (field.description == 0) {
                    formItem = (<FormItem label={field.name} required={field.required} {...formItemLayout}>
                      {getFieldDecorator(field.name, {
                        initialValue: field.value,
                      })(<Input
                        placeholder="请输入内容"
                        autoComplete="off"
                        onBlur={() => this.onInputBlur(field)}
                        onChange={(value) => this.onComponentChange(field, value)}
                        maxLength={field.maxlength || 100}/>
                      )}
                    </FormItem>);
                  } else if (field.description == 1) {
                    formItem = (
                      <FormItem label={field.name} required={field.required} {...formItemLayout}>
                        {getFieldDecorator(field.name, {
                          initialValue: field.value,
                        })(<InputNumber
                          placeholder="请输入数字"
                          autoComplete="off"
                          style={{width: '100%'}}
                          onBlur={() => this.onInputBlur(field)}
                          onChange={(value) => this.onComponentChange(field, value)}
                          maxLength={field.maxlength || 100}/>
                        )}
                      </FormItem>
                    );
                  } else if (field.description == 2) {
                    formItem = (<FormItem label={field.name} required={field.required} {...formItemLayout}>
                      {getFieldDecorator(field.name, {
                        initialValue: field.value,
                      })(<Input.Counter
                        placeholder="请输入内容"
                        autoComplete="off"
                        onBlur={() => this.onInputBlur(field)}
                        onChange={(value) => this.onComponentChange(field, value)}
                        limit={field.maxlength || 500}/>
                      )}
                    </FormItem>);
                  }
                }
                break;
              // Select
              // MultipleSelect
              case 1:
              case 2:
                if (showOnly) {
                  formItem = (
                    <FormItem label={field.name}  {...formItemLayout}>
                      <span>{field.value}</span>
                    </FormItem>
                  );
                } else {
                  const optionList = JSON.parse(field.description);
                  const value = field.value.indexOf(";") > 0 ? field.value.split(";") : field.value;
                  formItem = (<FormItem label={field.name} required={field.required} {...formItemLayout}>
                      {getFieldDecorator(field.name, {
                        initialValue: value || [],
                      })(<Select
                          mode={field.type === 1 ? 'single' : 'multiple'}
                          placeholder="请选择"
                          getPopupContainer={(node) => node.parentNode}
                          showSelectAll
                          showSingleClear
                          onChange={(value) => {
                            let changedValue = value;
                            // 多选菜单特殊处理一下
                            if (field.type === 2) {
                              changedValue = Array.isArray(value) && value.length > 1 ? value.join(';') : value.toString();
                            }
                            this.onComponentChange(field, changedValue);
                          }}>
                          {optionList && optionList.map(option =>
                            (<Select.Option key={option.text} title={option.text}>{option.text}</Select.Option>)
                          )}
                        </Select>
                      )}
                    </FormItem>
                  );
                }
                break;
              // SingleTimer
              case 3:
                if (showOnly) {
                  formItem = (
                    <FormItem label={field.name}  {...formItemLayout}>
                      <span>{timestamp2date(+field.value)}</span>
                    </FormItem>
                  );
                } else {
                  formItem = (<FormItem label={field.name} required={field.required} {...formItemLayout}>
                      {getFieldDecorator(field.name, {
                        initialValue: field.value ? new Date(Number(field.value)) : null,
                      })(<DatePicker
                          style={{width: '100%'}}
                          showTime={true}
                          getPopupContainer={(node) => node.parentNode}
                          placeholder="请选择时间"
                          format="yyyy-MM-dd HH:mm"
                          onChange={(value) => {
                            const changedValue = value && value.getTime() || '';
                            this.onComponentChange(field, changedValue);
                          }}
                        />
                      )}
                    </FormItem>
                  );
                }
                break;
              // DatePicker
              case -1:
                if (showOnly) {
                  formItem = (
                    <FormItem label={field.name}  {...formItemLayout}>
                      <span>{field.value}</span>
                    </FormItem>
                  );
                } else {
                  formItem = (<FormItem label={field.name} required={field.required} {...formItemLayout}>
                      {getFieldDecorator(field.name, {
                        initialValue: field.value ? field.split(';').map(t => new Date(t)) : null,
                      })(<DatePicker.DateRangePicker
                          style={{width: '100%'}}
                          onChange={(time) => {
                            const date = time && time.map(t => t.getTime()).join(';') || '';
                            this.onComponentChange(field, date);
                          }}
                        />
                      )}
                    </FormItem>
                  );
                }
                break;
            }
            return React.cloneElement(formItem, {
              key: field.id
            });
          }))
        }
      </Form>
    );
  }
}

const CustomFieldsForm = Form.create()(CustomFields);

export default CustomFieldsForm;

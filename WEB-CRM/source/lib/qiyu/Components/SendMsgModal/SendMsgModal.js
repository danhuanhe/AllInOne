import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Form, Modal, Button, Select, Input} from 'ppfish';
const Option = Select.Option;
const FormItem = Form.Item;
const Counter = Input.Counter;

import ProgressModal from './ProgressModal';
import './index.less';

const modulePrefix = 'SendMsgModal';

const formItemLayout = {
  labelCol: {
      span: 5
  },
  wrapperCol: {
      span: 19
  }
};

class SendMsgModal extends Component {
  state = {
    progressModalVisible: false,
    progressStatus: 'active'
  }

  handleSubmit = () => {
    const {validateFields, getFieldValue, setFieldsValue} = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        this.setState({progressModalVisible: true, progressStatus: 'active'});
        
        // const progressInterval = setInterval(() => {
        //   if (this.state.progress < 60) {
        //     // this.setState({progress: this.state.progress + 1})
        //   } else {
        //     clearInterval(progressInterval);
        //   }
        // }, 30);
        this.props.onSubmit && this.props.onSubmit({
          templateId: getFieldValue('templateId'),
          variables: this.msgInputNames.map(name => ({
            type: 1,
            value: getFieldValue(name)
          }))
        }).then(() => {
          setFieldsValue({'templateId': undefined});
          setTimeout(() => {
            this.setState({progressModalVisible: false, progressStatus: 'success'});
          }, 500);
        }).catch(() => {
          setFieldsValue({'templateId': undefined});
          setTimeout(() => {
            this.setState({progressModalVisible: false, progressStatus: 'exception'});
          }, 500);
        });
      }
    });
  }

  handleClose = () => {
    this.props.form.setFieldsValue({'templateId': undefined});
    this.props.onClose && this.props.onClose();
  }

  render() {
    const {templateList, visible, form} = this.props;
    const {getFieldDecorator, getFieldValue} = form;

    let templateContent = '';
    templateList.forEach(template => {
      if (template.id === getFieldValue('templateId')) {
        templateContent = template.content;
      }
    });
    this.msgInputNames = [];
    const replacedTemplate = templateContent.replace(/%s/gi, (match, offset, string) => {
      this.msgInputNames.push(`msgInput-${offset}`);
      return getFieldValue(`msgInput-${offset}`) || match;
    });

    return (
      <>
        <Modal
          width="550px"
          title="发送短信"
          visible={visible}
          onCancel={this.handleClose}
          footer={
            <Button
              onClick={this.handleSubmit}
              type="primary"
              disabled={!templateContent}
            >
              提交
            </Button>
          }
        >
          <div className={`${modulePrefix}`}>
            <FormItem
              {...formItemLayout}
              label="短信模板"
            >
            {
              getFieldDecorator('templateId', {
                rules: [{
                  required: true, message: '请选择短信模板',
                }],
              })(
                <Select
                  style={{width: '100%'}}
                  placeholder="请选择短信模板"
                  // value={this.state.templateId}
                  // onChange={templateId => this.setState({templateId})}
                >
                  {templateList.map(({id, name}) => 
                    <Option value={id} key={id}>{name}</Option>
                  )}
                </Select>
              )
            }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label=" "
            >
              <Counter
                limit={300}
                rows={4}
                value={replacedTemplate}
                disabled
              />
            </FormItem>
            {
              this.msgInputNames.map((name, i) => (
                <FormItem
                  {...formItemLayout}
                  key={name}
                  label={i < 1 ? '短信内容' : ' '}
                >
                {
                  getFieldDecorator(name, {
                    rules: [{
                      required: i < 1, message: ' ',
                    }, {
                      validator: (rule, value, callback) => {
                        if (!value) {
                          callback('请填写变量内容');
                          return;
                        }
                  
                        callback();
                      }
                    }],
                  })(
                    <Input maxLength="30" placeholder={'单个变量%s最多输入30个字符'}/>
                  )
                }
                </FormItem>
              ))
            }
          </div>
        </Modal>
        <ProgressModal visible={this.state.progressModalVisible} status={this.state.progressStatus} />
      </>
    );
  }
}

SendMsgModal.propTypes = {
  templateList: PropTypes.arrayOf(PropTypes.object).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Form.create()(SendMsgModal);

import React from 'react';
import {Modal, Form, Input, Button} from 'ppfish';
import PropTypes from 'prop-types';

import TimeSelect from './timeSelect';
import './index.less';

const FormItem = Form.Item;
const noop = () => {
};

class BlackListModal extends React.Component {

  static propTypes = {
    session: PropTypes.object,
    name: PropTypes.string,
    // 0 在线会话 1 呼叫电话
    channel: PropTypes.number,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
    form: PropTypes.object,
    addBlackList: PropTypes.func,
  };
  static defaultProps = {
    channel: 0,
    onSuccess: noop,
    onCancel: noop,
    addBlackList: noop,
    visible: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOk = () => {
    const {session, channel, addBlackList} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = {
          id: session.user.id,
          foreignId: session.foreignId || '',
          reason: values.reason,
          sessionId: session.id,
          channel: channel || 0,
          effective: values.time.effective,
        };
        // 如果是自定义时间选择
        if (form.effective === 1) {
          form.effectiveTime = new Date().getTime() + values.time.dateUnit * values.time.number * 60 * 60 * 1000;
        }
        addBlackList(form, () => {
          this.props.form.resetFields();
          this.props.onSuccess();
        });
      }
    });
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  render() {
    const {visible, name} = this.props;
    const {getFieldDecorator, getFieldsValue} = this.props.form;
    const {time, reason} = getFieldsValue();
    const enable = time && ((time.effective === 1 && time.number) || time.effective === 0) && reason;
    return (
      <Modal
        title="举报客户为黑名单"
        visible={visible}
        className="m-blacklist-modal"
        onCancel={this.handleCancel}
        footer={
          <React.Fragment>
            <Button onClick={this.handleCancel}>取消</Button>
            <Button onClick={this.handleOk} disabled={!enable} type="primary">
              确定
            </Button>
          </React.Fragment>
        }
      >
        <Form layout="vertical">
          <FormItem
            required
            label="请选择黑名单有效期">
            {getFieldDecorator('time', {
              initialValue: {dateUnit: 1, effective: 0, number: undefined}
            })(
              <TimeSelect/>
            )}
          </FormItem>
          <FormItem
            className="ellipsis-reason"
            label={`请填写下方举报“${name}”为黑名单客户的原因`}
            required
          >
            {getFieldDecorator('reason', {
              rules: [{
                required: true,
                message: '请填写举报原因'
              }]
            })(
              <Input.TextArea rows={4} maxLength={200} placeholder="请填写内容（必填)"/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const FormBlack = Form.create()(BlackListModal);

export default FormBlack;

import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Form, Input, Button, message } from "ppfish";
import { updateProfile } from "../../services";
import { MAX_NAME_LEN, MAX_DESC_LEN } from "../../../../constants";
import "./index.less";

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 }
};
const formTailLayout = {
  wrapperCol: { span: 17, offset: 7 }
};

class BasicForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object,
    account: PropTypes.string,
    name: PropTypes.string,
    onSave: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  save = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) return;

      this.setState({
        loading: true
      });
      try {
        let json = await updateProfile({
          realName: values.name
        });

        message.success("保存成功");
        this.props.onSave(values.name);
        this.props.form.resetFields();
      } catch (e) {
        message.error("保存失败");
      }

      this.setState({
        loading: false
      });
    });
  };

  render() {
    const { getFieldDecorator, getFieldError } = this.props.form;

    return (
      <form className="m-basic-form" method="post" onSubmit={this.save}>
        <FormItem {...formItemLayout} label="账号">
          <span className="ant-form-text">{this.props.account}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="姓名">
          {getFieldDecorator("name", {
            initialValue: this.props.name,
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入姓名"
              }
            ]
          })(
            <Input
              placeholder="姓名"
              maxLength={MAX_NAME_LEN}
              autoComplete="off"
            />
          )}
        </FormItem>
        <FormItem {...formTailLayout}>
          <Button
            htmlType="submit"
            className="save-btn"
            loading={this.state.loading}
          >
            保存
          </Button>
        </FormItem>
      </form>
    );
  }
}

const WrappedBasicForm = Form.create()(BasicForm);

export default WrappedBasicForm;

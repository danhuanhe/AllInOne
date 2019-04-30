/**
 * GUIDE 引导语通用模板
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Modal, Button } from 'ppfish';

class Guide extends Component {
  static propTypes = {
    origin: PropTypes.string, // 来源
    title: PropTypes.string, // title
    content: PropTypes.element, // 展示内容
    onOk: PropTypes.func, // 点击确定的回调
  }
  constructor(props) {
    super(props);
    let data = {};
    if(localStorage.getItem(props.origin)) {
      data.visible = false;
    } else {
      data.visible = true;
    }
    this.state = data;
  }
  componentDidMount() {
    localStorage.setItem(this.props.origin, 1);
  }
  handleClose = () => {
    this.setState({
      visible: false
    });
  }
  handleOK = () => {
    if (this.props.onOk) {
      this.props.onOk();
    }
    this.handleClose();
  }
  render () {
    const {
      content,
      title
     } = this.props;
    const {
      visible
    } = this.state;
    return (
      <Modal
        title = {title}
        width = {560}
        visible = {visible}
        className="m-guide-modal"
        onCancel = {() => this.handleClose()}
        footer={[
          <Button type="primary" onClick={() => this.handleOK()}>
            确定
          </Button>,
        ]}
        destroyOnClose
        >
        {content}
      </Modal>
    );
  }
}
export default Guide;
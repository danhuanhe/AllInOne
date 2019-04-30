import React, {Component} from 'react';

import {Modal, Progress} from 'ppfish';


export default class ProgressModal extends Component {
  state = {
    progress: 0,
    visible: false,
  }

  componentWillUpdate({visible}) {
    if (this.props.visible && !visible) {
      this.setState({progress: 100});
      setTimeout(() => this.setState({visible: false}), 300);
    } else if (!this.props.visible && visible) {
      this.setState({visible: true});
    }
  }

  componentDidUpdate({visible}, {progress}) {
    if (this.props.visible && !visible) {
      // ProgressModal刚被展示
      this.setState({progress: 1});
    }
    if (this.state.progress !== progress) {
      setTimeout(() => {
        if (this.state.progress < 60) {
          setTimeout(() => this.setState({progress: this.state.progress + 9}), 40);
        } else if (this.state.progress < 90) {
          setTimeout(() => this.setState({progress: this.state.progress + 4}), 40);
        } else if (this.state.progress < 99) {
          setTimeout(() => this.setState({progress: this.state.progress + 1}), 120);
        }
      }, 15);
    }
  }


  render() {
    return (
      <Modal
        width="550px"
        title="正在发送中..."
        visible={this.state.visible}
        footer={null}
        closable={false}
      >
        <Progress percent={this.state.progress} status={this.props.status} showInfo={false} />
      </Modal>
    );
  }
}

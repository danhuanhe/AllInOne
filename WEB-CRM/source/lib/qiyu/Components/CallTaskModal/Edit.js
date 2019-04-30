import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, Steps} from 'ppfish';
const Step = Steps.Step;
import _ from 'lodash';

import Step1 from './Step1';

import './index.less';

const modulePrefix = "m-CallTaskModal-Edit";

export default class Create extends Component {
  static propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
  }

  state = {
    seatType: 0,
    submitBtnLoading: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.seatType != this.state.seatType) {
      this.setState({seatType: nextProps.seatType});
    }
    if (this.props.visible && !nextProps.visible) {
      this.setState({submitBtnLoading: false});
    }
  }

  setSeatType = (seatType) => this.setState({seatType})

  handleClose = (result) => {
    this.props.onClose(result);
  }

  handleSubmit = () => {
    this.setState({submitBtnLoading: true});
    if (this.state.seatType == 0 || this.state.seatType == 1) {
      this.validateRandomBoxAndSubmit().then((result) => {
        this.handleClose('success');
        this.setState({submitBtnLoading: false});
      }).catch((result) => {
        this.handleClose('error');
        this.setState({submitBtnLoading: false});
      });
    } else {
      this.submit().then((result) => {
        this.handleClose('success');
        this.setState({submitBtnLoading: false});
      }).catch((result) => {
        this.handleClose('error');
        this.setState({submitBtnLoading: false});
      });
    }
  }

  render() {
    const {title, visible, editData, fromType} = this.props;
    return (
      <div className={modulePrefix}>
        <Modal
          width="590px"
          title={title}
          visible={visible}
          onCancel={this.handleClose}
          wrapClassName={`${modulePrefix}-modal`}
          footer={
            <>
              <Button onClick={() => this.handleClose()}>取消</Button>
              <Button onClick={this.handleSubmit} type="primary" loading={this.state.submitBtnLoading}>
                确定
              </Button>
            </>
          }
        >
          <Step1
            editData={editData}
            visible={visible}
            getSubmit={submit => this.submit = submit}
            fromType={fromType}
            seatType={this.state.seatType}
            setSeatType={this.setSeatType}
            getValidateRandomBoxFunc={func => this.validateRandomBoxAndSubmit = func}
          />
        </Modal>
      </div>
    );
  }
}


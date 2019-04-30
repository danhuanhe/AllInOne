import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {Modal, Button, Steps, message} from 'ppfish';
const Step = Steps.Step;
import _ from 'lodash';

import {
  saveCallTask,
  saveCallTaskOpenapi
} from './actions';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

import './index.less';

const modulePrefix = "m-CallTaskModal-Create";

const INITIAL_STATE = {
  currentStep: 0,
  step2Result: {},
  seatType: 0,
  step1Params: {},
  validCount: 0,
  nextBtnLoading: false,
  submitBtnLoading: false,
};

class Create extends Component {
  static propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    lossIds: PropTypes.string,
    export: PropTypes.bool, // true: 客户中心|呼损列表; false: 外呼任务 
  }

  state = INITIAL_STATE

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.setState({seatType: INITIAL_STATE.seatType});
    }
  }

  handleClose = (result) => {
    this.props.onClose(result);
    setTimeout(() => {
      this.resetStep1();
      this.setState({
        ...INITIAL_STATE,
        // seatType: -1, // 使RandomBox和Specified重新mount
      });
    }, 500);
  }

  handleClickNext = () => {
    if (this.state.currentStep === 0) {
      this.setState({nextBtnLoading: true});
      this.check().then(({result: step2Result, params}) => {
        this.setState({
          currentStep: 1,
          step2Result,
          seatType: params.seatType,
          step1Params: params,
          validCount: step2Result.validCount
        });
        this.setState({nextBtnLoading: false});
      }).catch(() => {
        this.setState({nextBtnLoading: false});
      });
    } else if (this.state.currentStep === 1) {
      this.setState({currentStep: 2});
    }
  }

  handleClickSubmit = () => {
    if (this.state.currentStep == 1) {
      this.submit();
    } else {
      if (this.state.seatType == 3) {
        this.validateSpecifiedAndSubmit();
      } else {
        this.validateRandomBoxAndSubmit();
      }
    }
  }

  submit = (params = {}) => {
    const save = this.props.export ? this.props.saveCallTaskOpenapi : this.props.saveCallTask;
    this.setState({submitBtnLoading: true});
    save({
      ...this.state.step1Params,
      ...params
    }).then((json) => {
      message.success('创建成功');
      this.handleClose('success');
      this.setState({submitBtnLoading: false});
    }).catch((json) => {
      this.setState({submitBtnLoading: false});
      
      if (json.code == 18002) {
        message.error(json.message);
      }
    });
  }

  handleClickPrev = () => this.setState({currentStep: this.state.currentStep - 1})

  setSeatType = (seatType, callback) => this.setState({seatType}, callback)

  render() {
    const {title, visible, fromType, lossIds} = this.props;
    const {currentStep, step2Result, step1Params, seatType, validCount, nextBtnLoading, submitBtnLoading} = this.state;
    return (
      <div className={modulePrefix}>
        <Modal
          width="800px"
          title={title}
          visible={visible}
          onCancel={() => this.handleClose()}
          wrapClassName={`${modulePrefix}-modal`}
          bodyStyle={{padding: '20px 40px'}}
          footer={
            <div style={{paddingRight: '24px'}}>
              <Button onClick={() => this.handleClose()}>取消</Button>
              {this.state.currentStep > 0 &&
                <Button key={`btn2-${this.state.currentStep}`} onClick={this.handleClickPrev}>
                  上一步
                </Button>
              }
              {
                this.state.currentStep === 2 || (seatType == 2 && this.state.currentStep == 1) ? (
                  /**
                   * 这里设置key是为了让currentStep改变时强制重新渲染Button
                   * 因为该Button组件点击后会有一个颜色变浅的效果，需要去除。（bug单：YSF-23796）
                   */
                  <Button key={`btn1-${this.state.currentStep}`} onClick={this.handleClickSubmit} type="primary" loading={submitBtnLoading}>
                    提交
                  </Button>
                ) : (
                  <Button key={`btn1-${this.state.currentStep}`} onClick={this.handleClickNext} type="primary" loading={nextBtnLoading}>
                    下一步
                  </Button>
                )
              }
            </div>
          }
        >
          <Steps current={currentStep} >
            <Step title="任务创建" />
            <Step title="任务检测" />
            {seatType != 2 && <Step title="任务分配" />}
          </Steps>
          <div className={`${modulePrefix}-content`}>
            <Step1
              seatType={seatType}
              setSeatType={this.setSeatType}
              show={currentStep === 0}
              export={this.props.export}
              lossIds={lossIds}
              getRestFunc={reset => this.resetStep1 = reset}
              getSubmit={check => this.check = check}
              fromType={fromType}
            />
            <Step2
              show={currentStep === 1 && !_.isEmpty(step2Result)}
              result={step2Result}
              // submit={this.submit}
            />
            <Step3
              show={currentStep === 2}
              seatType={seatType}
              validCount={validCount}
              getRandomBoxValidateFunc={func => this.validateRandomBoxAndSubmit = func}
              getSpecifiedValidateFunc={func => this.validateSpecifiedAndSubmit = func}
              submit={this.submit}
            />
          </div>
        </Modal>
      </div>
    );
  }
}


const mapStateToProps = state => state;

const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, bindActionCreators({
    saveCallTask,
    saveCallTaskOpenapi
  }, dispatch));
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
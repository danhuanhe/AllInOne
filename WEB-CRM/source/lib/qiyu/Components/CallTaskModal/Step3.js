import React, {Component} from 'react';
import ReactDOM from "react-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Form, Radio} from 'ppfish';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import {
  getKefuIpcclist,
} from './actions';

import RandomBox from './RandomBox';
import Specified from './Specified';

import './index.less';

const modulePrefix = "m-CallTaskModal-Step3";

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

class Step3 extends Component {

  // componentDidMount() {
  //   this.props.getKefuIpcclist();
  // }

  render() {
    const {show, seatType, validCount, submit, getRandomBoxValidateFunc, getSpecifiedValidateFunc} = this.props;
    return (
      <div className={modulePrefix} style={show ? {} : {display: 'none'}}>
        <FormItem
          {...formItemLayout}
          label="任务分配方式"
        >
          <RadioGroup value={seatType} onChange={(e) => {
            this.setState({seatType: e.target.value});
          }}>
            {seatType === 0 && <Radio value={0}>随机</Radio>}
            {seatType === 3 && <Radio value={3}>指定坐席任务数量</Radio>}
          </RadioGroup>
        </FormItem>
        {seatType === 0 &&
          <RandomBox
            show={show}
            getValidateFunc={getRandomBoxValidateFunc}
            submit={submit}
          />
        }
        {seatType === 3 &&
          <Specified
            validCount={validCount}
            getValidateFunc={getSpecifiedValidateFunc}
            submit={submit}
          />
        }
      </div>
    );
  }
}



const mapStateToProps = state => state;


const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, bindActionCreators({
    getKefuIpcclist,
  }, dispatch));
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Step3));
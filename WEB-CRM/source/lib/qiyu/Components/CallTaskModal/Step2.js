import React, {Component} from 'react';
import ReactDOM from "react-dom";


import './index.less';

const modulePrefix = "m-CallTaskModal-Step2";

export default class Step2 extends Component {

  render() {
    const {result, show} = this.props;
    if (result.checkResult == undefined) return null;
    return (
      <div className={modulePrefix} style={show ? {} : {display: 'none'}}>
        <div className={`${modulePrefix}-title`}>检测结果</div>
        <div className={`${modulePrefix}-content1`}>
          检验外呼任务成功{result.validCount}条，失败{result.invalidCount}条
        </div>
        <div className={`${modulePrefix}-content2`}>
          {result.checkResult.split(';').map((txt, i) => (
            <div key={i}>{txt}</div>
          ))}
        </div>
      </div>
    );
  }
}

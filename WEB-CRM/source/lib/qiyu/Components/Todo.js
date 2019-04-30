import React, {Component} from 'react';
import {Row, Col} from 'ppfish';

import imgWait from '../assets/image/waiting.png';
const style1 = {
  'height': '100%'
};

const style2 = {
  'width': '100%',
  'borderRadius': '16px'
};

class Todo extends Component {

  constructor(props) {
    super(props);

  }

  render() {

    return (<Row type="flex" align='middle' style={style1}>
      <Col span={4} offset={10}>
        <img src={imgWait} style={style2} alt="功能正在开发中，敬请期待……"></img>
      </Col>
    </Row>);

  }
}

export default Todo;

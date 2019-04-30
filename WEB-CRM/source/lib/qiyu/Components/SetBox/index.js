import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './index.less';

export default class SetBox extends Component  {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <div className="box">
        <div className="box-head">
          <div className="box-title">{this.props.title}</div>
          <div className="box-description">{this.props.description}</div>
        </div>
        <div className="box-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}
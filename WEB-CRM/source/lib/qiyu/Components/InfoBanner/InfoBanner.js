import React, {Component} from 'react';

import './index.less';


export default class InfoBanner extends Component {
  state = {
    show: true
  }


  render() {
    const {children, closable, style, onClose, className = ''} = this.props;
    if (!this.state.show) return null;

    return (
      <div className={`InfoBanner ${className}`} style={style}>
        {children}
        {closable && <i className="iconfont icon-wrong" onClick={() => {this.setState({show: false}); onClose && onClose();}} />}
      </div>
    );
  }
}
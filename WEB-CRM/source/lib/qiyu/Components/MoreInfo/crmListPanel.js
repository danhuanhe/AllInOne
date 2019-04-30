import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './crmListPanel.less';

class CrmListPanel extends Component{

  static propTypes = {
    visible: PropTypes.bool
  }

  static defaultProps = {
    visible: false
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handleClick = () => {
    this.props.onChange(this.props.indexKey);
    this.state.visible ? this.setState({visible: false}) : this.setState({visible: true});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible){
      this.setState({
        visible: nextProps.visible
      });
    }
  }

  render() {

    const props = this.props;

    return (
      <div className="m-crmListPanel">
        <div className="crmListPanel-item" onClick={this.handleClick}>
          {props.header}
          {
            this.state.visible ? <i className="iconfont  icon-arrow icon-arrowup" /> : <i className="iconfont icon-arrow icon-arrowdown" />
          }
        </div>
        {
          this.state.visible ?
            <div className="crmListPanel-content">
              {props.children}
            </div> : null
        }
      </div>
    );
  }

}

export default CrmListPanel;

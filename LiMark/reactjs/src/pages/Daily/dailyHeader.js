import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button} from 'antd';
class DailyHeader extends Component{

  constructor(props){
    super(props);
  }
  showModal=()=>{
    const {showModal} = this.props;
    showModal();
  }
  render() {
    
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>创建日报</Button>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
   
  };
};

const mapDispatchToProps = dispatch => {
  return Object.assign({}, bindActionCreators({

  }, dispatch));
};

export default connect(mapStateToProps,mapDispatchToProps)(DailyHeader);

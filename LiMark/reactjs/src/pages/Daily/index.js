import React, {Component} from 'react';
import {Popover, Layout,Menu} from 'antd';
const {Content, Sider,Header,Footer} = Layout;

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setCurrent,setTotalNum,getDailyList,saveDaily} from "./actions";

import DailyList from './dailyList';
import DailyHeader from './dailyHeader';
import CreateDailyModal from './components/dailyModal';
import './index.less';


class Daily extends Component{

  state={
    visible:false,
    edit:false
  };
  showModal=(visible)=>{
    this.setState({visible:true});
  }
  hideModal=(visible)=>{
    this.setState({visible:false});
  }

  handleCreate=(fromdata)=>{

    console.log(fromdata);
    this.setState({visible:false});
    const {saveDaily} = this.props;
    saveDaily(fromdata);
  }

  render(){
     const { visible, edit } = this.state;
     return (<Layout className="m-daily">
     <Header>
       <DailyHeader showModal={this.showModal}/>
     </Header>
     <Content className="table-content">
       <DailyList/>
     </Content>

     <CreateDailyModal 
            edit={edit}
            visible={visible}
            handleCreate={this.handleCreate} 
            hideModal={this.hideModal}
            />
   </Layout>);
   }
}

const mapStateToProps = state => {
  return {
    Daily: state.Daily
  };
};

const mapDispatchToProps = dispatch => {
  return Object.assign({}, bindActionCreators({
    setCurrent,setTotalNum,getDailyList,saveDaily
  }, dispatch));
};

export default connect(mapStateToProps,mapDispatchToProps)(Daily);


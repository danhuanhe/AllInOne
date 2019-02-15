import React, {Component} from 'react';
import {Popover, Layout,Menu} from 'antd';
const {Content, Sider,Header,Footer} = Layout;

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

export default Daily;

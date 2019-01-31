import React, {Component} from 'react';
import DailyList from './dailyList';
import DailyHeader from './dailyHeader';
import CreateDailyModal from './components/createDailyModal';
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
   render(){
     const { visible, edit } = this.state;
     return (<div className="m-daily">
     <div className="header">
       <DailyHeader showModal={this.showModal}/>
     </div>
     <div className="table-content">
       <DailyList/>
     </div>

     <CreateDailyModal 
            edit={edit}
            visible={visible}
            onCreate={this.handleCreate} 
            onCancel={this.hideModal}
            />
   </div>);
   }
}

export default Daily;

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Menu,Tabs } from 'ppfish';
import * as Actions from "../actions";
import ListHead from "../components/ListHead";
import FilterSet from "../components/FilterSet";
import FilterList from "../components/FilterList";
import "./index.less";

class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      pageTabKey:"1"
    }
  }

  componentDidMount(){
      this.props.actions.getFilterFields();
      this.props.actions.getLeaderList();
  }
  componentWillReceiveProps(props){
    //console.log(props);
  }

  handleSaveFilterOk=()=>{
    this.setState({
      pageTabKey:"2"
    });
    this.props.actions.getFilterList();
  }

  handleTabChange=(key)=>{
    console.log(key);
    this.setState({
      pageTabKey:key
    });
  }

  handleFilterChange=(filter)=>{
    console.log(filter);
  }

  render() {
    console.log(this.props.states.index);
    const {index}=this.props.states;
    const {pageTabKey}=this.state;
    return (
      <Layout className="g-mnc g-mnc-crm">
        <Layout.Sider width="220" className="m-crm-side">
          <header>
            <h1>客户中心</h1><i className="iconfont icon-home" />
          </header>
          <Tabs activeKey={pageTabKey} onChange={this.handleTabChange}>
            <Tabs.TabPane tab="客户筛选" key="1">
              <FilterSet
                filter={index.Filter}
                actions={this.props.actions}
                onFilterChange={this.handleFilterChange}
                onSaveFilterOk={this.handleSaveFilterOk}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="客户群" key="2">
              <FilterList
               filter={index.Filter}
               onFilterChange={this.handleFilterChange}
               actions={this.props.actions}
               />
            </Tabs.TabPane>
          </Tabs>
        </Layout.Sider>
        <Layout>
          <Layout.Header className="layout-header" >
            <ListHead>
            </ListHead>
          </Layout.Header>
          <Layout.Content>
            1111111111
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    states: {...state}
  };
};

const mapDispatchToProps = dispatch => {
  var actions={actions:{}};
  Object.assign(actions.actions, bindActionCreators(Actions, dispatch));
  return actions;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setCurrent,setTotalNum,getDailyList,setListParams} from "./actions";
import DailyTable from './components/dailyTable';
import {PAGE_SIZE} from '../constants';

class DailyList extends Component{

  loadList(params = {}, current = 1) {console.log(this.props);
     const {getDailyList,setCurrent} = this.props;
     setCurrent(current);
    // setListParams({...this.props.CallHistoryList.params, ...params});
    getDailyList(
       {offset: (current-1)*PAGE_SIZE, limit: PAGE_SIZE, ...this.props.DailyList.params, ...params}
     );
  }

  constructor(props) {
    super(props);
    this.loadList(props.DailyList.params);
  }

  state = {
    id:null
  };

  handlePageChange = (pagination) => {
    this.loadList({},pagination.current);
  };

  handleTableRowClick = ({id}) => {
    this.setState({
      id
    });
  };

  render() {
    const {DailyList} = this.props;
    return (
      <React.Fragment>
        <DailyTable
          DailyList={DailyList}
          pageSizes={PAGE_SIZE}
          handlePageChange={this.handlePageChange}
          onRowClick={this.handleTableRowClick}
        />
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => {
  return {
    DailyList: state.Daily.DailyList
  };
};

const mapDispatchToProps = dispatch => {
  return Object.assign({}, bindActionCreators({
    setCurrent,setTotalNum,getDailyList,setListParams
  }, dispatch));
};

export default connect(mapStateToProps,mapDispatchToProps)(DailyList);

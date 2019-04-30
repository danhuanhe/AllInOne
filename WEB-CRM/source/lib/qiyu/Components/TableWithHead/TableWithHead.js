
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'ppfish';

import './index.less';
const modulePrefix = 'm-TableWithHead';


class TableWithHead extends PureComponent {
  state = {
    restSelected: false,
    selectedRows: [],
  }

  componentWillUpdate(nextProps, nextState) {
    const rowSelection =  nextProps.tableProps.rowSelection;
    if (rowSelection && rowSelection.selectedRowKeys && !rowSelection.selectedRowKeys.length) {
      this.setState({restSelected: false});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedRows.length >= prevProps.pageSize &&
      this.state.selectedRows.length < this.props.pageSize &&
      this.state.restSelected) {
      this.setState({restSelected: false});
      this.props.onSelectRestChange(false);
    }
  }

  handleSelectRest = () => {
    this.setState({restSelected: true});
    this.props.onSelectRestChange(true);
  }

  handleCancelSelectRest = () => {
    this.setState({restSelected: false});
    this.props.onSelectRestChange(false);
  }

  render() {
    const {
      // totalNum,
      // pageSize,
      tableProps: {
        rowSelection,
        onChange,
        pagination,
        ...otherTableProps
      },
      head,
      showReset = true,
      style,
      className = ''
    } = this.props;
    const selectionNum = rowSelection && rowSelection.selectedRowKeys ? rowSelection.selectedRowKeys.length : this.state.selectedRows.length;

    const { current: pageCurrent, total:totalNum, pageSize=50 } = pagination;
    let rest = null, selectedNum = 0;
    /* 剩余选中 */
    if(selectionNum) {
      selectedNum = selectionNum;
      const pageTotal = Math.ceil(totalNum/pageSize);

      if (this.state.restSelected) {
        rest = <u className={`${modulePrefix}-txt`} onClick={this.handleCancelSelectRest}>取消</u>;
        selectedNum = totalNum;
      } else if (totalNum > pageSize) {
        // prev page || last page
        if( pageCurrent < pageTotal && selectionNum >= pageSize || pageCurrent === pageTotal && selectionNum == totalNum%pageSize) {
          rest = <u className={`${modulePrefix}-txt`} onClick={this.handleSelectRest}>选中剩余{totalNum - selectionNum}项</u>;
        }
      }
    }

    return (
      <div className={`${modulePrefix} ${className}`} style={style}>
        <div className={`${modulePrefix}-head`} style={rowSelection ? {paddingLeft: '25px'} : {paddingLeft: '8px'}}>
          {
            head ? head : (
              <>
                <span className={`${modulePrefix}-txt`}>共 <span className={`${modulePrefix}-number`}>{Number.isInteger(totalNum) ? totalNum : '--'}</span> 项</span>
                {selectedNum > 0 && <span className={`${modulePrefix}-txt`}>已选中 <span className={`${modulePrefix}-number`}>{selectedNum}</span> 项</span>}
                {showReset && rest}
              </>
            )
          }
        </div>
        <Table
          rowSelection={rowSelection ? {
            ...rowSelection,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selectedRows});
              rowSelection.onChange && rowSelection.onChange(selectedRowKeys, selectedRows);
            },
            selectedRowKeys: rowSelection && rowSelection.selectedRowKeys || this.state.selectedRows.map(({id}) => id)
          } : null}
          onChange={(onChange || rowSelection) ? (...args) => {
            this.setState({selectedRows: []});
            rowSelection && rowSelection.onChange && rowSelection.onChange([], []);
            onChange && onChange(...args);
          } : undefined}
          pagination={pagination}
          {...otherTableProps}
        />
      </div>
    );
  }
}

TableWithHead.propTypes = {
  // totalNum: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // 同下
  // pageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // 用于判断是否显示“选中剩余”  从 tableProps.pagination中获取
  onSelectRestChange: PropTypes.func, //选中剩余项或取消选中剩余项时触发，触发时传true或false，true表示选中了剩余
  tableProps: PropTypes.object, //ppfish table组件的属性
  head: PropTypes.node, // 自定义head，如果不传则使用默认head
  showReset: PropTypes.bool, // 是否显示“选中剩余。。项”，默认为true
  style: PropTypes.object,
  className: PropTypes.string,
};
TableWithHead.defaultProps = {
  pageSize: 50, //当前页记录的条数
};

export default TableWithHead;

import React from 'react';
import {TableWithHead} from "../../components";
import {timestamp2fixedDate1} from "../../../utils";
//import {CALL_HISTORY_ANSWER_TYPE,GET_CALL_HISTORY_SATISFACTION} from "../../constants";
import {Tooltip} from 'antd';

const DailyTable = props => {

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      fixed: 'left'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: val => {
        return val == 1 ? '生活' : '工作';
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: val => timestamp2fixedDate1(val, 'MM-dd HH:mm')
    },{
      title: '总金额',
      dataIndex: 'sumMoney',
      key: '',
      render: (value,record) => {
        return record.callType == 1 ? record.callNum : record.mobile;
      }
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: '',
      render: (value,record) => {
        return record.callType == 1 ? record.mobile : record.callNum;
      }
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: '',
      render: (value,record) => {
        return record.callType == 1 ? record.mobile : record.callNum;
      }
    },
  ];

  const columnFiltrate = {
    defaultColumns: ['createTime']
  };

  columns.map(item => {item.width = '150px';});

  const tableProps = {
    columns: columns,
    rowKey: '_id',
    dataSource: props.DailyList.list,
    pagination: {
      total: props.DailyList.totalNum,
      current: props.DailyList.current,
      pageSize: props.pageSizes,
      showTotal: () => {
        return `每页显示${props.pageSizes}条，共 ${Math.ceil(props.DailyList.totalNum / props.pageSizes)} 页，共${props.DailyList.totalNum} 条`;
      }
    },
    onChange: props.handlePageChange,
    columnFiltrate: columnFiltrate,
    scroll: {
      x: 670,
      y: 'calc(100vh - 320px)'
    },
    onRow: (record) => {
      return {
        onClick: () => {
          props.onRowClick(record);
        }
      };
    },
    loading: props.DailyList.isLoading
  };

  return (<TableWithHead totalNum={props.DailyList.totalNum}
                         pageSize={props.pageSizes} tableProps={tableProps} />);
};

export default DailyTable;

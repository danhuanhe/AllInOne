/**
 * 工作报表头部的选择客服组件
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {TreeSelect} from 'ppfish';

class ReportKefuSelect extends Component {
    static propTypes = {
        reportKefus: PropTypes.array,
        popupContainer: PropTypes.object,//滚动容器
        onChange: PropTypes.func, //参数变化后通知外层
    }

    state = {
        idList: []
    }

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.initialized) return;
        //设置选择框初始的选择状态
        const idList = nextProps.reportKefus.map(k => {
            return k.value;
        });
        if (idList.length < 1) return;
        this.setState({idList});
        this.initialized = true;
    }

    componentWillUnmount() {
    }

    onConfirm = (valueList, connectValueList) => {
        this.setState({idList: valueList});

        const {onChange} = this.props;
        onChange(formatConnectValueList2ValueList(connectValueList));
    }

    render() {
        const {reportKefus,popupContainer=document.body,onChange,...otherProps} = this.props;

        const treeProps = {
            showSearch: true,
            editable: false,
            treeData: reportKefus,
            placeholder: _.get(reportKefus, '[0].title'),
            // treeDefaultExpandAll: true,
            treeDefaultExpandedKeys: [_.get(reportKefus, '[0].value')],
            value: this.state.idList,
            onConfirm: this.onConfirm,
            treeCheckable: true,
            ...otherProps,
            getPopupContainer: ()=>popupContainer,
            style: {
                width: 150
            },
            dropdownStyle: {
                width: 300
            }
        };

        return (
            <TreeSelect {...treeProps} />
        );
    }
}


/**
 * 将客服选择树里的选择结果格式化为客服id列表。
 * @param  {[type]} connectValueList [description]
 * @return {[type]}                  [description]
 */
const formatConnectValueList2ValueList = connectValueList => {
    let valueList = [];

    if (connectValueList.length == 1 && connectValueList[0].value == '-1') {
        //全选择的情况
    } else {
        connectValueList.forEach(v => {
            if (v.children && v.children.length) {
                v.children.forEach(c => {
                    valueList.push(c.key.split('-')[1]);
                });
            } else {
                valueList.push(v.value.split('-')[1]);
            }
        });
    }

    return valueList;
};

export default ReportKefuSelect;

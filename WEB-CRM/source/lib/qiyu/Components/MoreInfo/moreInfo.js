import React, {Component} from 'react';
import {List,Spin} from 'ppfish';
import ApiCrmPanel from "../ApiCrmPanel";
import CrmListPanel from './crmListPanel';
import {message} from 'ppfish';

import PropTypes from 'prop-types';

import InfiniteScroll from 'react-infinite-scroller';
import { requestApiCrm } from "../../../../utils/index";
// ../../../lib/qiyu/assets/image/crm_demo.png
import crmShowTip from "../../assets/image/crm_demo.png";

import "./index.less";

class MoreInfo extends Component{


  /**
   *
   * @type {{ApiCrmOrder: *, ApiCrmUser: *, getApiCrmOrderInfo: *, getApiCrmUserInfo: *, userApi: *, orderApi: *, onUserInfoUpdate: *, userid: *, extralParams: *}}
   * @extralParams
   * {
   *     user:{time: 000,time2: 000},
   *     order:{time: 000,time2: 000}
   * }
   *
   */
  static propTypes = {
    ApiCrmOrder: PropTypes.object,
    ApiCrmUser: PropTypes.object,
    getApiCrmOrderInfo: PropTypes.func,
    getApiCrmUserInfo: PropTypes.func,
    userApi: PropTypes.string,
    orderApi: PropTypes.string,
    onUserInfoUpdate: PropTypes.func,
    userid: PropTypes.string,
    extralParams: PropTypes.object
  };


  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      activeKey: -1
    };

    this.current = 0;
    this.initPageNum = null;
  }

  componentDidMount() {
    const {userApi, orderApi} = this.props;

    if (orderApi){
      if (this.props.ApiCrmOrder.count <= 10) {
        this.loadList(0);
      }
    }
    if (userApi){
      this.props.getApiCrmUserInfo({
        userid: this.props.userid,
        ...this.props.extralParams.user
      },userApi);
    }
  }


  componentDidUpdate() {
    if (this.initPageNum === null && this.props.ApiCrmUser.info.length && this.props.ApiCrmOrder.count > 10){
      this.initPageNum = this.initPageNumFun();
      if (this.initPageNum){
        new Array(this.initPageNum).fill('').map((item,index) => {
          this.loadList(index+1);
        });
      }
    }
  }

  loadList = (current) => {
    const {userApi, orderApi,extralParams} = this.props;

    this.props.getApiCrmOrderInfo({
      userid: this.props.userid,
      count: 10,
      from: current*10,
      ...extralParams.order
    }, orderApi);
    this.current = current + 1;
  };

  initPageNumFun = () => {
    return Math.ceil((window.innerHeight - 50 - this.refs.userCrmContent.clientHeight - 30) / 50 / 10);
  };

  loadMore = (page) => {
    const {ApiCrmOrder} = this.props;
    if (ApiCrmOrder.count != null && ApiCrmOrder.count <= ApiCrmOrder.info.length){
      this.setState({
        hasMore: false
      });
    }else {
      this.loadList(page);
    }
  };

  /**
   * 用户信息crm发生回写
   * @param info
   */
  handleUserInfoUpdate = (info) => {
    const {modify_url} = this.props.ApiCrmUser;

    if (modify_url){
      requestApiCrm({
        url:modify_url,
        method: 'POST',
        data: {
          userid: this.props.userId,
          data: info
        }
      }).then(json => {
        this.props.onUserInfoUpdate ? this.props.onUserInfoUpdate(info) : null;
      });
    } else {
      message.error('crm接口没有返回modify_cb，无法回写。');
    }
  }

  /**
   * 订单crm发生回写
   */
  handleOrderInfoUpdate = (index,info) => {
    const {modify_url} = this.props.ApiCrmOrder;
    if (modify_url){
      requestApiCrm({
        url:modify_url,
        method: 'POST',
        data: {
          userid: this.props.userId,
          data: info,
          index: index
        }
      }).then(json => {
        this.props.onOrderInfoUpdate ? this.props.onOrderInfoUpdate(index,info) : null;
      });
    } else {
      message.error('crm接口没有返回modify_cb，无法回写。');
    }
  }

  /**
   * 改变订单信息面板
   * @param activeKey
   */
  handleChange = (activeKey) => {
    this.setState({activeKey: activeKey});
  }

  renderItem = (item,index) => {
    return(
      <List.Item>
        <CrmListPanel header={item.title} indexKey={index} onChange={this.handleChange}
                      visible={this.state.activeKey == index}>
          {
            item.blocks.map((it, index) =>
              (<div key={index}>
                {
                  it.is_title ? null :
                    <ApiCrmPanel data={it.data} onChange={this.handleOrderInfoUpdate.bind(this,item.index)}/>
                }
              </div>)
            )
          }
        </CrmListPanel>
      </List.Item>
      );
  }

  render() {

    const {ApiCrmOrder,ApiCrmUser,userApi,orderApi} = this.props;

    return (
      <div style={{height: 'calc(100vh - 50px)',overflow: 'auto'}} className="m-CallHistory-HistoryDrawer-MoreInfo" ref="CrmContent">
        {
          userApi && orderApi ?
             <InfiniteScroll pageStart={0} useWindow={false}
                             hasMore={this.state.hasMore} loadMore={this.loadMore} initialLoad={false}>

               <div className="m-user-crm-content" ref="userCrmContent">
                 {
                   ApiCrmUser.isLoading ? <Spin/> :
                     <ApiCrmPanel data={ApiCrmUser.info}  onChange={this.handleUserInfoUpdate}/>
                 }
               </div>

               <div className="m-order-crm-content">
                 {
                   ApiCrmOrder.info.length ?
                     <List dataSource={ApiCrmOrder.info} renderItem={this.renderItem} /> : null
                 }
                 {
                   ApiCrmOrder.isLoading ? <Spin/> : null
                 }
                 {
                   !this.state.hasMore && !ApiCrmOrder.isLoading ? <div className="nomore"><p className="no-more-tip">没有更多了</p></div> : null
                 }
               </div>
             </InfiniteScroll> :
             <div className="no-crm-tip-content">
               <img src={crmShowTip} alt="网易七鱼支持使用接口方式的CRM接入，用于安全地获取访客的信息"/>
               <p className="no-crm-tip">网易七鱼支持使用接口方式的CRM接入，用于安全地获取访客的信息&nbsp;<a href="https://qiyukf.com/docs/guide/crm/qiyu_crm_interface.html" target="_blank">了解详情<i className="iconfont icon-doubleArrowDown icon-showMore" /></a></p>
             </div>

        }
      </div>
    );
  }

}


export default MoreInfo;

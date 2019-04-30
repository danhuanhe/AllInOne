import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OrderList from './OrderList';
import GoodItem from './GoodItem';
import Unidentified from './Unidentified';
import OrderDetail from './OrderDetail';
import OrderLogistic from './OrderLogistic';
import OrderStatus from './OrderStatus';
import RefundDetail from './RefundDetail';
import StaticUnion from './StaticUnion';
import CardLayout from './CardLayout';
import DetailView from './DetailView';
import WxNews from './WxNews';
import Form from './Form';


class BotMsg extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    static msgConfigMap = {
        'unidentified': {
            Component: Unidentified
        },
        'static_union': {
            Component: StaticUnion
        },
        'order_list': {
            Component: OrderList
        },
        'order_detail': {
            Component: OrderDetail
        },
        'order_logistic': {
            Component: OrderLogistic
        },
        'order_status': {
            Component: OrderStatus
        },
        'refund_detail': {
            Component: RefundDetail
        },
        'qiyu_template_goods': {
            Component: GoodItem
        },
        'card_layout': {
            Component: CardLayout
        },
        'detail_view': {
            Component: DetailView
        },
        'wx_news': {
            Component: WxNews
        },
        'bot_form': {
            Component: Form
        },
        'qiyu_template_botForm': {
            Component: Form
        }
    };

    render() {
        const { content, eventHandler } = this.props;
        const { template: tpl } = content;
        let msgClassList = [`bot-${tpl.id}`];
        let msgConfig = this.constructor.msgConfigMap[tpl.id];
        if (!msgConfig) {
            msgConfig = this.constructor.msgConfigMap["unidentified"];
            msgClassList.push(`bot-unidentified`);
        }
        const BotMsgComp = msgConfig.Component;
        return (
            <div className={msgClassList.join(' ')}>
                <BotMsgComp
                    content={content}
                    eventHandler={eventHandler}
                ></BotMsgComp>
            </div>
        );
    }
}

export default BotMsg;

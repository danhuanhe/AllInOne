import React, { Component } from 'react';
import PropTypes from 'prop-types';


class OrderList extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        return (
            <div className="bot-order_list">
                <div className="tlt">{tpl.label}</div>
                <ul className="list">
                {tpl.list.map((item, index) => {
                    return (
                        <li key={index} className="item">
                            <div className="shop">
                                <i className="iconfont icon-shop icon"></i>
                                <span className="name">{item.s_name}</span>
                                <span className={`status`}>{item.s_status}</span>
                            </div>
                            <ul className="good-list">
                            {item.goods.map((good, goodIndex) => {
                                return (
                                    <li key={goodIndex} className="good-item">
                                        <div className="bd">
                                            <div className="left">
                                                <img src={good.p_img} alt="" />
                                            </div>
                                            <div className="mid">
                                                <p className="name" title={good.p_name}>{good.p_name}</p>
                                                <p className="stock">{good.p_stock}</p>
                                            </div>
                                            <div className="right">
                                                <span className="price">{good.p_price}</span>
                                                <span className="count">{good.p_count}</span>
                                                <span className="state">{good.p_status}</span>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                            </ul>
                        </li>
                    )
                })}
                </ul>
                <div className="ft z-dis">
                    <p>更多订单</p>
                </div>
            </div>
        );
    }
}

export default OrderList;

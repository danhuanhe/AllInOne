import React, { Component } from 'react';
import PropTypes from 'prop-types';


class OrderDetail extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        const moreDetail = tpl.date || [];
        return (
            <React.Fragment>
                <div className="tlt">{tpl.label}</div>
                <ul className="list">
                {tpl.status ?
                    <li className="item item-status">
                        <div className="item-tlt">
                            <i className="iconfont icon-gps"></i>
                            <span>{tpl.status}</span>
                        </div>
                    </li>
                    :null
                }
                {tpl.user_name || tpl.address ?
                    <div className="item item-receiver">
                        <div className="item-tlt">
                            <i className="iconfont icon-order"></i>
                            <span>{tpl.user_name}</span>
                        </div>
                        <ul className="inner-list">
                            <li className="inner-item">
                                <span>{tpl.address}</span>
                            </li>
                        </ul>
                    </div>
                    :null
                }
                {tpl.orderNo || moreDetail.length > 0 ?
                    <div className="item item-more">
                        <div className="item-tlt">
                            <i className="iconfont icon-express"></i>
                            <span>{tpl.orderNo}</span>
                        </div>
                        <ul className="inner-list">
                        {moreDetail.map((item, index) => {
                            return (
                                <li key={index} className="inner-item">
                                    <span>{item}</span>
                                </li>
                            )
                        })}
                        </ul>
                    </div>
                    : null
                }
                </ul>
            </React.Fragment>
        );
    }
}

export default OrderDetail;

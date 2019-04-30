import React, { Component } from 'react';
import PropTypes from 'prop-types';


class CardMsg extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
        eventHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    handleClick = (ev) => {
        
    }

    render() {
        const { content } = this.props;
        const { template } = content;
        let detailJSX;
        switch (template) {
            case 'pictureLink':
                detailJSX = (
                    <img src={content.picture} alt=""/>
                )                
                break;
            default:
                detailJSX = (
                    <React.Fragment>
                        <a href={content.url} className="product-info" target="_blank">
                            <img src={content.picture} alt="未提供商品图片"/>
                            {content.orderId ? 
                                <div className="info z-order">
                                    <div className="tlt">{content.title}</div>
                                    <div className="desc">
                                        <div className="left">{content.desc}</div>
                                        <div className="right">
                                            <div className="pay-money">{content.payMoney}</div>
                                            <div className="order-count">{content.orderCount}</div>
                                        </div>
                                    </div>
                                    <div className="note">
                                        <span className="order-sku">{content.orderSku}</span>
                                        <span className="order-status">{content.orderStatus}</span>
                                    </div>
                                </div> :
                                <div className="info">
                                    <div className="tlt">{content.title}</div>
                                    <div className="desc">{content.desc}</div>
                                    <div className="note">{content.note || content.price || ''}
                                    </div>
                                </div>
                            }
                        </a>
                        {
                            content.orderId ?
                            <div className="order-info">
                                <div className="tlt">
                                    <label>订单编号：</label>{content.orderId}
                                </div>
                                {content.orderTime ? 
                                    <div className="time">
                                        <label>下单时间：</label>{content.orderTime}
                                    </div>
                                    : null
                                }
                            </div>
                            : null
                        }
                        {
                            content.activity ?
                            <div className="activity-info">
                                    <a href={content.activityHref} className="activity-link" target="_blank">{content.activity}</a>
                            </div>
                            : null
                        }
                    </React.Fragment>
                )
                
        }
        return (
            <React.Fragment>
                <div className={`card-wrap template-${template||'default'}`}>
                {detailJSX}
                </div>
            </React.Fragment>
        );
    }
}

export default CardMsg;

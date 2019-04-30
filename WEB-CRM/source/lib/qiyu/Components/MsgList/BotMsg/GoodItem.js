import React, { Component } from 'react';
import PropTypes from 'prop-types';


class GoodItem extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        return (
            <React.Fragment>
                <div className="good-item">
                    <div className="bd">
                        <div className="left">
                            <img src={tpl.p_img} alt="" />
                        </div>
                        <div className="mid">
                            <p className="name" title={tpl.p_name}>{tpl.p_name}</p>
                            <p className="stock">{tpl.p_stock}</p>
                        </div>
                        <div className="right">
                            <span className="price">{tpl.p_price}</span>
                            <span className="count">{tpl.p_count}</span>
                            <span className="state">{tpl.p_status}</span>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default GoodItem;

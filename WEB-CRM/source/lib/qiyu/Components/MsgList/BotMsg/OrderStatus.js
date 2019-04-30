import React, { Component } from 'react';
import PropTypes from 'prop-types';


class OrderStatus extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        const actionList = tpl.list || [];
        return (
            <React.Fragment>
                <div className="tlt">{tpl.label}</div>
                <div className="info">{tpl.title}</div>
                {actionList.length > 0 ?
                    <ul className="list">
                    {actionList.map((item, index) => {
                        return (
                            <li className="item" key={index}>
                                <a className="service-action">{item.valid_operation}</a>
                            </li>
                        )
                    })}
                    </ul>
                    :null
                }
            </React.Fragment>
        );
    }
}

export default OrderStatus;

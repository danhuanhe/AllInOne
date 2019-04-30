import React, { Component } from 'react';
import PropTypes from 'prop-types';


class OrderLogistic extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        const logisticList = tpl.list || [];
        return (
            <React.Fragment>
                <div className="tlt">{tpl.label}</div>
                <div className="info">{tpl.title.label}</div>
                {logisticList.length > 0 ?
                    <ul className="list">
                    {logisticList.map((item, index) => {
                        return (
                            <li key={index} className="item">
                                <div className="left">
                                    <span className="dot"></span>
                                </div>
                                <div className="right">
                                    <p className="content" title={item.logistic}>{item.logistic}</p>
                                    <p className="time">{item.timestamp}</p>
                                </div>
                            </li>
                        )
                    })}
                    </ul>
                    :null
                }
                {tpl.action ? 
                    <div className="ft">
                        <a href={tpl.action.target} target="_blank">{tpl.action.p_name}</a>
                    </div>
                    :null
                }
            </React.Fragment>
        );
    }
}

export default OrderLogistic;

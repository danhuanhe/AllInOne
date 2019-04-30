import React, { Component } from 'react';
import PropTypes from 'prop-types';


class RefundDetail extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        const list = tpl.list || [];
        return (
            <React.Fragment>
                <div className="tlt">{tpl.label}</div>
                <div className="bd">
                    <div className={`state state_${tpl.state.type}`}
                    >
                        <i className={`iconfont ${tpl.state.type === 'success'?'icon-cirle-ok':'icon-cirle-etc'}`}></i>
                        <span>{tpl.state.name}</span>
                    </div>
                    {list.length > 0 ?
                        <ul className="list">
                            {list.map((item, index) => {
                                <li key={index} className="item">{item}</li>
                            })}
                        </ul>
                        :null
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default RefundDetail;

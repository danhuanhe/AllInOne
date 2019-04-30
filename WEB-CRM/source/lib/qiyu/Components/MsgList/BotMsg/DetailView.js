import React, { Component } from 'react';
import PropTypes from 'prop-types';


class DetailView extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    renderTdItem = (td) => {
        let ret = (
            <span>[暂不支持的消息类型]</span>
        )
        if(td.type === 'text') {
            ret = (
                <span>{td.value}</span>
            )
        }else if(td.type === 'image') {
            ret = (
                <img src={td.value} alt=""/>
            )
        }
        return ret;
    }

    renderTrItem = (tr) => {
        return (
            <ul className="td-list">
            {tr.map((td, index) => {
                return (
                    <li key={index} className="td-item" style={td.style}>
                        <div className="inner" style={td.innerStyle}>
                        {this.renderTdItem(td)}
                        </div>
                    </li>
                )
            })}
            </ul>
        )
    }

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        const { thumbnail } = tpl;
        return (
            <React.Fragment>
                <div className="bd m-card-layout">
                    <ul className="group-list">
                        <li key={index} className="group-item">
                            <ul className="tr-list">
                            {thumbnail.list.map((tr, index) => {
                                return (
                                    <li key={index} className="tr-item">
                                    {this.renderTrItem(tr)}
                                    </li>
                                )
                            })}
                            </ul>
                        </li>
                    </ul>
                </div>
                {thumbnail.action ?
                    <div className={`ft ${thumbnail.action.type!=='url'?'z-dis':''}`}>
                    {thumbnail.action.type === 'url' ?
                        <a href={thumbnail.action.target} target="_blank">{thumbnail.action.label}</a>:
                        <p>{thumbnail.action.label}</p>
                    }
                    </div>
                    : null
                }
            </React.Fragment>
        );
    }
}

export default DetailView;

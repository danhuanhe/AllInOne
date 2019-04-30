import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { text2emoji } from '../../../utils';

class StaticUnion extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
        eventHandler: PropTypes.func.isRequired
    };

    renderItem = (item) => {
        let ret = null;
        switch (item.type) {
            case 'text': {
                ret = (
                    <p className="bot-typeset__item-text">{item.detail.label}</p>
                )
                break;
            }
            case 'image': {
                ret = (
                    <p className="bot-typeset__item-image">
                        <img src={item.detail.url + '?imageView'} alt="" data-group="ysf" data-url={item.detail.url + '?imageView'}/>
                    </p>
                )
                break;
            }
            case 'link': {
                // button
                if(item.detail.type === 'block') {
                    ret = (
                        <p className="bot-typeset__item-link">{item.detail.label}</p>
                    )
                // url link
                }else {
                    ret = (
                        <a href={item.detail.target} target="_blank" className="bot-typeset__item-link">{item.detail.label}</a>
                    )
                }
                break;
            }
            case 'richText': {
                ret = <div className="bot-typeset_item-rich" dangerouslySetInnerHTML={{ __html: text2emoji( item.detail.label||"")}}></div>
            }
            default:
                break;
        }
        return ret;
    }

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        const unions = tpl.unions || [];
        return (
            <ul className="bot-typeset">
            {unions.map((item, index) => {
                return (
                    <li key={index} className={`bot-typeset__item bot-typeset__${item.type}`}>
                    {this.renderItem(item)}
                    </li>
                )
            })}
            </ul>
        );
    }
}

export default StaticUnion;

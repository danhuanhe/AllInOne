import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fileSizeFormat } from '../../../utils';

class Form extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        if(tpl.id === 'bot_form') {
            return (
                <p>{tpl.label}</p>
            )
        } else if (tpl.id === 'qiyu_template_botForm'){
            return (
                <ul className="bot-form">
                {tpl.forms.map((item, index) => {
                    return (
                        <li key={index} className={`bot-form__item bot-form__${item.type}`}>
                        {item.type === 'image' ?
                            <React.Fragment>
                                <p className="bot-form__item-ttl">{item.label}</p>
                                {item.value ?
                                    <div className="bot-form__item-val">
                                            <div className="bot-form__file">
                                            <div className="bot-form__file-aside">
                                                <i className="iconfont icon-picture"></i>
                                            </div>
                                            <div className="bot-form__file-main">
                                                <p className="ttl">{item.value.name}</p>
                                                <p className="size">{item.value.size | fileSizeFormat}</p>
                                            </div>
                                            <img className="image_hidden" src={item.value.url+'?imageView'} data-group="ysf" />
                                        </div>
                                    </div>
                                    :null
                                }
                            </React.Fragment>:
                            <React.Fragment>
                                <p className="bot-form__item-ttl">{item.label}</p>
                                {item.value ? 
                                    <p className="bot-form__item-val">{item.value}</p>
                                    :null
                                }
                            </React.Fragment>
                        }
                        </li>
                    )
                })}
                </ul>
            );
        }else {
            return null;
        }
    }
}

export default Form;

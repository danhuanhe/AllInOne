import React, { Component } from 'react';
import PropTypes from 'prop-types';


class WxNews extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        // 是否单图文
        const isSingle = tpl.news.length == 1;
        return (
            <React.Fragment>
                <ul className="list">
                {tpl.news.map((item, index) => {
                    <li key={index} className="item">
                    {item.picurl ?
                        <img src={item.picurl} alt=""/>
                        :null
                    }
                    {isSingle ?
                        <React.Fragment>    
                        {item.title ?
                            <h4>{item.title}</h4>
                            :null
                        }
                        {item.description ?
                            <ul className="des-list">
                            {item.description.map((des, index) => {
                                return (
                                    <li key={index} className="des-item">{des}</li>
                                )
                            })}
                            </ul>
                            :null
                        }
                        </React.Fragment>:
                        <h4>{item.title}</h4>
                    }
                    {item.url ?
                        <a href={item.url} className="redirect" target="_blank">查看详情</a>
                        :null
                    }
                    </li>
                })}
                </ul>
            </React.Fragment>
        );
    }
}

export default WxNews;

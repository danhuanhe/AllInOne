import React, { Component } from 'react';
import PropTypes from 'prop-types';


class MiniProgramCardMsg extends Component {
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
        return (
            <div className={`minicard-wrap`}>
                <div className="minicard-head">
                    {
                        content.headImg ? 
                            <img className="avatar" src={content.headImg} alt="未提供小程序头像"/>
                        :null
                    }
                    <span className="minicard-name">{content.name || ''}</span>
                </div>
                <div className="minicard-title">{content.title}</div>
                <div className="minicard-cover">
                    <img src={content.thumbUrl} alt=""/>
                </div>
                <div className="minicard-foot">
                    <i className="iconfont icon-miniProgram"></i>
                    <span>小程序</span>
                </div>
            </div>
        );
    }
}

export default MiniProgramCardMsg;

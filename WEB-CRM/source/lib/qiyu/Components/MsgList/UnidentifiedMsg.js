import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UnidentifiedMsg extends Component {
    static propTypes = {
        text: PropTypes.string,
    };

    render() {
        return (
            <p>{this.props.text || '暂不识别的消息类型'}</p>
        );
    }
}

export default UnidentifiedMsg;

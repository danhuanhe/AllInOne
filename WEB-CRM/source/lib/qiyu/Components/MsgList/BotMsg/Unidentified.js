import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { filterTag } from '../util';

class Unidentified extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired
    };

    render() {
        const { content } = this.props;
        const { template:tpl } = content;
        return (
            <p>{filterTag(tpl.label ||'暂不识别的消息类型')}</p>
        );
    }
}

export default Unidentified;

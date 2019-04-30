import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { text2emoji } from '../../utils';

class RichTextMsg extends Component {
    static propTypes = {
        content: PropTypes.string.isRequired,
        eventHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { content } = this.props;
        const richText = content;
        return (
            <div dangerouslySetInnerHTML={{ __html: text2emoji(richText) }}
            ></div>
        );
    }
}

export default RichTextMsg;

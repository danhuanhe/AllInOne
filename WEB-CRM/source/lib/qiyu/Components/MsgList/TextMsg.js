import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { fillUrlOfText, text2emoji } from '../../utils';

class TextMsg extends Component {
    static propTypes = {
        content: PropTypes.string.isRequired,
        emojiMap: PropTypes.array,
        eventHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    search = () => {
        const { content } = this.props;
        this.props.eventHandler({
            name: 'searchKnowledge',
            data: {
                keyword: content
            }
        })
    }

    textFilter(text) {
        const filled = fillUrlOfText(_.escape(text || ''))
        return text2emoji(filled, this.props.emojiMap);
    }

    render() {
        const { content } = this.props;
        return (
            <React.Fragment>
                <p dangerouslySetInnerHTML={{ __html: this.textFilter(content)}}></p>
                <div className="search-knowledge" onClick={this.search}>
                    <span className="iconfont icon-magnifier"></span>
                </div>
            </React.Fragment>
        );
    }
}

export default TextMsg;

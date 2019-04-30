import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ImageMsg extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
        eventHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    onClick = (ev) => {
        const { content:image } = this.props;
        this.props.eventHandler({
            name: 'imageView',
            data: {
                name: image.name,
                url: image.url,
                imgNode: ev.target
            }
        })
    }

    render() {
        const { content } = this.props;
        return (
            <div onClick={this.onClick}>
                <img data-group="ysf" data-url={content.url} src={content.thumb} title={content.name} alt=""/>
            </div>
        );
    }
}

export default ImageMsg;

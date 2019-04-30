import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { spliceSuffix, fileSizeFormat } from '../../utils';


class FileMsg extends Component {
    static propTypes = {
        fromUser: PropTypes.number.isRequired,
        content: PropTypes.object.isRequired,
        eventHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    download = (ev) => {
        const { content:file } = this.props;
        this.props.eventHandler({
            name: 'download',
            data: {
                url: file.url,
                name: file.name
            }
        })
    }

    render() {
        const { fromUser, content:file } = this.props;
        const expired = new Date().getTime() > file.expire;
        return (
            <div className={`file-wrap ${expired? 'z-expired':''}`}>
                <div className="file-bd">
                    <div className="file-left">
                        <i className={`u-icon-${spliceSuffix(file.name)}`}></i>
                    </div>
                    <div className="file-right">
                        <div className="hd">
                            <p className="name">{file.name}</p>
                        </div>
                        <div className="bd">
                            <span className="size">{fileSizeFormat(file.size)}</span>
                            {expired ? 
                                <span className="info">已失效</span> 
                                : null
                            }
                            {!expired && fromUser ? 
                                <a className="download" onClick={this.download}>下载</a>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FileMsg;

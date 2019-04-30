import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VideoViewer } from 'ppfish';


class VideoMsg extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
        eventHandler: PropTypes.func.isRequired
    };

    render() {
        const { content:video } = this.props;
        const expired = new Date().getTime() > video.expire;
        return (
            <div className={`video-wrap`}>
                <VideoViewer
                    failedMessage={expired ? '已过期': null}
                    modalProps={{
                        
                    }}
                    videoProps={{
                        sources:[{
                            src: video.url,
                            type:'video/' + video.ext
                        }],
                        download: true,
                        downloadSrc: video.url
                    }}
                />
            </div>
        );
    }
}

export default VideoMsg;

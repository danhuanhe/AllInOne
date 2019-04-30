import React, { Component } from 'react';
import PropTypes from 'prop-types';


class AudioMsg extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
        eventHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.nAudio = React.createRef();
        this.state = {
            paused: true
        }
    }

    dur2time = (duration) => {
        if (!duration) {
            return '0"';
        }
        duration = Math.round(duration / 1000);
        return duration + '"';
    }

    dur2width = (duration) => {
        return 40 + 7 * duration / 1000;
    }

    getWidth = (audio) => {
        const audioWidth = this.dur2width(audio.dur);
        const textWidth = audio.tt.length * 14 + 38;
        return audioWidth > textWidth ? audioWidth : textWidth;
    }

    togglePlay = () => {
        const nAudio = this.nAudio.current;
        if (nAudio.paused) {
            nAudio.play();
        } else {
            nAudio.pause();
        }
    }

    onAudioStateChange = (paused) => {
        this.setState({
            paused: paused
        })
    }

    render() {
        const { content:audio } = this.props;
        return (
            <div className={`audio-wrap ${!this.state.paused?'z-playing':''}`} style={{width:this.getWidth(audio)}}>
                <div className="audio-top" onClick={this.togglePlay}>
                    <div className="length">
                        <span>{this.dur2time(audio.dur)}</span>
                    </div>
                    <i className="icon-voice"></i>
                    <audio
                        src="https://ysf.nosdn.127.net/6DB6A44FF040D96551EC00507730FC4D.wav"
                        ref={this.nAudio}
                        onPlay={this.onAudioStateChange.bind(this, false)}
                        onPause={this.onAudioStateChange.bind(this, true)}
                        onEnded={this.onAudioStateChange.bind(this, true)}
                    />
                </div>
                {audio.tt ?
                    <div className="audio-bottom">
                        <span className="audio-text">{audio.tt}</span>
                    </div>
                    :null
                }
            </div>
        );
    }
}

export default AudioMsg;

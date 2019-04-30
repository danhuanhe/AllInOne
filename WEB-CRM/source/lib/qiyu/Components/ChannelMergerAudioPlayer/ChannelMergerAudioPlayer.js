import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { AudioPlayer } from 'ppfish';

class ChannelMergerAudioPlayer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {
    // 组件装载完成后进行双通道混合
    this.createChannelMerger();
  }

  forceDownload = () => {
    const dLink = document.createElement('a');
    dLink.download = '';
    let blobUrl;
    dLink.onclick = () => {
      window.requestAnimationFrame(() => {
        window.URL.revokeObjectURL(blobUrl);
      });
    };
    fetch(this.props.src)
      .then(response => response.blob())
      .then(blob => {
        blobUrl = window.URL.createObjectURL(blob);
        dLink.href = blobUrl;
        dLink.click();
      })
      .catch(e => console.error(e));
  }

  createChannelMerger = () => {
    const audioElement = this.audioPlayer.audioInstance;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const track = audioContext.createMediaElementSource(audioElement);

    const channelMerger = audioContext.createChannelMerger(1);
    // 只做通道合并，不加其他音频路由组件，如音量控制等交给AudioPlayer组件控制
    track.connect(channelMerger);
    channelMerger.connect(audioContext.destination);
    this.audioContext = audioContext;
  };

  // 浏览器限制了语音自动播放，需要用户交互操作后程序才能触发
  onPlay = (e) => {
    const { onPlay } = this.props;
    const audioContext = this.audioContext;
    if ( audioContext && audioContext.state === 'suspended' ) {
      audioContext.resume().then(() => {});
    }
    if ( typeof onPlay === 'function' ) {
      onPlay(e);
    }
  }

  render() {
    const props = this.props;
    const { onPlay, ...otherProps } = props;
    return (
      <AudioPlayer
        ref={audioPlayer => this.audioPlayer = audioPlayer}
        onPlay={this.onPlay}
        crossOrigin="anonymous"
        {...otherProps}
      />
    )
  }
}
export default ChannelMergerAudioPlayer;

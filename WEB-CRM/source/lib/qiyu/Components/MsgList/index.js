import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import './index.less';
import _ from 'lodash';
import { PicturePreview } from 'ppfish';
import { downloadFile } from '../../utils';
import MsgFactory from './MsgFactory';

class MsgList extends Component {
    static propTypes = {
        list: PropTypes.array.isRequired,
        emojiMap: PropTypes.array,
        showName: PropTypes.bool,
        hidePortrait: PropTypes.bool,
        msgEventHandler: PropTypes.func.isRequired
    };

    render() {
        const { list, emojiMap, showName, hidePortrait, msgEventHandler } = this.props;
        return (
            <div className="m-msgList">
                {list.map((msg) => {
                    return (
                        <MsgFactory
                            key={msg.id}
                            showName={showName}
                            showPortrait={!hidePortrait}
                            msg={msg}
                            emojiMap={emojiMap}
                            eventHandler={msgEventHandler.bind(null, msg)}
                        ></MsgFactory>
                    )
                })}
            </div>
        );
    }
}

class MsgListEhanced extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureViewerVisible: false,
            pictureSource: [],
            pictureActiveIndex: 0
        }
    }
    msgEventHandler = (msg, ev) => {
        switch(ev.name) {
            case 'download':
                const { url, name} = ev.data;
                downloadFile(url, name);
                break;
            default:
                this.props.msgEventHandler && this.props.msgEventHandler(msg, ev);
        }
    }
    delegate = (ev) => {
        const node = ev.target;
        if (node.tagName.toLowerCase() === 'img' && node.getAttribute('data-group') === 'ysf') {
            this.viewImage(node);
        }
    }
    viewImage = (currentImgNode) => {
        const imgNodes = findDOMNode(this).getElementsByTagName('img');
        let ret = [];
        _.each(imgNodes, (imgNode) => {
            const src = imgNode.getAttribute('data-url') || imgNode.getAttribute('src');
            if(imgNode.getAttribute('data-group')) {
                ret.push({
                    src: src,
                    name: imgNode.getAttribute('title')||+new Date,
                    node: imgNode
                })
            }
        })
        let index = 0;
        for (let i = 0; i < ret.length; i++) {
            if (currentImgNode == ret[i].node) {
                index = i;
                break;
            }
        }
        this.setState({
            pictureViewerVisible: true,
            pictureSource: ret.map((item) => {
                return {src: item.src, name: item.name}
            }),
            pictureActiveIndex: index
        })
    }
    handlePictureViewClose = () => {
        this.setState({
            pictureViewerVisible: false,
        })
    }
    render() {
        return (
            <React.Fragment>
                <div className="msg-list-wrapper" onClick={this.delegate}>
                    <MsgList
                        {...this.props}
                        msgEventHandler={this.msgEventHandler}
                    ></MsgList>
                </div>
                <PicturePreview
                    mask={false}
                    progress={true}
                    draggable={true}
                    toolbar={true}
                    activeIndex={this.state.pictureActiveIndex}
                    source={this.state.pictureSource}
                    visible={this.state.pictureViewerVisible}
                    onClose={this.handlePictureViewClose}
                />
            </React.Fragment>
        )
    }
}

MsgList.Ehanced = MsgListEhanced;

export default MsgList;

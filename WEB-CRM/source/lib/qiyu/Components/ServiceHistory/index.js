import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { timestamp2fixedDate1, getOffset, getFirstAncestorByClass } from '../../utils';
import InfiniteScroll from 'react-infinite-scroller';
import UserTerminalInfo from '../UserTerminalInfo';
import { List } from 'ppfish';
import './index.less';


export default class ServiceHistory extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,  // userId
        sessionId: PropTypes.number.isRequired,
        limit: PropTypes.number,
        list: PropTypes.array,
        isLoading: PropTypes.bool,
        current: PropTypes.number,
        total: PropTypes.number,
        detailHeight: PropTypes.number,
        // 会话详情的渲染交给调用者
        renderSessionDetail: PropTypes.func.isRequired
    };

    static defaultProps = {
        limit: 10
    }

    constructor(props) {
        super(props);
        this.nscroll = React.createRef();
        this.state = {
            currentSessionId: null
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const { isLoading, list, current, total, limit } = this.props;
        const hasMore = current * limit < total;
        // 未占满一屏，需要继续拉取下一页
        if (hasMore && this.nscroll.current.scrollHeight <= this.nscroll.current.clientHeight) {
            this.props.loadMore();
        }
    }

    onItemClick = (item, ev) => {
        if (item.id == this.state.currentSessionId) {
            this.setState({
                currentSessionId: null
            });
        } else {
            const nextItemNode = getFirstAncestorByClass(ev.target, 'history-itm');
            this.setState({
                currentSessionId: item.id
            }, () => {
                this.slideTop(nextItemNode);
            });
        }
    }

    slideTop = (nitem) => {
        let offsetY = getOffset(nitem, this.nscroll.current).y;
        const rid = window.requestAnimationFrame(() => {
            this.nscroll.current.scrollTop = offsetY;
            window.cancelAnimationFrame(rid);
        });
    }

    getCategory = (item) => {
        if (!item.category || !item.category.name) return '未分类';
        if (item.interaction == 1) {
            return '机器人-' + item.category.name;
        } else {
            return item.category.name;
        }
    }

    renderTypeInfo = (item) => {
        let ret;
        switch (item.sessionType) {
            case 1: {
                // 呼叫
                const { answerType, callType } = item;
                let iconColor;
                if (answerType == 1 || answerType == 10 || answerType == 13) {
                    iconColor = 'green';
                } else {
                    iconColor = 'red';
                }
                let iconType = 'call';
                if (callType === 1) {
                    iconType = 'callin';
                } else if (callType === 2) {
                    iconType = 'callout';
                }
                ret = (
                    <span className={`icon-callType z-${iconColor}`}>
                        <i className={`iconfont icon-${iconType}`} />
                    </span>
                );
                break;
            }
            case 12: {
                // 短信
                const { smsStatus } = item;
                ret = (
                    <span className={`icon-smsType z-${smsStatus == 2 ? 'green' : 'red'}`}>
                        <i className={`iconfont icon-duanxin`} />
                    </span>
                );
                break;
            }
            default: {
                ret = (
                    <UserTerminalInfo
                        platform={item.platform}
                        userAgent={item.userAgent}
                        referrer={item.referrer}
                    />
                );
                break;
            }
        }
        return ret;
    }

    renderItem = (item) => {
        // 过滤当前会话
        if(item.id === this.props.sessionId) return null;
        const isCurrent = item.id === this.state.currentSessionId;
        return (
            <div className="history-itm">
                <div className={`itm-info ${isCurrent ? 'z-sel' : ''}`} onClick={this.onItemClick.bind(this, item)}>
                    <div className="hd">
                        <span className="time">
                            {
                                item.sessionType !== 1 && item.status === 0 ? <i className="iconfont icon-unread" /> : null
                            }
                            {timestamp2fixedDate1(item.startTime)}
                        </span>
                        <div className="type">{this.renderTypeInfo(item)}</div>
                        <span className="category" title={this.getCategory(item)}>{this.getCategory(item)}</span>
                        {
                            isCurrent ?
                                <i className="iconfont u-icon-arrow icon-arrowup" />
                                : <i className="iconfont u-icon-arrow icon-arrowdown" />
                        }
                    </div>
                    <div className="bd">
                        <p className="history-notes">{item.description || ''}</p>
                    </div>
                </div>
                {isCurrent ?
                    <div className="itm-detail" style={{ height: this.props.detailHeight || this.nscroll.current.offsetHeight - 80 }}>
                        {this.props.renderSessionDetail(item)}
                    </div>
                    : null
                }
            </div>
        );
    }

    render() {
        const { isLoading, list, current, total, limit } = this.props;
        const hasMore = current * limit < total;
        return (
            <div className="m-serviceHistory" ref={this.nscroll}>
                <InfiniteScroll
                    initialLoad={false}
                    threshold={30}
                    useWindow={false}
                    hasMore={hasMore}
                    loadMore={this.props.loadMore}
                >
                    <List
                        loading={isLoading && current === 1}
                        dataSource={list}
                        renderItem={item => (
                            <List.Item>
                                {this.renderItem(item)}
                            </List.Item>
                        )}
                    />
                    {!hasMore && !isLoading && list.length > 0 ?
                        <div className="nomore">
                            <p>没有更多了</p>
                        </div>
                        : null
                    }
                </InfiniteScroll>
            </div>
        );
    }
}

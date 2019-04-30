import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'ppfish';
import './index.less';
import { isToday, isYesterday, timestamp2date } from '../../utils';
import { RecordItem } from './RecordItem';

const modulePrefix = 'm-visitRecord';
const filters = {
    'timelineFormat': (timestamp) => {
        if(isToday(timestamp)) return '今天';
        if(isYesterday(timestamp)) return '昨天';
        return timestamp2date(timestamp, 'yyyy年MM月dd日');
    }
}
class VisitRecord extends Component {
    static propTypes = {
        detailPopoverPlacement: PropTypes.string,
        visitPage: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        appVisitPage: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        miniVisitPage: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        list: PropTypes.array
    };

    static defaultProps = {
        detailPopoverPlacement: 'bottom',
        visitPage: 0,
        appVisitPage: 0,
        miniVisitPage: 0, 
        list: []
    };

    renderDetail() {
        const { visitPage, appVisitPage, miniVisitPage, list } = this.props;
        if(list.length < 1) return null;
        return (
            <div className={`${modulePrefix}-detail`}>
                {visitPage > 0 ?
                    <div className="overview">
                        <div className="overview-item">
                            <span>网站访问量：</span>
                            <span>{visitPage}页</span>
                        </div>
                    </div>
                    : null
                }
                {appVisitPage > 0 ?
                    <div className="overview">
                        <div className="overview-item">
                            <span>App访问量：</span>
                            <span>{appVisitPage}页</span>
                        </div>
                    </div>
                    : null
                }
                {miniVisitPage > 0 ?
                    <div className="overview">
                        <div className="overview-item">
                            <span>小程序访问量：</span>
                            <span>{miniVisitPage}页</span>
                        </div>
                    </div>
                    : null
                }
                {list.map((item) => {
                    return (
                        <div className="list-item">
                            <div className="timeline">{filters['timelineFormat'](item.timeline)}</div>
                            {item.record.map((record, index) => {
                                return (
                                    <RecordItem key={index} {...record} />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        const { list } = this.props;
        const top3 = [];
        for(let i = 0; i < list.length; i++) {
            const item = list[i];
            if(top3.length == 3) break;
            for(let j = 0; j < item.record.length; j++) {
                if(top3.length < 3) {
                    const ret = {
                        record: item.record[j]
                    }
                    if(j == 0) {
                        ret.timeline = item.timeline;
                    }
                    top3.push(ret);
                }else {
                    break;
                }
            }
        }
        return (
            <div className={modulePrefix}>
                <div className={`${modulePrefix}-preview`}>
                    {top3.map((item, index) => {
                        return (
                            <div className="preview-item" key={index}>
                                {item.timeline ?
                                    <div className="timeline">{filters['timelineFormat'](item.timeline)}</div>
                                    :null
                                }
                                <RecordItem
                                    isPreview={true}
                                    {...item.record}
                                />
                            </div>
                        )
                    })}
                </div>
                <Popover
                    overlayClassName={`${modulePrefix}-popover`}
                    placement={this.props.detailPopoverPlacement}
                    trigger='click'
                    content={this.renderDetail()}
                >
                    <span className="show-detail">
                        查看详情<i className="iconfont icon-sort-desc" />
                    </span>
                    
                </Popover>
            </div>
        )
    }
}

export default VisitRecord;
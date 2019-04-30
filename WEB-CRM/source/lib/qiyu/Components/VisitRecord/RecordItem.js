import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'ppfish';
import { timestamp2date } from '../../utils'; 

export const RecordItem = (props) => {
    const { isPreview, type, device, title, href, desc, time, duration } = props;
    let contentJsx;
    switch (device) {
        case '1': {
            if(type === 0) {
                contentJsx = (
                    <div className="m-record-item-info">
                        <span className="time">{timestamp2date(time, 'HH:mm:ss')}</span>
                        <i className="iconfont icon-weibo"></i>
                        <a className="title" href={href} target="_blank" title={title}>{title}</a>
                        {!isPreview ?
                            <span className="dur">停留了{duration}</span>
                            :null
                        }
                    </div>
                )
            }else {
                contentJsx = (
                    <>
                        <div className="m-record-item-info">
                            <span className="time">{timestamp2date(time, 'HH:mm:ss')}</span>
                            <i className="iconfont icon-weibo"></i>
                            <span className="title" title={title}>{title}</span>
                            {isPreview && desc ?
                                <Popover
                                    placement="bottom"
                                    content={<div dangerouslySetInnerHTML={{ __html: desc }}></div>}
                                >
                                    <i className="iconfont icon-hints-notification-f"></i>
                                </Popover>
                                :null
                            }
                        </div>
                        {!isPreview && desc ? 
                            <div className="m-record-item-desc" dangerouslySetInnerHTML={{__html: desc}}></div>
                            :null
                        }
                    </>
                )
            }
            break;
        }
            
        default:
            break;
    }
    return (
        <div className="m-record-item">
            {contentJsx}
        </div>
    );
}

RecordItem.propTypes = {
    isPreview: PropTypes.bool,
    type: PropTypes.number,
    device: PropTypes.string,
    title: PropTypes.string,
    href: PropTypes.string,
    desc: PropTypes.string,
    time: PropTypes.number,
    duration: PropTypes.string
};
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { request, findCategory } from '../../utils';
import { Select, Input, Spin, Cascader } from 'ppfish';
import UserTerminalInfo from '../UserTerminalInfo';
import CustomFieldsForm from '../CustomFieldsForm/customFieldsForm';
import MsgList from '../MsgList';
import SessionStarter from '../SessionStarter/SessionStarter';
import './index.less';

const { TextArea } = Input;
const modulePrefix = "m-session-detail";


export default class OnlineSessionDetail extends Component {
    static propTypes = {
        session: PropTypes.object,
        isLoading: PropTypes.bool,
        categoryList: PropTypes.array,
        customFields: PropTypes.array,
        msgList: PropTypes.array,
        hidePortrait: PropTypes.bool,
        canStartSession: PropTypes.bool,
        emojiMap: PropTypes.array,
        onCategoryChange: PropTypes.func.isRequired,
        onStatusChange: PropTypes.func.isRequired,
        updateRemark: PropTypes.func.isRequired,
        onCustomFieldsChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        isLoading: true,
        msgList: []
    };

    updateRemark = (ev) => {
        this.props.updateRemark(ev.target.value);
    };

    onCustomFieldInputBlur = (customField) => {
        this.props.onCustomFieldsChange(customField);
    }

    onCustomFieldSelect = (customField) => {
        this.props.onCustomFieldsChange(customField);
    }

    msgEventHandler = (ev) => {
        this.props.msgEventHandler && this.props.msgEventHandler(ev);
    }

    render() {
        const { session, isLoading, categoryList, customFields, msgList, hidePortrait, canStartSession, emojiMap } = this.props;
        if(isLoading) {
            return <Spin />;
        }
        const { sessionExt, alarmDetail, category } = session;
        let defaultCascaderValue = [0];
        if (category.id && categoryList) {
            defaultCascaderValue = findCategory(categoryList, category.id).idAarray;
        }
        return (
            <div className={`${modulePrefix} ${canStartSession?'z-hasStarter':''}`}>
                <div className={`${modulePrefix}-main`}>
                    <div className={`${modulePrefix}-info`}>
                        <span className={`${modulePrefix}-category`}>
                            {
                                session.interaction ?
                                <span className="no-select">机器人-{category.name}</span>:
                                <Cascader
                                    allowClear={false}
                                    defaultValue={defaultCascaderValue}
                                    options={categoryList}
                                    fieldNames={{
                                        value: 'id',
                                        label: 'name',
                                        children: 'children'
                                    }}
                                    onChange={this.props.onCategoryChange}
                                />
                            }
                        </span>
                        <UserTerminalInfo
                            platform={session.platform}
                            userAgent={session.userAgent}
                            referrer={session.referrer}
                        />
                        <span className={`${modulePrefix}-status`}>
                            <Select
                                value={session.status}
                                placement="bottomRight"
                                dropdownStyle={{width:148}}
                                onChange={this.props.onStatusChange}
                            >
                                <Select.Option value={1}>{'已解决'}</Select.Option>
                                <Select.Option value={0}>{'未解决'}</Select.Option>
                            </Select>
                        </span>
                    </div>
                    <div className={`${modulePrefix}-remark`}>
                        <TextArea
                            defaultValue={session.description}
                            placeholder="请输入会话备注"
                            autosize={{ minRows: 1, maxRows: 4 }}
                            onBlur={this.updateRemark}
                        />
                    </div>
                    <CustomFieldsForm
                        customFields={customFields}
                        /* onChange={this.props.onCustomFieldsChange} */
                        onSelect={this.onCustomFieldSelect}
                        onInputBlur={this.onCustomFieldInputBlur}
                    />
                    <div className={`${modulePrefix}-satisfy`}>
                        <div className="satisfy-choice">
                            {session.satisfaction > 0 ?
                                <i className={`icon-satisfy icon-satisfy-${session.satisfactionType}-${session.satisfaction}`} />
                                :null
                            }
                            <span>{session.satisfactionName}</span>
                        </div>
                        {sessionExt && sessionExt.satisfactionTags?
                            <ul className="satisfy-tag">
                                {sessionExt.satisfactionTags.map((tag, index) => {
                                    return <li key={index} className="tag-item">{tag}</li>;
                                })}
                            </ul>
                            :null
                        }
                        {session.satisfactionRemarks?
                            <div className="satisfy-remark">备注：{session.satisfactionRemarks}</div>
                            :null
                        }
                    </div>
                    {alarmDetail && alarmDetail.alarmList?
                        <div className={`${modulePrefix}-alarm`}>
                            <div className="tlt">触犯报警项</div>
                            <ul className="list">
                                {alarmDetail.alarmList.map((item, index) => {
                                    if(item.show) {
                                        return <li key={index} className="item">{item.name} {item.value}次</li>;
                                    }else {
                                        return <li key={index} className="item">{item.name}</li>;
                                    }
                                })}
                            </ul>
                        </div>
                        :null
                    }
                    <div className={`${modulePrefix}-msglist`}>
                        <MsgList.Ehanced
                            list={msgList}
                            hidePortrait={hidePortrait}
                            emojiMap={emojiMap}
                            msgEventHandler={this.msgEventHandler}
                        />
                    </div>
                </div>
                {canStartSession ?
                    <SessionStarter 
                        session={session}
                    />
                    :null
                }
            </div>
        );
    }
}

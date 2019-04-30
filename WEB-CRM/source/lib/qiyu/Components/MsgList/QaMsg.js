import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { text2emoji } from '../../utils';

class QaMsg extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
        eventHandler: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { content } = this.props;
        const { answer_label, answer_list, evaluation, evaluation_content } = content;
        return (
            <React.Fragment>
                {
                    // 2好评，3差评
                    evaluation == 2 || evaluation == 3 ?
                        <div className="qa-eval-icon">
                            <div className="inner">
                                <i className={`iconfont icon-thumbs-${evaluation == 2 ? 'up' : 'down'}`}></i>
                            </div>
                        </div>
                        : null
                }
                <div className="qa-label" dangerouslySetInnerHTML={{ __html: text2emoji(answer_label) }}></div>
                {
                    answer_list && answer_list.length > 0 ? 
                    <ul className="qa-list">
                        {answer_list.map((item, index) => {
                            return (
                                <li key={index} className="qa-item">{item.question}</li>
                            )
                        })}
                    </ul> 
                    : null
                }
                {
                    evaluation == 3 && evaluation_content ? 
                    <div className="qa-evalcontent">{text2emoji(evaluation_content)}</div>
                    : null
                }
            </React.Fragment>
        );
    }
}

export default QaMsg;

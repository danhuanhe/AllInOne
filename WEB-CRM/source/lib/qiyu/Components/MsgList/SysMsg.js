import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { timestamp2fixedDate1 } from '../../utils';


class SysMsg extends Component {
    static propTypes = {
        content: PropTypes.string.isRequired,
        time: PropTypes.number,
        showTime: PropTypes.bool,
        remarks: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { content, time, showTime, remarks } = this.props;
        return (
            <React.Fragment>
            <p>
                {showTime ? 
                    <span className="time">{timestamp2fixedDate1(time)}</span>
                    :null
                } 
                {content}
            </p>
            {
                remarks ?
                <p className="remarks">{remarks}</p>
                :null
            }
            </React.Fragment>
        );
    }
}

export default SysMsg;

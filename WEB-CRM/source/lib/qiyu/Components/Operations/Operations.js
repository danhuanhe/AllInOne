import React from 'react';
import PropTypes from 'prop-types';

import './index.less';

const modulePrefix = 'm-Operations';


const Operations = ({
  head,
  left,
  right,
  className,
  style
}) => (
  <div className={`${modulePrefix} ${className ? className : ''}`} style={style}>
    {head}
    <div className={`${modulePrefix}-body`}>
      <div className={`${modulePrefix}-left`}>
        {left}
      </div>
      <div className={`${modulePrefix}-right`}>
        {right}
      </div>
    </div>
  </div>
);

Operations.propTypes = {
  head: PropTypes.node,
  left: PropTypes.node,
  right: PropTypes.node,
  className: PropTypes.string,
};

export default Operations;
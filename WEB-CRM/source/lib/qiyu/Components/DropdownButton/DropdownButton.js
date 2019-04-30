import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon} from 'ppfish';

const DropdownButton = ({visible, children, ...others}) => (
  <Button {...others}>
    {children} {
    visible ?
      <Icon type="top" style={{fontSize: 12}}/> :
      <Icon type="bottom" style={{fontSize: 12}}/>
  }
  </Button>
);

DropdownButton.propTypes = {
  visible: PropTypes.bool,
  children: PropTypes.node,
};

export default DropdownButton;

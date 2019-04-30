import React, { Component } from "react";
import PropTypes from "prop-types";

const SysMsg = ({ content }) => {
  return <p>{content}</p>;
};
SysMsg.propTypes = {
  content: PropTypes.string.isRequired
};

export default SysMsg;

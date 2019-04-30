import React, { Component } from "react";
import PropTypes from "prop-types";

const TextMsg = ({ content }) => {
  return <p>{content}</p>;
};
TextMsg.propTypes = {
  content: PropTypes.string.isRequired,
};

export default TextMsg;

import React, { Component } from "react";
const CharAvator = ({str=""}) => {
  const lastChar = str.charAt(str.length - 1);
  return (
    <div className="msg-char-avator">
      {lastChar}
    </div>
  )
};
export default CharAvator;

import React from 'react';
import {Link} from 'react-router';
import PropTypes from "prop-types";
import { Row, Col, Affix } from 'ppfish';

export default class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.object
  };


  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setMenuHighlight();
  }

  componentDidUpdate() {
    document.documentElement.scrollTop = 0;
  }

  setMenuHighlight = () => {
    const current = location.hash;
    const HIGHLIGHT_CLS = 'active';
    const menuItems = document.querySelectorAll('.nav-item a');

    function setHighlight(menuItems, cls) {
      Array.from(menuItems).forEach(menuItem => {
        const key = menuItem.getAttribute('href');
        if (key && current.indexOf(key) > -1) {
          menuItem.classList.add(cls);
        } else {
          menuItem.classList.remove(cls);
        }
      });
    }

    setHighlight(menuItems, HIGHLIGHT_CLS);
  };


  render() {
    const {children} = this.props;
    const CommonHeader = (
      <header className="g-header">
        <Row>
          <Col xs={24} sm={24} md={24} lg={6} xl={5} xxl={4} className="header-title">
            <Link to="/home" rel="noopener noreferrer">
              <img src={'//ysf.nosdn.127.net/unanqvsjrxhnpwqrulcuumqxicpwsojh'} alt="fish-design"/>
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={18} xl={19} xxl={20} className="header-navbar">
            <ul className="nav">
              <li className="nav-item">
                <Link to="/home">首页</Link>
              </li>
              <li className="nav-item">
                <Link to="/components/">组件</Link>
              </li>
            </ul>
          </Col>
        </Row>
      </header>
    );
    return (
      <div className="app">
        {CommonHeader}
        <div className="g-main">
          {children}
        </div>
      </div>
    );
  }
}

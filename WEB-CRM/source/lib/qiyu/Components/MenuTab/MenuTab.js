/**
 * 知识挖掘中的tab导航
 */

import React, {Component} from 'react';
import {Router, Route, Link} from 'react-router';

import PropTypes from 'prop-types';

import {Tabs} from 'ppfish';
const {TabPane} = Tabs;

import './MenuTab.less';
class MenuTab extends Component {

  static propTypes = {
    selected: PropTypes.string,
    tabs: PropTypes.array
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {children, tabs, selected} = this.props;
    const moduelPerfix = 'm-menuTab';

    return (<Tabs type="card" activeKey={selected} onChange={this.props.handleChange} className={`${moduelPerfix}`}>
      {
        tabs.map((item) => {
          return (<TabPane key={item.key} tab={item.name}/>);
        })
      }
    </Tabs>);

  }
}

export default MenuTab;

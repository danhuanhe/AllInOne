import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MainLayout from '../components/MainLayout';
import '../../assets/css/common/index.less';
import './App.less';

class App extends Component {

  static propTypes = {
    totalNum: PropTypes.number,
    list: PropTypes.array,
    offset: PropTypes.number,
  };

  static defaultProps = {
    totalNum: 0,
    list: [],
    offset: 0,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      children
    } = this.props;
    return (
      <MainLayout>
        {children}
      </MainLayout>
    );
  }
}

export default App;


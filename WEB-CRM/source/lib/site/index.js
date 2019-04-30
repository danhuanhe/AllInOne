import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, Redirect, IndexRoute } from 'react-router';
import '../node_modules/ppfish/dist/ppfish.min.css';
import './index.less';
import Home from './pages/home';
import Components from './pages/components';

const App = () => {
    /* return (
        <Router history={hashHistory}>
            <Route path="/home" component={Home} />
            <Route path="/spec" component={Spec} />
            <Route path="/components" component={Components}>
                <IndexRoute component={Demo} />
                <Route path=":demo" component={Demo} />
            </Route>
            <Redirect from="*" to="/home" />
        </Router>
    ) */
    return (
        <Router history={hashHistory}>
            <Route path="/home" component={Home} />
            <Route path="/components">
                <IndexRoute component={withBelonger(Components, 'qiyu')} />
                <Route path="qiyu/(:componentKey)" component={withBelonger(Components, 'qiyu')} />
                <Route path="cubex/(:componentKey)" component={withBelonger(Components, 'cubex')} />
            </Route>
            <Redirect from="*" to="/home" />
        </Router>
    );
};

const withBelonger = (WrappedComponent, belonger) => {
    return (props) => {
        return <WrappedComponent {...props} belonger={belonger} />;
    };
};

const render = () => {
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
};
if (module.hot) {
    module.hot.accept(() => {
        render();
  });
}

render();


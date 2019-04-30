import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { config } from "../../config";
import App from './view';
import Main from "./Main";
import NotFound from "../components/NotFound";

export default (
  <Route path={config.ROUTES.HOME.url} component={App}>
    <IndexRoute component={Main} />
    <Route path={config.ROUTES.APP.url} component={Main} />
    <Route path="*" component={NotFound} />
  </Route>
);

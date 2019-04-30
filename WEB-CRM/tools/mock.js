/* eslint-disable no-console */
import jsonServer from 'json-server';
import enableDestroy from 'server-destroy';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import { chalkSuccess } from './chalkConfig';
import config from '../source/config';

let server = null;
const db = './database-mocks/db.json';
const middlewares = jsonServer.defaults();
const ajaxPrefix = config.ajaxPrefix;
let router = jsonServer.router(db);

function start(){
  const app = jsonServer.create();
  app.use(middlewares);
  // Add this before app.use(router)
  app.use(jsonServer.rewriter({
    [`${ajaxPrefix}/`]: '/'
  }));

  app.use(router);
  server = app.listen(4001, function() {
    console.log(chalkSuccess('JSON Server is running'));
  });
  // Enhance with a destroy function
  enableDestroy(server);
}

// Watch .js or .json file
// Since lowdb uses atomic writing, directory is watched instead of file
chokidar
.watch(path.dirname(db))
.on('change', function () {
  const obj = JSON.parse(fs.readFileSync(db));
  const isDatabaseDifferent = !_.isEqual(obj, router.db.getState());
  if (isDatabaseDifferent) {
    console.log(chalkSuccess('Db file was changed, Reloading...'));
    server && server.destroy();
    router = jsonServer.router(obj);
    start();
  }
});
start();

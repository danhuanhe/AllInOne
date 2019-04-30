// This file configures a web server for testing the production build
// on your local machine.

import browserSync from "browser-sync";
import historyApiFallback from "connect-history-api-fallback";
import config, { defaultOptions } from "../webpack.merged.prod";
import { getRouteMiddleware, getDistFtlRender } from "./helps";
import httpProxy from "http-proxy-middleware";
import Url from "url";
import { patchNeiPort } from "./neiPatch";

let renderFtl;
const middlewares = [];

const { proxy, ftl, appRoutes, browserSyncMiddleware, spa } = defaultOptions;

if (proxy && proxy.length) {
  proxy.forEach(({ neiKey, contextOrUri, config }) => {
    if (neiKey) {
      let url = Url.parse(config.target);
      patchNeiPort(neiKey, url.port || 80);
    }
    middlewares.push(httpProxy(...[contextOrUri, config].filter(Boolean)));
  });
}

if (typeof browserSyncMiddleware === "function") {
  middlewares.push(browserSyncMiddleware);
}

if (ftl && typeof ftl === "object") {
  renderFtl = getDistFtlRender(ftl);
}

// 如果有应用配置的appRoutes则将spa的配置逻辑内置至getRouteMiddleware里，否则使用用户设置的spa
if (appRoutes) {
  middlewares.push(
    getRouteMiddleware(appRoutes, { renderFtl, production: true, spa })
  );
} else {
  if (spa) {
    let spaConfig = undefined;
    if (typeof spa === "object") {
      spaConfig = spa;
    }
    middlewares.push(historyApiFallback(spaConfig));
  }
}

// Run Browsersync
browserSync({
  host: defaultOptions.WEB_HOST,
  port: defaultOptions.WEB_PORT,
  ui: {
    port: defaultOptions.WEB_PORT + 1
  },
  server: {
    baseDir: defaultOptions.WEB_BASEDIR,
    routes: defaultOptions.WEB_ROUTES
  },
  middleware: middlewares,

  files: ["source/*.html", "dist/*.html", "dist/*.ftl"],
  open: defaultOptions.WEB_OPEN
});

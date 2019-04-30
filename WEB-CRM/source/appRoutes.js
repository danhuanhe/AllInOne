/**
 * @exports
 * @type {import('../tools/config').UrlAndTemplate}
 * */
// 建议在views或者source/pages目录下新建文件夹来放置不同页面的模板和entry。下面将补充 模板文件和entry的约定
// views/setting/foo.ftl ,将会删除掉前缀 `views/`后文件名后缀`.ftl` 然后将最后一级的`foo`替换为`entry`
// 得到 setting/entry. 然后将`/`符号替换成`_`下划线。
// 例如：
//  views/one/two/four/template.ftl -> one_two_four_entry
//  source/pages/one/two/four/template.html -> one_two_four_entry
//  source/pages/one/two/four/entry.js -> one_two_four_entry
const routes = {
  "/index/page/": "views/index/index.ftl",
  "/notFound/": "views/notFound/notFound.ftl",
  // "/demo/": "source/pages/demo/demoPage.html"
  // 你还可以自定义配置一个template对象
  // "/noHtml/": {
  //   filename: "noHtml.html",
  //   inject: true, // 注意不要在 webpack.config.dev.js里设置inject为false了，否则不起作用
  //   chunks: ["noHtml_entry"] // entryName是目录名称+下划线+entry
  // }
};
export default routes;

// 在浏览器访问到真实文件其实是由browserSync和webpackDevMiddleware这两个中间件提供内容的。
// 在开发阶段，不会替换模板的路径，所以可以通过
// localhost:3000/views/setting/setting.ftl  localhost:3000/source/pages/setting/setting.html  访问到文件
// 是因为filename是 views/setting/setting.ftl, 内容是由 devMiddleware提供的。
// 能够访问到vendor下面的文件是因为设置了WEB_BASEDIR. 是由browsersync提供的。

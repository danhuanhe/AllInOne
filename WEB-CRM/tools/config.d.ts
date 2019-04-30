import proxy from "http-proxy-middleware";
import browserSync from "browser-sync";
import HtmlWebpackPlugin from "html-webpack-plugin";

interface baseManifesto {
  /** 前端展示页面的路由映射关系，可是是appRoutes.js文件的导出对象或者appRoutes.js文件的绝对路径
   * @example
   *    例如访问的页面是 /aiP/ , 实际展示的页面内容是 views/ai/index.ftl 页面，
   *    那么在appRoutes.js里导出的对象则为 { "/aiP/" : "views/ai/index.ftl"  }。
   *    注意：
   *      1. 键名为url，大小写敏感； `/aiP/` 与 `/aiP`是两个url
   *      2. 如果开发环境有一些url配置不想在生产环境里使用，可以手动修改后，再传给selectEntriesAndTemplates函数
   * @example
   *    {
   *     "/aiP/" : "views/ai/index.ftl",
   *     "/ai/" : "source/pages/frameTest/frameTest.html" // 对应的entry为frameTest_entry，可以在config.dev.js里删除掉
   *   }
   */
  appRoutes: UrlAndTemplate | string;
  /** 是否输出打包进度 */
  progress?: boolean;
  /** 是否使用typescript，true表示启用 */
  typescript?: boolean | Object;
  /** less文件样式覆盖 */
  less?:
    | boolean
    | {
        modifyVars: Object;
      };
  /** GLOBAL全局变量，用于webpackDefinePlugin */
  globals?: Object;
  /** 是否是单页应用,如果是对象，将会传递给historyApiFallback */
  spa?: boolean | historyFallbackOptions;
  /** 是否解析ftl模版, bool 值或者 object */
  ftl?: boolean | ftlLoaderOptions;
  /** 传递给 HtmlWebpackPlugin 的配置参数 的数组 */
  templatePages?: Object[];

  /** browsersync的host配置，一般无需配置 */
  WEB_HOST?: string;
  /** 前端页面端口，browsersync的ui设置端口为这个端口+1 */
  WEB_PORT?: number;
  /** 前端页面的根路径
   * @example
   *  开发时默认设置为 `source` 页面，这样就可以通过url `/vendor/test.js` 访问 `/source/vendor/test.js下的文件`
   * */
  WEB_BASEDIR?: string;
  /**
   * Browsersync 的server配置里的routes对象，用于映射 url与本地目录的关系，一般用于处理写死在macro.ftl里的一些含有线上路径的url
   * 键名为url,键值为映射目录的相对路径（从web项目根目录）
   * @example
   *    例如上线以后的publicPath为 `/online`，页面的icon在macro.ftl里的url为 `/online/vendor/favicon.ico`，
   *    WEB_BASEDIR为 `source`目录，图标在 `source/vendor/favicon.ico`.
   *    配置routes为 { "/online" : "source" } 来将线上的 `/online` 映射为source目录
   *
   *   也可以将WEB_BASEDIR设置为项目根目录，打包的publicPath与线上的publicPath一致，然后配置 { publicPath: 本地base路径 }，来实现模拟的publicPath
   */
  WEB_ROUTES?: { [path: string]: string };
  /** Browsersync的open配置项 */
  WEB_OPEN?: browserSync.OpenOptions;
  /** 接口转发的配置，可以将api请求转发至nei或者测试服务器或者线上服务器
   * @example
   *  例如 测试服务器的在线url为， `http://some.host.online:8888` ，请求的接口api前缀为 `api`
   *  配置proxy为 [{
   *      contextOrUri:'/api',
   *      config:{
   *          target:"http://some.host.online:8888",
   *          changeOrigin:true
   *      }
   *  }]
   * 配置changeOrigin后，无需修改本地host, 除非页面的SDK有对域名进行检测。
   * 多个接口前缀转发可以配置多个proxy。如果使用的是nei，可以配置neiKey，将会自动修改nei配置的端口
   * 如果转发无法满足需求，可以配置 `browserSyncMiddleware` ,手动编写中间件去处理请求
   */
  proxy?: ProxyConfig[];
  /**
   * Browsersync的中间件，可以对开发时访问的url请求进行任何操作。
   * 如果首页在appRoutes.js中没有配置，那么可以配置首页跳转。
   * 如果 appRoutes.js 中的配置无法满足需求，可以在这里修改 req.url 为正确的url。做一次url映射
   * @example
   *    如果访问的url为 `/public/vendor/logo.png`，由于有 `/public` 这个publicPath,
   */
  browserSyncMiddleware?: browserSync.MiddlewareHandler;
}

export interface BuildManifesto extends baseManifesto {
  /** 打包前，项目根目录下需要清理的文件夹路径 */
  cleanBuild: string | boolean;
  /** 是否开启压缩, 开启压缩后，将会没有sourceMap */
  minimize?: boolean;
  /** 是否开启 */
  uglifyParallel?: boolean;
  /** 是否分析打包结果 */
  bundleAnalyze?: boolean;
}

export interface DevManifesto extends baseManifesto {
  /** 是否启用DLL缓存 */
  useDll?:
    | false
    | {
        /** 需要打包到dll chunk中的模块名 */
        chunks: string[];
      };
}

/**
 * 如果是多页应用，请按照url路径配置规则。请查看模板和entry的默认约定。
 * 如果是单页应用，请配置一个入口，然后在webpack.config.xx.js里配置spa ，historyApiFallfack.
   `/login` 和`/login/`是两个不同的url
   建议在views或者source/pages目录下新建文件夹来放置不同页面的模板和entry。下面将补充 模板文件和entry的约定
   views/setting/foo.ftl ,将会删除掉前缀 `views/`后文件名后缀`.ftl` 然后将最后一级的`foo`替换为`entry`
   得到 setting/entry. 然后将`/`符号替换成`_`下划线。
   例如：
    views/one/two/four/template.ftl -> one_two_four_entry
    source/pages/one/two/four/template.html -> one_two_four_entry
    source/pages/one/two/four/entry.js -> one_two_four_entry
 * */
export interface UrlAndTemplate {
  /**
   * 配置 url 和模板的对应规则对象，
   * 键名是 url
   * 键值从项目根目录开始的相对路径
   * @example
   *      {
   *        "/login": "views/app/login.ftl"
   *      }
   */
  [url: string]: string | HtmlWebpackPlugin.Options;
}
/** 根据路由配置返回公共的路由跳转中间件 */
interface getMiddlewareFunc {
  (config: UrlAndTemplate): browserSync.MiddlewareHandler;
}

interface selectEntriesAndTemplatesOption {
  /** 是否是生产环境，生产环境将会替换模板的输出目录 */
  production: boolean;
  /** url和模板的映射关系 */
  appRoutes: UrlAndTemplate;
  /** 选取views下的模板的glob表达式。自定义路径或者模板，请手动操作 */
  viewsGlob: string;
  /** views下希望忽略的模板的glob表达式 */
  viewsIgnore?: string | string[];
  /** source/entries 下webpack entry的glob表达式。自定义entry，请手动操作 */
  entriesGlob: string;
  /** entries下希望忽略的模板的glob表达式 */
  entriesIgnore?: string | string[];
}
interface selectEntriesAndTemplates {
  (options: selectEntriesAndTemplatesOption): {
    /** webpack 配置项里的entry，可以直接给webpack */
    entries: { [entryName: string]: string[] };
    /** 将会传递给HtmlWebpackPlugin的配置项 */
    templates: Array<HtmlWebpackPlugin.Options>;
  };
}

/** ftl Loader的配置 */
interface ftlLoaderOptions {
  /** ftl-mock的绝对路径 */
  dataPath: string;
  /** ftl 模板所在的文件夹的绝对路径 */
  templatePath: string;
}
interface ProxyConfig {
  /** NEI 的项目的key,填上这个将会自动修改 nei.xxx/server.config.js下面的端口 */
  neiKey?: string;
  /** http-proxy-middleware的第一个参数，可以为空。可以配置为api路径，或者api路径的数组，或者自定义函数 */
  contextOrUri?: string | string[] | proxy.Filter;
  /**http-proxy-middleware的配置项，配置接口转发到哪里 */
  config: proxy.Config;
}

interface historyFallbackOptions {
  disableDotRule?: true;
  htmlAcceptHeaders?: string[];
  index?: string;
  logger?: typeof console.log;
  rewrites?: Rewrite[];
  verbose?: boolean;
}

interface Context {
  match: RegExpMatchArray;
  parsedUrl: Url;
}
type RewriteTo = (context: Context) => string;

interface Rewrite {
  from: RegExp;
  to: string | RegExp | RewriteTo;
}

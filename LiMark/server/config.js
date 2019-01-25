//连接字符串
var config = {
    mongodbConnStr: 'mongodb://localhost:27017',//mongodb数据库链接字符串,
    dbName:"dbchx",
    //docDir: "D:/TestCodes/msite/webapp1/",//网站所在的磁盘目录
    port:8000,
    // //网站默认的路由规则
    // router: {
    //     "url": "{controller}/{action}/{id}/{page}",
    //     "default": { "controller": "home", "action": "index" }
    // },
    // viewExdName: "html",//视图文件扩展名
    // //************以下配置信息一般不用用户修改***************************
    // //静态文件所处的一级目录，处于这些目录下的文件，都视为静态文件，直接输出给用户
    // staticDir: { "pages": true, "html": true, "res": true, "lib": true, "src": true, "static": true, "modules": true, "dev": true },
    // //扩展名为以下文件，直接输出给用户，不需要经过模板引擎处理
    // staticSrcTypes: { "jpg": 1, "jpeg": 1, "png": 1, "gif": 1, "ico": 1, "css": 1, "js": 1 },
    // //静态文件contentType
};

module.exports = config;
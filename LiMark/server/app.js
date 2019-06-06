var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dailyRouter = require('./routes/daily');
var Freemarker=require('./freemarker');
//process.env.NODE_ENV = "prod";
var my__dirname=__dirname;//console.log(process.env.NODE_ENV);

var p__dirname=my__dirname.replace(/\\\w+$/,"");//"E:\1\2\3" 修改为 "E:\1\2"

if(process.env.NODE_ENV == "prod"){
  p__dirname=p__dirname+"\\publish";//console.log(my__dirname);
}

var app = express();
//console.log(p__dirname);
app.engine('ftl', function (filePath, options, callback) { // define the template engine
  const viewroot=path.join(p__dirname, 'views');console.log(viewroot);
  fm = new Freemarker({
    viewRoot:viewroot,
    options: {
      sourceEncoding: 'utf-8'
    }
  });
  const ftlFile=filePath.substring(viewroot.length+1);console.log(ftlFile);
  var rendered=fm.renderSync(ftlFile,options);
  return callback(null, rendered);
});

// view engine setup
app.set('views', path.join(p__dirname, 'views'));
app.set('view engine', 'ftl');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());console.log(path.join(p__dirname, 'static'));
app.use(express.static(path.join(p__dirname, 'static')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', dailyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{
    message:res.locals.message,
    error:res.locals.error
  });
});

module.exports = app;

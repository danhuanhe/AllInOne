var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var Freemarker=require('./freemarker');

var p__dirname=__dirname.replace(/\\\w+$/,"");//"E:\1\2\3" 修改为 "E:\1\2"
var app = express();

app.engine('ftl', function (filePath, options, callback) { // define the template engine
  const viewroot=path.join(p__dirname, 'views');
  fm = new Freemarker({
    viewRoot:viewroot,
    options: {
      sourceEncoding: 'utf-8'
    }
  });console.log(filePath);
  const ftlFile=filePath.substring(viewroot.length+1);
  var rendered=fm.renderSync(ftlFile,options);
  return callback(null, rendered);
});

// view engine setup
app.set('views', path.join(p__dirname, 'views'));
app.set('view engine', 'ftl');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(p__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.render('error');
});

module.exports = app;

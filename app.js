var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/web/index');
const accountRouter = require('./routes/api/account')
const authRouter = require('./routes/web/auth')
const authApiRouter = require('./routes/api/auth')

const session = require('express-session')
const MongoStore = require('connect-mongo')

const { DBHOST, DBPORT, DBNAME } = require('./config/config')
var app = express();

app.use(session({
	name: 'sid',	//设置cookie的名字
	secret: 'atguigu',	//参与加密的字符串
	saveUninitialized: false, //是否每次请求都设置一个cookie用来存储sessionId
	resave: true, //是否每次请求时重新保存session
	store: MongoStore.create({
		mongoUrl: `mongodb://${DBHOST}:${DBPORT}/${DBNAME}`
	}),
	cookie: {
		httpOnly: true, //无法通过js获取cookie
		maxAge: 3600 * 1000	 * 24 * 7//设置过期事件
	} 
	
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api',accountRouter)
app.use('/api',authApiRouter)
app.use('/',authRouter)

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

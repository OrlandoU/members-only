var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcryptjs')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var postRouter = require('./routes/post')
var authRouter = require('./routes/auth')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await User.findOne({email: email});
      if (!user) {

        return done(null, false, { message: "Incorrect username" });
      };
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })
    } catch (err) {
      return done(err);
    };
  })
);
passport.serializeUser((user, done)=>{
  console.log(user)
  done(null, user._id)
})
passport.deserializeUser(async (id, done)=>{
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  };
})

app.use(passport.session())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/post', postRouter)
app.use('/user', usersRouter);
app.use('/auth', authRouter)

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
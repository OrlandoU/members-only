var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcryptjs')
var passport = require('passport')
var mongoose = require('mongoose');
var session = require('express-session')
var User = require('./models/user')
var LocalStrategy = require('passport-local').Strategy

const authRouter = require('./routes/auth')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var postRouter = require('./routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

passport.use(
  new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
    try {
      const user = await User.findOne({email: email});
      console.log(user)
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



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

mongoose.set('strictQuery', false);
const connectionString = process.env.MongoDb_url

main().catch(err => console.log(err))
async function main() {
  await mongoose.connect(connectionString)
}

const checkAuth = (req, res, next) => {
  if(!req.user){
    res.redirect('/auth/login')
  }
  next()
}
app.use('/', indexRouter);
app.use('/about', (req, res, next)=>{
  res.render('about', {
    title: 'About Page',
    user:req.user
  })
})
app.use('/post', postRouter)
app.use('/user', checkAuth,usersRouter);
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
  console.log(req.user)
  res.status(err.status || 500);
  res.render('error', {
    user:req.user
  });
});

module.exports = app;

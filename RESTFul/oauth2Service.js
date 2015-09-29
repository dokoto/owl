var express = require('express'),
  passport = require('passport'),
  util = require('util'),
  logger = require('morgan'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  GitHubStrategy = require('passport-github').Strategy,
  cookieParser = require('cookie-parser');

var connection = {
	GITHUB_CLIENT_ID: "ec052859ef86d94ac7f5",
    GITHUB_CLIENT_SECRET: "a3ef2f6cde6dd1bdc4310795583b3d9a62df48ad",
	ip: '46.105.122.140',
	port: 46969,
	url: function() {
		return 'https://' + this.ip + ':' + this.port;
	}
};


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: connection.GITHUB_CLIENT_ID,
    clientSecret: connection.GITHUB_CLIENT_SECRET,
    callbackURL: connection.url() + "/auth/github/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


var rest = express();

rest.use(logger('dev'));
rest.use(cookieParser());
rest.use(bodyParser.urlencoded({
  extended: true
}));
rest.use(methodOverride('X-HTTP-Method-Override'));
rest.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
}));
rest.use(passport.initialize());
rest.use(passport.session());
rest.use(express.static(__dirname + '/public'));


rest.get('/', function (req, res) {
  console.log('/ ' + req.user);
});

rest.get('/account', ensureAuthenticated, function (req, res) {
  console.log('/account ' + req.user);
});

rest.get('/login', function (req, res) {
  console.log('/login' + req.user);
  res.send('<a href="/auth/github">Login with GitHub</a>');
});

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
rest.get('/auth/github',
  passport.authenticate('github'),
  function (req, res) {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
rest.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    res.redirect('/');
  });

rest.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

rest.listen(connection.port, function () {

  var host = this.address().address;
  var port = this.address().port;

  console.log('RESTFul OWL services listening all connection from http://%s:%s', host, port);

});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}
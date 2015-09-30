var express = require('express'),
  passport = require('passport'),
  util = require('util'),
  logger = require('morgan'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  GitHubStrategy = require('passport-github').Strategy,
  https = require('https'),
  mongoDBStore = require('connect-mongodb-session')(session),
  fs = require('fs');

var connection = {
  git : {
    GITHUB_CLIENT_ID: "ec052859ef86d94ac7f5",
    GITHUB_CLIENT_SECRET: "a3ef2f6cde6dd1bdc4310795583b3d9a62df48ad",
    callback: '/oauthcallback',
  },
  ip: '46.105.122.140',
  port: 46969,
  url: function () {
    return 'https://' + this.ip + ':' + this.port;
  }
};

var httpsOptions = {
  /*
   * ALERTA !!! HAY QUE REGENERAR LAS KEYS
   * - openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
   * - openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
   */
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

var store = new mongoDBStore( { 
	uri: 'mongodb://localhost:27017/connect_mongodb_session_owl', 
	collection: 'owlSessions' 
});

store.on('error', function(error) {       
	assert.ifError(error);       
	assert.ok(false);     
});

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
    clientID: connection.git.GITHUB_CLIENT_ID,
    clientSecret: connection.git.GITHUB_CLIENT_SECRET,
    callbackURL: connection.url() + connection.git.callback
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
rest.use(bodyParser.urlencoded({
  extended: true
}));
rest.use(methodOverride('X-HTTP-Method-Override'));
rest.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: store
}));
rest.use(passport.initialize());
rest.use(passport.session());
rest.use(express.static(__dirname + '/public'));


rest.get('/', function (req, res) {
  console.log('IN : /');
  res.send('<h1>HOME PAGE</h1>');
});

rest.get('/account', ensureAuthenticated, function (req, res) {
  console.log('IN: /account');
  res.send('<h1>ACCOUNT PAGE</h1>');
});

rest.get('/login', function (req, res) {
  console.log('IN: /login');
  console.log('USER: ' + req.user);
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
rest.get(connection.git.callback,
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    console.log('Github callback ejecutado..');
    res.redirect('/');
  });

rest.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


https.createServer(httpsOptions, rest).listen(connection.port, function () {

  var host = this.address().address;
  var port = this.address().port;

  console.log('RESTFul OWL services listening all connection from https://%s:%s', host, port);

});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('Usuario autenticado');
    return next();
  }
  console.log('Usuario NO autenticado');
  res.redirect('/login')
}

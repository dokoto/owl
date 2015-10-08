'use strict';

var express = require('express'),
  passport = require('passport'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  GitHubStrategy = require('passport-github').Strategy,
  mongoDBStore = require('connect-mongodb-session')(session),
  log4js = require('log4js'),
  fs = require('fs'),
  path = require('path');


var Configurator = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;

  function _Global() {
    global.Base = process.cwd();
    global.Config = require('./utils/Config').create([{
      collectionKey: 'connection',
      pathConfigFile: '/config/connection.json'
    }, {
      collectionKey: 'db',
      pathConfigFile: '/config/db.json'
    }, {
      collectionKey: 'https',
      pathConfigFile: '/config/https.json'
    }]);

    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    global.ensureAuthenticated = function (req, res, next) {
      if (req.isAuthenticated()) {
        Logger.info('Usuario autenticado');
        return next();
      }
      Logger.info('Usuario NO autenticado');
      res.redirect('/noauth')
    };

  }

  function _Options() {
    /*
     * ALERTA !!! HAY QUE REGENERAR LAS KEYS
     * - openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
     * - openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
     */
    _self.options.key = fs.readFileSync(path.join(Base, Config.fetch('https', 'https.pathToKey')));
    _self.options.cert = fs.readFileSync(path.join(Base, Config.fetch('https', 'https.pathToCert')));
  }

  function _SessionStorage() {
    _self.store = new mongoDBStore({
      uri: Config.fetch('db', 'db.mongo.session.uri'),
      collection: Config.fetch('db', 'db.mongo.session.collection')
    });

    _self.store.on('error', function (error) {
      assert.ifError(error);
      assert.ok(false);
    });
  }

  function _Passport() {
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
        clientID: Config.fetch('connection', 'github.clientID'),
        clientSecret: Config.fetch('connection', 'github.clientSecret'),
        callbackURL: Config.fetch('connection', 'service.url') + Config.fetch('connection', 'github.callback')
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
  }

  function _log4js() {
    var log4js = require('log4js');
    log4js.configure('./config/log4js.json');

    global.Logger = log4js.getLogger("startup");

  }

  function _Express() {
    _self.rest = express();

    _self.rest.use(bodyParser.urlencoded({
      extended: true
    }));
    _self.rest.use(methodOverride('X-HTTP-Method-Override'));
    _self.rest.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      },
      store: _self.store
    }));
    _self.rest.use(passport.initialize());
    _self.rest.use(passport.session());
    _self.rest.use(express.static(__dirname + '/public'));
  }

  function _Definitions() {
    var definitions = require('./definitions');
    _self.rest.use('/', definitions);
  }

  //*****************************************************
  // PUBLIC
  //*****************************************************
  /*
   * collections = {collectionKey, pathConfigFile}
   */
  function configurator(collections) {
    _self = this;
    this.rest = null;
    this.options = {};
    this.store = null;
    _Global();
  }

  configurator.prototype.generate = function () {
    _Options();
    _SessionStorage();
    _Passport();
    _Express();
    _log4js();
    _Definitions();

    return {
      app: this.rest,
      options: this.options
    }
  };


  return configurator;

})();


module.exports = {
  create: function () {
    return new Configurator();
  }

};
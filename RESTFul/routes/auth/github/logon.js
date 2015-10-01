'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function (req, res) {
  console.log('IN : /');
  res.send('<h1>HOME PAGE</h1>');
});

router.get('/login', function (req, res) {
  console.log('IN: /login');
  console.log('USER: ' + req.user);
  res.send('<a href="/auth/github">Login with GitHub</a>');
});

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
router.get('/auth/github',
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
router.get(Config.fetch('connection', 'github.callback'),
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    console.log('Github callback ejecutado..');
    res.redirect('/');
  });

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});



module.exports = router;
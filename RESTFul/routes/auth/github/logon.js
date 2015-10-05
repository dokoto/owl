'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var response = require('../../../utils/response').create();

router.get('/', function (req, res) {
  console.log('IN : /');
  response.standard(res, 200, 'NOTHING TO SAID');
});

/*
router.get('/login', function (req, res) {
  console.log('IN: /login');
  console.log('Redirectting to /auth/github');
  res.redirect('/auth/github');
});
*/

router.get('/noauth', function (req, res) {
  console.log('IN : /noauth');
  response.standard(res, 401, 'NO AUTH');
});

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
//router.get('/auth/github',
router.get('/login',  
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
    failureRedirect: '/noauth'
  }),
  function (req, res) {
    console.log('Github callback ejecutado..');
    response.standard(res, 200, 'LOGIN OK');
  });

router.get('/logout', function (req, res) {
  req.logout();
  response.standard(res, 200, 'LOGOUT OK');
});



module.exports = router;
'use strict';

var express = require('express');
var github = require('./routes/auth/github/logon');
var images = require('./routes/images');

var router = express.Router();

router.use('/', github);
router.use('/', images);

module.exports = router;
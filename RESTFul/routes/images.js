var express = require('express');
var router = express.Router();

/*
 * GET imageslist.
 */
router.get('/imagesList', ensureAuthenticated, function (request, response) {
  response.send("Hi, I'm RESTFull services for OWL App in /images");
});

module.exports = router;
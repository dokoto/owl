var express = require('express');
var router = express.Router();
var utils = {
  images: require('../utils/images').create(),
  response: require('../utils/response').create()
};


/*
 * GET /images/shot/:url
 */
router.get('/images/shot/', ensureAuthenticated, function (request, response) {
    utils.images.doThumbAsync(request.query.url).then(function(res) {
    	utils.response.standardWithValue(response, res.status, res.message, res.url);
    }).fail(function(res){
    	utils.response.standardWithValue(response, res.status, res.message, res.url);
    })
});

module.exports = router;
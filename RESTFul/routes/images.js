var express = require('express');
var router = express.Router();

/*
 * GET imageslist.
 */
router.get('/imagesList', ensureAuthenticated, function (request, response) {  
  response.standard(res, 200, 'IMAGES_LIST');
});

module.exports = router;
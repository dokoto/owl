var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var images = require('./routes/images');



var rest = express();
rest.use(bodyParser.urlencoded({ extended: true }));
rest.use(logger('dev'));
rest.use(bodyParser.json());
rest.use(bodyParser.urlencoded({
  extended: false
}));
rest.use(cookieParser());

rest.use('/', images);
rest.get('/', function (request, response) {
  response.send("Hi, I'm RESTFull services for OWL App in Root");
});



var server = rest.listen(46969, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('RESTFUl OWL listening at http://%s:%s', host, port);

})

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var https = require('https');
var fs = require('fs');
var images = require('./routes/images');



var rest = express();
rest.use(bodyParser.urlencoded({
  extended: true
}));
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


var httpsOptions = {
  /*
   * ALERTA !!! HAY QUE REGENERAR LAS KEYS
   * - openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
   * - openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
   */
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

https.createServer(httpsOptions, rest).listen(46969, function () {

  var host = this.address().address;
  var port = this.address().port;

  console.log('RESTFul OWL services listening all connection from http://%s:%s', host, port);

});
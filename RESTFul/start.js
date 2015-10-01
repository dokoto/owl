'use strict';

var https = require('https');
var configurator = require('./configurator').create();
var restful = configurator.generate();
var ip = Config.fetch('connection', 'service.ip');

https.createServer(restful.options, restful.app).listen(Config.fetch('connection', 'service.port'), function () {
  var address = this.address();
  console.log('RESTFul OWL services listening all connection from https://%s:%s', ip, address.port);

});
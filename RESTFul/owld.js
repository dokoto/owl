'use strict';

var cluster = require('express-cluster');
var https = require('https');
var configurator = require('./configurator').create();
var restful = configurator.generate();
var ip = Config.fetch('connection', 'service.ip');

if (configurator.options.nocluster === true) {

  https.createServer(restful.options, restful.app).listen(Config.fetch('connection', 'service.port'), function () {
    var address = this.address();
    Logger.trace('RESTFul OWL service listening connection at https://%s:%s with pid: ', ip, address.port, process.pid);
    console.log('RESTFul OWL service listening connection at https://%s:%s with pid: ', ip, address.port, process.pid);
  });
  
} else {

  cluster(function () {
    https.createServer(restful.options, restful.app).listen(Config.fetch('connection', 'service.port'), function () {
      var address = this.address();
      Logger.trace('RESTFul OWL service listening connection at https://%s:%s with pid: ', ip, address.port, process.pid);
      console.log('RESTFul OWL service listening connection at https://%s:%s with pid: ', ip, address.port, process.pid);
    });
  });
}
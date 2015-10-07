'use strict';
var shelljs = require('shelljs');
var randomstring = require('randomstring');
var tpl = require('./tpl').create();
var commands = require('../templates/commands');
var Q = require('q');
var request = require('request');

var Images = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;

  function _all(params) {
    console.log('Full render url detection : ' + params.url);
    var deferred = Q.defer();
    try {
      var fileName = randomstring.generate() + '.png';

      var cmd = tpl.fromString(commands.image.capture, {
        basePath: Base,
        url: params.url,
        fileName: fileName
      });

      var log = shelljs.exec(cmd, {
        silent: true
      });

      if (log.code === 0) {
        cmd = tpl.fromString(commands.image.convert, {
          basePath: Base,
          fileNameIn: fileName,
          resizePorc: '25%',
          fileNameOut: fileName
        });

        log = shelljs.exec(cmd, {
          silent: true
        });

        if (log.code === 0) {
          deferred.resolve({
            status: 200,
            url: Config.fetch('connection', 'service.files.url') + fileName,
            message: log.output
          });
        } else {
          throw new Error(log.output);
        }
      } else {
        throw new Error(log.output);
      }

    } catch (error) {
      deferred.reject({
        status: 500,
        message: error.message
      });
    } finally {
      return deferred.promise;
    }
  }

  function _youtube(params) {
    console.log('Youtube.com url detection : ' + params.url);
    var deferred = Q.defer();
    try {
      var idRegex = params.url.match(params.regex);
      if (idRegex !== null) {
        var id = idRegex.pop();
        deferred.resolve({
          status: 200,
          url: 'http://img.youtube.com/vi/' + id + '/3.jpg',
          message: 'DONE'
        });
      } else {
        throw new Error('youtube url fail regex');
      }
    } catch (error) {
      deferred.reject({
        status: 500,
        message: error.message
      });
    } finally {
      return deferred.promise;
    }
  }

  function _imagur(params) {
    console.log('Imgur.com url detection : ' + params.url);
    var deferred = Q.defer();
    try {
      var rxResult = params.url.match(/([^\/]+)$/);
      if (rxResult !== null) {
        var id = rxResult.pop();
        var ix = id.lastIndexOf('.');
        id = (ix !== -1) ? id.substr(0, ix) : id;
        var imgurBaseUrl = 'http://i.imgur.com/';
        var apiUrl = 'http://imgur.com/gallery/' + id + '.json';
        request(apiUrl, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            try {
              var result = JSON.parse(body);
              deferred.resolve({
                status: 200,
                url: ((result.data.image.is_album === true) ?
                  imgurBaseUrl + result.data.image.album_cover + 's.jpg' : imgurBaseUrl + result.data.image.hash + 's.jpg'),
                message: 'DONE'
              });
            } catch (error) {
              deferred.resolve({
                status: 200,
                url: imgurBaseUrl + id + 's.jpg',
                message: 'DONE'
              });
            }
          }
        });

      } else {
        deferred.reject({
          status: 500,
          message: 'Regex for imagur failed'
        });
      }
    } catch (error) {
      deferred.reject({
        status: 500,
        message: error.message
      });
    } finally {
      return deferred.promise;
    }
  }

  function _error(params) {
    var deferred = Q.defer();
    deferred.reject({
      status: 500,
      message: params.message
    });
    return deferred.promise;
  }

  function _detectProv(url) {
    var test = {
      error: [{
        message: 'Url must start with protocol "http://" or "https://"',
        func: function (url) {
          return (url.match(/(http|https):\/\//g) === null)?false:true;
        }
      },{
        message: 'Double http protocol in URL not alloed',
        func: function (url) {
          return (url.match(/(http|https):\/\//g).length > 1)?false:true;
        }
      }],
      services: [{
        regex: /youtube\.com.*user/,
        func: _all
      },{
        regex: /youtube\.com.*channel/,
        func: _all
      },{
        regex: /youtu\.be.*(.{11})/,
        func: _youtube
      }, {
        regex: /youtube\.com.*(\?v=|\/embed\/)(.{11})/,
        func: _youtube
      }, {
        regex: /^(http|https):\/\/.*imgur\./,
        func: _imagur
      }, {
        regex: /^(http|https):\/\/.*/,
        func: _all
      }]
    };

    for (var i = 0; i < test.error.length; i++) {      
        if (test.error[i].func(url) === false) {
          _error({message: test.error.message});
        }
      
    }

    for (var i = 0; i < test.services.length; i++) {
      if (url.match(test.services[i].regex) !== null) {
        return test.services[i].func({
          url: url,
          regex: test.services[i].regex
        });
      }
    }

  }

  //*****************************************************
  // PUBLIC
  //*****************************************************
  function images() {
    _self = this;
  }

  images.prototype.doThumbAsync = function (url) {
    return _detectProv(url);
  };


  return images;

})();


module.exports = {
  create: function () {
    return new Images();
  }

};
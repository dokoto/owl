define(['jquery'], function ($) {
  'use strict';

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;

  //*****************************************************
  // PUBLIC
  //*****************************************************
  var Imagur = (function () {


    function imagur(size) {
      _self = this;
    }

    function _getUrl(originalUrl, id) {
      var imgurBaseUrl = 'http://i.imgur.com/';
      var apiUrl = 'http://imgur.com/gallery/' + id + '.json';
      var defer = $.Deferred();

      $.get(apiUrl)
        .done(function (info) {
          var url = '';
          if (info.data.image.is_album === true) {
            url = imgurBaseUrl + info.data.image.album_cover + 's.jpg';
          } else {
            url = imgurBaseUrl + info.data.image.hash + 's.jpg'
          }

          defer.resolve({
            id: id,
            url: {
              thumb: url,
              original: originalUrl
            }
          });

        }).fail(function (jqXHR, status, error) {
          defer.reject(error);
        });

      return defer;
    }

    imagur.prototype.run = function (urls) {
      var deferreds = [];
      var defer = $.Deferred();

      for (var i = 0; i < urls.length; i++) {
        var rxResult = urls[i].match(/([^\/]+)$/);
        if (rxResult !== null) {
          var id = rxResult.pop();
          var ix = id.lastIndexOf('.');
          id = (ix !== -1) ? id.substr(0, ix) : id;
          deferreds.push(_getUrl(urls[i], id));
        } else {
          Log.error.v0('Regex for imagur failed in : ' + urls[i]);
          defer.reject('ERROR');
        }
      }

      $.when.apply($, deferreds)
        .done(function () {
          defer.resolve(arguments);
        }).fail(function (jqXHR, status, error) {
          defer.reject(error);
        });

      return defer;
    }

    return imagur;

  })();

  return {
    create: function () {
      return new Imagur();
    }

  };

});
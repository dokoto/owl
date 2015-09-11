define(['jquery'], function ($) {
  'use strict';

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;

  //*****************************************************
  // PUBLIC
  //*****************************************************
  var Capture = (function () {
    function capture(size) {
      _self = this;
      this.size = size;
    }

    function _processUrls(urls, regexExpresions, urlBase, size, thumbProcess) {
      var i = 0,
        x = 0,
        idRegex = '',
        id = '',
        result = [];

      for (i = 0; i < urls.length; i++) {
        for (x = 0; x < regexExpresions.length; x++) {
          idRegex = urls[i].match(regexExpresions[x]);
          if (idRegex !== null) {
            id = idRegex.pop();
            result.push({
              id: id,
              url: {
                thumb: thumbProcess(urlBase, id, size),
                original: urls[i]
              }
            });
            continue;
          }
        }
      }

      return result
    }



    capture.prototype.youtube = function (urls) {
      Log.info.v1('Capturing youtube thumb..');
      if (!Array.isArray(urls)) {
        Log.error.v0('[Capture.youtube] "urls" param must be an Array');
        return [];
      }
      var thumbSize = {
        SMALL: 3,
        MEDIUM: 2,
        HIGH: 1,
        HIGHER: 0
      };
      var youtubeRegex = [
        /youtu\.be.*(.{11})/,
        /youtube\.com.*(\?v=|\/embed\/)(.{11})/
      ];
      var youtubeImgUrl = 'http://img.youtube.com/vi/';
      var thumbProcess = function(urlBase, id, size) {
        return urlBase + id + '/' + size + '.jpg';
      };
      return _processUrls(urls, youtubeRegex, youtubeImgUrl, thumbSize.SMALL, thumbProcess);
    };

    capture.prototype.imgur = function (urls) {
      Log.info.v1('Capturing imgur thumb..');
      if (!Array.isArray(urls)) {
        Log.error.v0('[Capture.imgur] "urls" param must be an Array');
        return [];
      }
      var thumbSize = {
        SMALL: 's',
        LARGE: 'l'
      };
      var imgurRegex = [
        /([^\/]+)(?=\.\w+$)/,
        /([^\/]+)$/        
      ];
      var imgurImgUrl = 'http://i.imgur.com/';
      var thumbProcess = function(urlBase, id, size) {
        return urlBase + id + size + '.jpg';
      };
      return _processUrls(urls, imgurRegex, imgurImgUrl, thumbSize.SMALL, thumbProcess);

    };

    return capture;

  })();


  return {
    create: function () {
      return new Capture();
    }

  };

});
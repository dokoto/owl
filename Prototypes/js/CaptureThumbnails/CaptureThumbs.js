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

    capture.prototype.youtube = function (urls) {
      Log.info.v1('Capturing youtube thumb..');
      if (!Array.isArray(urls)) {
        Log.error.v0('[Capture.youtube] "urls" param must be an Array');
        return [];
      }

      var i = 0,
        x = 0,
        id = '',
        youtubeImgUrl = 'http://img.youtube.com/vi/',
        result = [];
      var youtubeRegex = [
        /youtu\.be.*(.{11})/,
        /youtube\.com.*(\?v=|\/embed\/)(.{11})/
      ];

      for (i = 0; i < urls.length; i++) {
        for (x = 0; x < youtubeRegex.length; x++) {
          id = urls[i].match(youtubeRegex[x]);
          if (id !== null) {
            result.push(youtubeImgUrl + id.pop() + '/' + this.size + '.jpg');
          }
        }
      }

      return result;
    };

    return capture;

  })();


  return {
    thumbSize: {
      SMALL: 3,
      MEDIUM: 2,
      HIGH: 1,
      HIGHER: 0
    },
    create: function (size) {
      return new Capture(size || this.thumbSize.SMALL);
    }

  };

});
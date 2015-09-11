define(['jquery', 'CaptureThumbnails/CaptureThumbs'], function ($, CaptureThumbs) {
  'use strict';

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;

  //*****************************************************
  // PUBLIC
  //*****************************************************
  var Main = (function () {
    function main() {
      _self = this;
    }

    main.prototype.run = function () {
      var youtubeUrls = [
        'https://www.youtube.com/watch?v=MdYWTs_Xkyw',
        'https://www.youtube.com/watch?v=Y1XGtkrBCFg',
        'https://m.youtube.com/watch?v=BA8uMXvx528',
        'https://m.youtube.com/watch?v=GIrp9PnnmHk',
        'http://youtu.be/GIrp9PnnmHk'
      ];
      var capture = CaptureThumbs.create();
      var youtubeThumbs = capture.youtube(youtubeUrls);
      var i = 0;
      for (i = 0; i < youtubeThumbs.length; i++) {
        $('<img >')
          .attr('src', youtubeThumbs[i])
          .appendTo('body')
          .load(function (thumb) {
            Log.info.v1('Imagen loaded Ok : ' + thumb);
          }(youtubeThumbs[i]));
      }
    };

    return main;

  })();


  return {
    create: function () {
      return new Main();
    }

  };

});
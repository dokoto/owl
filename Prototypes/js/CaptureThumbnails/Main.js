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

    function _addYoutube() {
      var youtubeUrls = [
        'https://www.youtube.com/watch?v=MdYWTs_Xkyw',
        'https://www.youtube.com/watch?v=Y1XGtkrBCFg',
        'https://m.youtube.com/watch?v=BA8uMXvx528',
        'http://youtu.be/GIrp9PnnmHk'
      ];
      var capture = CaptureThumbs.create();
      var youtubeThumbs = capture.youtube(youtubeUrls);
      var i = 0;
      
      for (i = 0; i < youtubeThumbs.length; i++) {
        $('<img >')
          .attr('id', youtubeThumbs[i].id)
          .attr('src', youtubeThumbs[i].url.thumb)
          .appendTo('#pictureGrid')
          .load(function (thumb) {
            Log.info.v1('Imagen loaded Ok : ' + thumb.url.thumb);
          }(youtubeThumbs[i]));

        $('#' + youtubeThumbs[i].id)
        .wrap('<li>')
        .wrap('<a href="' + youtubeThumbs[i].url.original + '">');
        
      }
    }

    function _addImgur() {
      var imgurUrls = [
        'http://imgur.com/1dnuq0F',
        'http://imgur.com/gallery/gaojg',
        'http://imgur.com/gallery/kbHj6ja',
        'http://imgur.com/gallery/jSfP2qz',
        'http://imgur.com/gallery/1OhRiwY'
      ];

      $.when(CaptureThumbs.create().imgur(imgurUrls))
        .done(function (imgurThumbs) {

          var i = 0;
          for (i = 0; i < imgurThumbs.length; i++) {
            $('<img >')
              .attr('id', imgurThumbs[i].id)
              .attr('src', imgurThumbs[i].url.thumb)
              .appendTo('#pictureGrid')
              .load(function (thumb) {
                Log.info.v1('Imagen loaded Ok : ' + thumb.url.thumb);
              }(imgurThumbs[i]));

            $('#' + imgurThumbs[i].id)
            .wrap('<li>')
            .wrap('<a href="' + imgurThumbs[i].url.original + '">');
          }

        })
        .fail(function (jqXHR, status, error) {
          Log.error.v0(error);
        });
    }

    function _createStructure() {
      $('<ul>')
      .attr('id', 'pictureGrid')
      .appendTo('#container-region')
    }

    main.prototype.run = function () {
      _createStructure();
      _addYoutube();
      _addImgur();
    };

    return main;

  })();


  return {
    create: function () {
      return new Main();
    }

  };

});
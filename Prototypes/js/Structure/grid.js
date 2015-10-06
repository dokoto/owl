define(['jquery', 'masonry', 'imagesLoaded'], function ($, Masonry, imagesLoaded) {
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

    function _getShot(url) {
      $.ajax({
        method: "GET",
        url: 'https://46.105.122.140:46969/images/shot/',
        data: {
          url: url
        }
      }).done(function (data) {
        data = JSON.parse(data);
        if (data.status === "200") {
          console.log(data.value);
        } else if (data.status === "401") {
          _authProcess(url);
        }
      });
    }

    function _authProcess(url) {
      var ref = cordova.InAppBrowser.open('https://46.105.122.140:46969/login', '_blank', 'location=yes,ignoresslerror=yes');

      ref.addEventListener('loadstart', function (event) {
        console.log('loadstart ' + event.url);
      });

      ref.addEventListener('loadstop', function (event) {
        console.log('loadstop ' + event.url);
        if (event.url.indexOf('https://46.105.122.140:46969/oauthcallback') !== -1) {
          ref.close();
          _getShot(url);
        }
      });

      ref.addEventListener('loaderror', function (event) {
        console.log('loaderror ' + event.url);
      });
    }


    main.prototype.run = function () {
      var grid = document.querySelector('.grid');
      var msnry;
      imagesLoaded(grid, function () {
        msnry = new Masonry(grid, {
          itemSelector: '.grid-item',
          columnWidth: '.grid-sizer',
          percentPosition: true
        });
      });


      /*
      clipBoard.setCopyListener(function (data) {
        console.log(data.item);
        $.ajax({
          method: "GET",
          url: 'https://46.105.122.140:46969/images/shot/',
          data: {url: data.item}
        }).done(function(data) {

        });
      }, function (error) {
        if (error) {
          console.log('error: ' + error);
        }
      });
*/
    };

    return main;

  })();


  return {
    create: function () {
      return new Main();
    }

  };

});
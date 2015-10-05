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

    function _f1() {}


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

      $.ajax({
        method: "GET",
        url: 'https://46.105.122.140:46969/login/'
      }).done(function (data) {
        if (data.status === 200) {
          $.ajax({
            method: "GET",
            url: 'https://46.105.122.140:46969/images/shot/',
            data: {
              url: 'http://www.google.es'
            }
          }).done(function (data) {
            if (data.status === 200) {
              console.log(data.url);
            }
          });
        }
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
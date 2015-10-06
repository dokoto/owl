define(['jquery', 'masonry', 'imagesLoaded', 'Helpers/images'], function ($, Masonry, imagesLoaded, images) {
    'use strict';


    //*****************************************************
    // PRIVATE
    //*****************************************************
    var _self = null;
    var _images = null;

    function _addImage(urlRef, urlThumb) {
      $('<img>')
        .attr('src', urlThumb)
        .appendTo('#container-region')
        .wrap('<div class="grid-item">')
        //.wrap('<a href="' + urlRef + '">')
        .load(function (urlThumb) {
            Log.info.v1('Imagen loaded Ok : ' + urlThumb);
          }(urlThumb));
      }

      function _activeStructureManager() {
        var grid = document.querySelector('.grid');
        var msnry;
        imagesLoaded(grid, function () {
          msnry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: true
          });
        });
      }

      function _activeCopyListener() {
        clipBoard.setCopyListener(function (data) {
          $.when(_images.doShot(data.item)).then(function (urlConv) {
            _addImage(data.item, urlConv.value);
          }).fail(function (error) {
            console.error(error);
          });
        }, function (error) {
          if (error) {
            console.log('error: ' + error);
          }
        });
      }

      //*****************************************************
      // PUBLIC
      //*****************************************************
      var Main = (function () {

        function main() {
          _self = this;
          _images = images.create();
        }

        main.prototype.run = function () {
          _activeStructureManager();
          _activeCopyListener();
        };

        return main;

      })();


      return {
        create: function () {
          return new Main();
        }

      };

    });
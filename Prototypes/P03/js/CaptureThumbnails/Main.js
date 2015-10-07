define(['jquery', 'Helpers/images', 'freewall'], function ($, images) {
  'use strict';


  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;
  var _images = null;

  function _refreshImages() {
    var wall = new freewall("#freewall");
    wall.reset({
      selector: '.brick',
      animate: true,
      cellW: 150,
      cellH: 'auto',
      onResize: function () {
        wall.fitWidth();
      }
    });
    var images = wall.container.find('.brick');
    images.find('img').load(function () {
      wall.fitWidth();
    });
  }

  function _modifyImage(id, urlRef, urlThumb) {
    console.log('_modifyImage id : ' + id + '  url: ' + urlRef);
    $('#' + id).parent().attr('href', urlRef);
    $('#' + id).attr('src', urlThumb);
    _refreshImages();
  }

  function _insertImage(id, urlRef, urlThumb) {
    console.log('_insertImage id : ' + id + '  url: ' + urlRef);
    $('#freewall')
      .prepend("<div class='brick' style='width:33%;'><a href='" + urlRef + "'><img id='" + id + "' src='" + urlThumb + "' width='100%'></a></div>");
      _refreshImages();
  }

  function _activeCopyListener() {
    clipBoard.setCopyListener(function (data) {
      var _id = Math.round(new Date().getTime() + (Math.random() * 100));      
      _insertImage(_id, data.item, 'assets/img/squares.gif');
      $.when(_images.doShot(data.item, _id)).then(function (convertion) {
        _modifyImage(convertion.id, data.item, convertion.value);
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
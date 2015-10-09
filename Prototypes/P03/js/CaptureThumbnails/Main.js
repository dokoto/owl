define(['jquery', 'Helpers/images', 'jquery-hammer', 'freewall'], function ($, images) {
  'use strict';


  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;
  var _images = null;

  function _refreshNewImages() {
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
    _bindLongPress();
  }

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
    wall.fitWidth();
    _bindLongPress();
  }

  function _modifyImage(id, urlRef, urlThumb) {
    console.log('_modifyImage id : ' + id + '  url: ' + urlRef);
    $('#' + id).parent().attr('href', urlRef);
    $('#' + id).attr('src', urlThumb);
    _refreshNewImages();
  }

  function _insertImage(id, urlRef, urlThumb) {
    console.log('_insertImage id : ' + id + '  url: ' + urlRef);
    $('#freewall')
      .prepend("<div class='brick' style='width:33%;'><a href='" + urlRef + "'><img id='" + id + "' src='" + urlThumb + "' class='capture' width='100%'></a></div>");
    _refreshNewImages();
  }

  function _removeImage(id, urlRef) {
    console.log('_removeImage id : ' + id + '  url: ' + urlRef);
    $('#' + id).parent().parent().remove()
    _refreshImages()
  }

  function _activeCopyListener() {
    clipBoard.setCopyListener(function (data) {
      var _id = Math.round(new Date().getTime() + (Math.random() * 100));
      _insertImage(_id, data.item, 'assets/img/squares.gif');
      $.when(_images.doShot(data.item, _id)).then(function (convertion) {
        _modifyImage(convertion.id, data.item, convertion.value);
      }).fail(function (error) {
        console.error(error);
        //_removeImage(error.id, data.item);
        _modifyImage(error.id, data.item, 'assets/img/mystery-box.jpg');
        navigator.notification.alert('Something went wrong, sorry :(', null, 'Error', 'Done');
      });

    }, function (error) {
      if (error) {
        console.log('error: ' + error);
      }
    });
  }

  function _bindLongPress() {    
    $('.capture').hammer().off("press");
    $('.capture').hammer().bind("press", function (ev) {      
      console.log(ev);
      ev.stopPropagation();
      navigator.notification.confirm('Do you realy want delete it ?', function (buttonIndex) {
        if (buttonIndex === 1) {
          _removeImage(ev.target.id, ev.target.src);
          console.log('Image id: ' + ev.target.id + ' deleted');
        } else {
          console.log('Delete Image id: ' + ev.target.id + ' cancel by user');
        }
      }, 'Remove Image', ['Delete', 'Cancel']);
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
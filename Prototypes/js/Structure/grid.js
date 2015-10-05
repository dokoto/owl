define(['jquery', 'masonry'], function ($, Masonry) {
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
      var msnry = new Masonry('.grid', {
        itemSelector: '.grid-item',
        percentPosition: true,
        columnWidth: '.grid-sizer'
      });
    };

    return main;

  })();


  return {
    create: function () {
      return new Main();
    }

  };

});
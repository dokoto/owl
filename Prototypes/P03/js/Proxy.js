define(['jquery'], function ($) {
  'use strict';

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;

  //*****************************************************
  // PUBLIC
  //*****************************************************
  var Proxy = (function () {
    function proxy() {
      _self = this;
    }

    proxy.prototype.run = function () {
      Log.info.v1('Mapping Prototypes');
      var protoNames = {
        captureThumbs: 'CaptureThumbnails/Main',
        grid: 'Structure/grid'
      }      
      require([protoNames.captureThumbs], function (Proto) {
        var proto = Proto.create();
        proto.run();    
      });
    };

    return proxy;

  })();


  return {
    create: function () {
      return new Proxy();
    }

  };

});
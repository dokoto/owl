define(['jquery'], function ($) {
  'use strict';

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;

  function _authProcess(callBack, paramCallBack) {
    var ref = cordova.InAppBrowser.open('https://46.105.122.140:46969/login', '_blank', 'location=yes,ignoresslerror=yes');

    ref.addEventListener('loadstart', function (event) {
      console.log('loadstart ' + event.url);
    });

    ref.addEventListener('loadstop', function (event) {
      console.log('loadstop ' + event.url);
      if (event.url.indexOf('https://46.105.122.140:46969/oauthcallback') !== -1) {
        ref.close();
        callBack(paramCallBack);
      }
    });

    ref.addEventListener('loaderror', function (event) {
      console.log('loaderror ' + event.url);
    });
  }

  var Auth = (function () {
    //*****************************************************
    // PUBLIC
    //*****************************************************
    function auth() {
      _self = this;
    }

    auth.prototype.doAuth = function (callBack, paramCallBack) {
      _authProcess(callBack, paramCallBack);
    };


    return auth;

  })();


  return {
    create: function () {
      return new Auth();
    }

  };

});
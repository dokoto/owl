define(['jquery', 'Helpers/auth'], function ($, auth) {
  'use strict';


  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;
  var _auth = null;

  function _getShot(url) {
    var deferred = $.Deferred()
    $.ajax({
      method: "GET",
      url: 'https://46.105.122.140:46969/images/shot/',
      data: {
        url: url
      }
    }).done(function (data) {
      data = JSON.parse(data);
      if (data.status === "200") {
        deferred.resolve(data);
      } else {
        deferred.reject(data);
      }
    }).fail(function (error) {
      error = JSON.parse(error.responseJSON);
      if (error.status === "401") {
        _auth.doAuth(_getShot, url);
      } else {
        deferred.reject(error);
      }
    });

    return deferred.promise();
  }

  var Images = (function () {

    //*****************************************************
    // PUBLIC
    //*****************************************************
    function images() {
      _self = this;
      _auth = auth.create();
    }

    images.prototype.doShot = function (url) {
      return _getShot(url);
    };


    return images;

  })();



  return {
    create: function () {
      return new Images();
    }

  };

});
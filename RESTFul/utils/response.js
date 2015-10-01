'use strict';

var Response = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;
  
  function _f1 (funcNode) {
  }

  //*****************************************************
  // PUBLIC
  //*****************************************************
  function response() {
    _self = this;
  }

  response.prototype.standard = function (res, status, message) {
    var _ = require('underscore');
    var path = require('path');
    var compiled = _.template( path.join(Base, '/templates/response.json'));

    res.status(status).json(compiled({
      status: status,
      message: message
    }));

  };

  return response;

})();


module.exports = {
  create: function () {
    return new Response();
  }

};
'use strict';

var _ = require('underscore');

var Tpl = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;
  
  function _compile (template, params) {
    var compiled = _.template(template);
    return compiled(params);
  }

  //*****************************************************
  // PUBLIC
  //*****************************************************
  function tpl() {
    _self = this;
  }

  tpl.prototype.fromString = function (template, params) {
    if (typeof template !== 'object' && typeof template !== 'string') {
      throw new Error('"template" param must be object or string');
    }

    if (typeof template === 'object') {
      template = JSON.stringify(template);
    }

    return _compile(template, params);
  };

  tpl.prototype.fromFile = function (path, params) {
    var template = require(path);
    if (typeof template === 'object') {
      template = JSON.stringify(template);
    }
    return _compile(template, params)
  };


  return tpl;

})();


module.exports = {
  create: function () {
    return new Tpl();
  }

};
'use strict';

var Test = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;
  
  function _f1 (funcNode) {
  }

  //*****************************************************
  // PUBLIC
  //*****************************************************
  function test() {
    _self = this;
  }

  test.prototype.f1 = function () {
  };


  return test;

})();


module.exports = {
  create: function () {
    return new Test();
  }

};
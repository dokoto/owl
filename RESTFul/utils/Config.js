'use strict';

var Config = (function () {

  //*****************************************************
  // PRIVATE
  //*****************************************************
  var _self = null;

  
  function _resolveComplexVal (funcNode) {
    try {

      if (funcNode === undefined) {
        throw 'funcNode is undefined';
      }

      if (typeof funcNode === 'string') {
        return funcNode;
      } else if (typeof funcNode === 'object') {
        var dFunc, i;
        var funcDeps = [grunt, options];
        var funcDepsTxt = ['grunt', 'options'];

        for (i = 0; i < funcNode.nodeLibs.length; i++) {
          funcDeps.push(require(funcNode.nodeLibs[i]));
          funcDepsTxt.push(funcNode.nodeLibs[i]);
        }
        funcDepsTxt.push(funcNode.code);
        dFunc = Function.apply(null, funcDepsTxt);

        return dFunc.apply(null, funcDeps);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function _loadCollections(collections) {
    if (Array.isArray(collections) === false) {
      console.error('collections must be an Array');
      return [];
    }
    var loadedCols = {};
    for(var collection in collections) {
      if(collections.hasOwnProperty(collection)){
        loadedCols[collection.collectionKey] = require(collection.pathConfigFile);
      }
    }

    return loadedCols;
  }

  function _getValue(collection, key) {
    return loadedCols[collection][key];
  }

  //*****************************************************
  // PUBLIC
  //*****************************************************
  /*
   * collections = {collectionKey, pathConfigFile}
   */
  function config(collections) {
    _self = this;
    this.collections = _loadCollections(collections);
  }

  config.prototype.fetch: function (collection, key) {
    return _resolveComplexVal(_getValue(collection, key));
  };


  return config;

})();


module.exports = {
  create: function (collections) {
    return new Config(collections);
  }

};
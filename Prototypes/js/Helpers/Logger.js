define(['jquery'], function ($) {

  'use strict';

  var Logger = (function () {

    //*****************************************************
    // PRIVATE
    //*****************************************************
    var _self = null;

    function _now() {
      var date = new Date();
      var minutes = date.getMinutes();
      minutes = (minutes < 10) ? '0' + minutes : minutes;
      var hours = date.getHours();
      hours = (hours < 10) ? '0' + hours : hours;
      var seconds = date.getSeconds();
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      return '[' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hours + ':' + minutes + ':' + seconds + '.' + date.getMilliseconds() + '] ';
    };

    function _errorPrint(message, color) {
      console.log('%c' + _now() + message, 'background: ' + color.background + '; color: ' + color.color + '; font-size:12px');

    }

    function _infoPrint(message) {
      console.log('%c' + _now() + message, 'background: #FFFFFF; color: #7A97F5; font-size:12px');
    }

    function _printCOLOR(func, message, color) {
      if (color !== undefined) {
        func(message, color);
      } else {
        func(message, color);
      }
    }

    function _printTYPE(type, message, color) {
      switch (type) {
      case 'info':
        if (color === undefined) {
          color = {
            background: '#FFFFFF',
            color: '#7A97F5'
          };
        }
        _printCOLOR(_infoPrint, message, color);
        break;
      case 'error':
        if (color === undefined) {
          color = {
            background: '#FFFFFF',
            color: '#EB4651'
          };
        }
        _printCOLOR(_errorPrint, message, color);
        break;
      }
    }

    function _print(priority, type, message, color) {
      if (priority <= _self.priority) {
        _printTYPE(type, message, color);
      }
    }

    function _factory(typeMsg) {
      var funcs = {};
      for (var i = 0; i < _self.verboseDeep; i++) {
        funcs['v' + i] = function (i, typeMsg, message, color) {
          return _print(i, typeMsg, message, color);
        }.bind(_self, i, typeMsg);
      }
      return funcs;
    }

    //*****************************************************
    // PUBLIC
    //*****************************************************
    function logger(verboseDeep, priority) {
      _self = this;
      this.priority = priority;
      this.verboseDeep = verboseDeep;
      this.typeMsg = {
        ERROR: 'error',
        INFO: 'info'
      };
      this.info = _factory(this.typeMsg.INFO);
      this.error = _factory(this.typeMsg.ERROR);
    }

    logger.prototype.info = function () {
      return this.info;
    };

    logger.prototype.error = function () {
      return this.error;
    };

    return logger;

  })();


  return {
    VERBOSE_DEEP: 2,
    priority: {
      NORMAL: 0,
      DEBUG: 1
    },
    create: function (priority) {
      return new Logger(this.VERBOSE_DEEP, priority);
    }

  };

});
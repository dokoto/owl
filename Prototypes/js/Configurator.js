requirejs.config({
  paths: {
    domReady: 'libs/vendor/domReady',
    jquery: 'libs/vendor/jquery-2.1.4.min',
    masonry: 'libs/vendor/masonry.pkgd.min',
    imagesLoaded: 'libs/vendor/imagesloaded.pkgd'
  },
  shim: {
    "masonry": ["jquery"]
  }
});


requirejs.onResourceLoad = function (context, map, depMaps) {
  updateModuleProgress(context, map, depMaps);
};

var updateModuleProgress = function (context, map, depMaps) {
  var console = window.console;
  if (console && console.log) {
    console.log('[LOAD PHASE]  ' + map.name + ' at ' + map.url);
  }
};

require(['jquery', 'domReady'], function ($, domReady) {
  domReady(function () {
    updateModuleProgress = function (context, map, depMaps) {
      var loadingStatusEl = $('#loading-status');
      var loadingModuleNameEl = $('#loading-module-name');
      if (loadingStatusEl && loadingModuleNameEl) {
        loadingStatusEl.innerHTML = loadingStatusEl.innerHTML += '.'; //add one more dot character
        loadingModuleNameEl.innerHTML = map.name + (map.url ? ' at ' + map.url : '');
        console.log('[LOAD PHASE]  ' + map.name + ' at ' + map.url);
      }
    };
  });
});


window.onerror = function (message, file, line, col, error) {
  console.error(message);
  console.error(file + ' linea ' + line + ' - col ' + col);
};

require(['Proxy', 'Helpers/Logger'], function (Proxy, Logger) {

  'use strict';

  window.Log = Logger.create(Logger.priority.DEBUG);
  $('#loading-status').empty();
  Log.info.v0('OWL START');
  var proxy = Proxy.create();
  proxy.run();

});
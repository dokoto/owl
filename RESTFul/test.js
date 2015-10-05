'use strict';

var configurator = require('./configurator').create();
//var response = require('./utils/response').create();
var utilsImg = require('./utils/images').create();


utilsImg.doThumbAsync('http://startrekofgodsandmen.com/main/index.php?option=com_content&view=article&id=104&Itemid=168').then(function (res) {
  console.log(JSON.stringify(res));
});
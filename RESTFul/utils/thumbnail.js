// Imagemagick
// node_modules/phantomjs/lib/phantom/bin/phantomjs utils/rasterize.js "http://imgur.com/gallery/lcboi" public/files/png/imagur.png "1024px*768px"
// convert public/files/png/imagur.png -resize 20% public/files/png/imagur2.png
// http://www.imagemagick.org/script/convert.php
// http://infoheap.com/use-phantomjs-to-create-site-thumbnail/
var page = require('webpage').create(); 
var system = require('system');
var url = system.args[1];
var output = system.args[2];
page.viewportSize = { width: 1024, height: 768 }; 
page.open(url, function () {   
		page.clipRect = {top:0, left:0, width:1024, height:1024};   
		page.render(output);  
	       	phantom.exit(); 
});

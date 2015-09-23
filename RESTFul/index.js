var express = require('express');

var server = express.createServer();
server.configure(function(){
 server.use(express.bodyParser());
 server.use(express.methodOverride());
 server.user(app.router());
 server.user(express.errorHandler({dumpExceptions: true, showStack: true}));
});

server.get('/api', function(request, response) {
 response.send("Hi, I'm RESTFull services for OWL App");
});

server.listen(6969);

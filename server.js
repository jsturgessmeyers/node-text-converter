var express = require('express');
var app = express();
var converter = require('./converter');

app.get('/', function (request, response) {
  response.send(converter.getText(process.argv[2]));
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App is listening on http://', host, port);
});
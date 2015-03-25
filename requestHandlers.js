var converter = require('./converter');
var filePath = 'test.html';

function index(response) {
  console.log('Request handler \'index\' was called.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  converter.returnText(filePath);
  response.end('Response ended.');
}

exports.index = index;
var express = require('express');

var port = process.env.PORT || 8080;

var express = require('express');
var app = express();

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/js', express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/public'));
app.listen(port);

console.log('listening on port ' + port);

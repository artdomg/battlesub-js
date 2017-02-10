var express = require('express');
var app = express();
var gameServer = require('./server');

var port = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use('/static', express.static('static'));

app.get('/', function (req, res) {
	res.render('index');
});

var server = app.listen(port, function () {
	console.log('Battlesub app listening on port ' + port);
});

gameServer(server);

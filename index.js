var express = require('express');
var app = express();
var gameServer = require('./server');

app.set('view engine', 'pug');

app.use('/static', express.static('static'));

app.get('/', function (req, res) {
	res.render('index');
});

var server = app.listen(3000, function () {
	console.log('Battlesub app listening on port 3000...');
});

gameServer(server);

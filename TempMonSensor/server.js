'use strict';

var express = require('express');
var http = require('http');

var app = express();

//=============================================================================
// Express Route Handlers
app.get('/latest', (req, res) => {
	res.send(getRandomTemp().toString());
});

app.get('/fahrenheit', (req, res) => {
	res.send(toF(getRandomTemp()).toString());
});

app.get('/*', (req, res) => { // Catch-all (Given https://example.com/<str>, returns <str>.html)
	res.send("fail");
});

// ============================================================================
// Server Definition

http.createServer(app).listen(80, '0.0.0.0', () => {
	console.log("Running HTTP on port 80");
});

//=============================================================================
// Function Declarations
function getRandomTemp() { // Defaults to C
	if (Math.random() < 0.5) {
		return 25 + (Math.random() * 10);
	} else {
		return 25 - (Math.random() * 10);
	}
}

function toF(celcius) {
	return ((celcius / 5) * 9) + 32;
}

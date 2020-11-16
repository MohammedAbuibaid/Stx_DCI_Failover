'use strict';

var express = require('express');
var http = require('http');

var app = express();

//=============================================================================
// Express Route Handlers
app.get('/latest', (req, res) => {
	if (req.query.hasOwnProperty('unit') && req.query.unit == 'fahrenheit') {
		res.send(toF(getRandomTemp()).toString());
	} else {
		res.send(getRandomTemp().toString());
	}
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

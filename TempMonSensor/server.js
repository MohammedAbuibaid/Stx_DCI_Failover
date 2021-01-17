'use strict';

var express = require('express');
var http = require('http');

var app = express();

const { exec } = require("child_process")

const SENSOR_PATH = "/dev/sensor"
//=============================================================================
// Express Route Handlers
app.get('/', (req, res) => {
	handle(req, res);
});

app.get('/latest', (req, res) => {
	handle(req, res);
});

function handle(req, res) {
	getTemp((error, stdout, stderr) => {	
		if (error) {
			res.status(500).send("error");
		} else if (stderr) {
			res.status(500).send(stderr);
		} else {
			res.send(stdout.toString());
		}
	});

}
// ============================================================================
// Server Definition

http.createServer(app).listen(80, '0.0.0.0', () => {
	console.log("Running HTTP on port 80");
});

//=============================================================================
// Function Declarations
function getTemp(callback) { // Defaults to C
	callback(null, 20 + genTemp(-6, 6, 1), null);
}

function genTemp(min, max, skew) { // Box-Mueller Transform for generating normally-dist'd RN
	let u = 0, v = 0;
	while(u === 0) u = Math.random();
	while(v === 0) v = Math.random();
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

	num = num / 10.0 + 0.5;
	if (num > 1 || num < 0) num = getTemp(min, max, skew);
	num = Math.pow(num, skew);
	num *= max - min;
	num += min;
	return num;
}

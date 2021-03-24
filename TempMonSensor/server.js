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
			res.send((parseInt(stdout) / 1000).toString());
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
	exec(`cat ${SENSOR_PATH} | grep -A 1 "YES" | grep -oE "[0-9]{3,}"`, (error, stdout, stderr) => {
		callback(error, stdout, stderr);
	});
}

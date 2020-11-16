'use strict';

var express = require('express');
var http = require('http');
var mongo = require('mongodb');

var MongoClient = mongo.MongoClient;
var MongoURL = "mongodb://localhost:27017/";

var app = express();

app.use('/source', express.static('/app/files/source/')); // Serve static files from the /source directory
app.use(express.json());

//=============================================================================
// Express Route Handlers
app.get('/', (req, res) => {
	let limit = 10;
	
	if (req.query.hasOwnProperty('results')) {
		if (!isNaN(parseInt(req.query.results, 10)) && parseInt(req.query.results, 10) >= 1) { 
			limit = parseInt(req.query.results, 10);
		} else {
			res.status(400).send("Error: 'results' field must be a valid integer >= 1");
			return;
		}
	}

	try {
		getResults(limit).then(response => {
			if (!response) {
				res.status(500).send("Error: Database query returned no results");
				return;
			}

			response.toArray((err, results) => {
				if (err) {
					res.status(500).send(err.message);
					return;
				}
				if (req.query.hasOwnProperty('filter')) {
					if (results[0].hasOwnProperty(req.query.filter)) {
						res.send(results.filter((result) => {
							if (req.query.hasOwnProperty('value') && result[req.query.filter] == parseFloat(req.query.value)) {
								if (result[req.query.filter] == parseFloat(req.query.value)) {
									return true;
								} else {
									return false;
								}
							}

							if (req.query.hasOwnProperty('min') && result[req.query.filter] < parseFloat(req.query.min)) {
								return false;
							}
							if (req.query.hasOwnProperty('max') && result[req.query.filter] > parseFloat(req.query.max)) {
								return false;
							}
							return true
						}));
					} else {
						res.status(400).send(`Error: 'filter' field must include a valid field. Valid fields are: ${Object.keys(results[0])}`);
					}
				} else {
					res.send(results);
				}
			});
		});
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.get('/graph', (req, res) => {
	res.sendFile('/app/files/source/graph.html');
});

// ============================================================================
// Server Definition

http.createServer(app).listen(80, '0.0.0.0', () => {
	console.log("Running HTTP on port 80");
});

//=============================================================================
// Function Declarations

function filterResults(results, filter) {
	// Filter is in form ?filter=<field>&min=<value>&max=<value>&value=<value>&results=<value>
	// Sanitize the filter
	
}

async function getResults(n) {
	var db = await MongoClient.connect(MongoURL);
	var dbo = db.db("temp-mon-db");
	return await dbo.collection('temperatures').find().sort({$natural: -1}).limit(n);
}

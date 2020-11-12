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
	// Return index.html
	getLatest().then(resp => {
		try {
			resp.toArray((err, result) => {
				if (err) {
					res.send(err.message);
				}
				res.send(result);
			});
		} catch (err) {
			res.send(err.message);
		}
	});
});

app.get('/:num', (req, res) => {
	getNLatest(parseInt(req.params.num)).then(resp => {
		try {
			resp.toArray((err, result) => {
				if (err) {
					res.send(err.message);
				}
				res.send(result);
			});
		} catch (err) {
			res.send(err.message);
		}
	});
});
// ============================================================================
// Server Definition

http.createServer(app).listen(80, '0.0.0.0', () => {
	console.log("Running HTTP on port 80");
});
console.log("HERE");
//=============================================================================
// Function Declarations

function getTemperature(filter) {

}

async function getNLatest(n) {
	try {
		var db = await MongoClient.connect(MongoURL);
		var dbo = db.db("temp-mon-db");
		return await dbo.collection('temperatures').find().sort({$natural: -1}).limit(n);
 	} catch(err) {
		return err.message;
	}
	/*return new Promise((resolve, reject) => {
		MongoClient.connect(MongoURL).then((err, db) => {
			if (err) {
				resolve("HELLO");
			}
			try {
				let dbo = db.db('temp-mon-db');
				let temps = dbo.collection('temperatures').sort({$natural: -1}).limit(n);
				db.close();
			} catch {
				resolve("OK");
			}
			resolve("K");
		});
	});*/
}

async function getLatest() {
	return getNLatest(1);
}

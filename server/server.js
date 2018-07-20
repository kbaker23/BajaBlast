const express = require('express');
const http = require('http');
const validation = require('host-validation');

'use strict'

module.exports.Server = class Server{
	
	constructor(name, port){
		this.host = name;
		this.port = process.env.PORT || 5000;
		
		this.app = express();
		this.server = http.Server(this.app);
	}
	
	start(){
		this.server.listen(this.port, () => {
			console.log("Listening on http://"+this.host+":"+this.port);
		});
	}
	
	setRoutes(){
		
		
		this.app.get('/', function(req, res){
			res.status(200).send('home');
		});
		
		this.app.get('/main/create', function(req, res){
			res.status(200).sendFile('test.html', {root: __dirname});
		});
		
		this.app.get('/player/join', function(req, res){
			res.status(200).sendFile('test2.html', {root: __dirname});
		});
		
	}
}

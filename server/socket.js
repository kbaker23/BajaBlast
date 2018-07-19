const sockjs = require('sockjs');
const DB = require('../database/db.js');

'use strict'

const EVENTS = {
	'createGame': createSocketList,
	'joinGame': addSocket,
	'startGame': socketUsed
};

const SOCKET_INFO = {
	server: '',
	players: {
		
	},
	lastUpdate: ''
};


module.exports.createDatabase = async function(name){
	const db = new DB.DB(name);
	await db.login();
	return db;
}

const sockets_lst = {};
module.exports.createSocket = function(server){
	const sock = sockjs.createServer({sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js", heartbeat_delay: 25, log: function(severity, msg){
		console.log(severity, msg);
	}
	});
	sock.installHandlers(server, {prefix: '/api'});
	return sock;
}
let db = '';
module.exports.start = function(sock, dbase, callback){
	db= dbase;
	sock.on('connection', function (socket){
		setEvents(socket, callback);
	});
}
	
	
function setEvents(socket, callback){
	const sockets = []; 
	
	socket.on('data', function(e){
		try{
			const json = read(e);
			if(json === 0){
				send(socket, {event: 'error', error: true, data: {msg: 'Invalid json format.'}});
				return;
			}
			if(!(json.event && json.data)){
				send(socket, {event: 'error', error: true, data: {msg: 'Invalid data format.'}});
				return;
			}
			if(!EVENTS[json.event]){
				send(socket, {event: 'error', error: true, data: {msg: 'Invalid event.'}});
				return;
			}
			callback(json.event, json.data, (res) => {
				if(res.success){
					EVENTS[json.event](res, socket);
					send(socket, {error: false, data: res.data});
				}
				else{
					send(socket, {event: json.event, error: true, data: {msg: res.data.error}});
				}
			});
			
		}
		catch(err){
			send(socket, {error: true, data: {msg: 'An error occurred on the server.'}});
		}
	});
	socket.on('close', function(){
		removeSocketList(socket);
	});
}

function read(json){
	try{
		return JSON.parse(json);
	}
	catch(err){
		return 0;
	}
}
function send(socket, data){
	const string = JSON.stringify(data);
	socket.write(string);
}

function createSocketList(res, socket){
	const si = {
		server: socket,
		players: {},
		lastUpdate: +new Date
	};
	sockets_lst[res.data.gameid] = si;
	console.log(sockets_lst);
}

function addSocket(res, socket){
	sockets_lst[res.data.gameid].players[res.data.pid] = socket;
	send(sockets_lst[res.data.gameid].server, res.data.player.name);
	sockets_lst[res.data.gameid].lastUpdate = +new Date;
}

function socketUsed(res, socket){
	Object.keys(sockets_lst).forEach(key => {
		if(sockets_lst[key].server === socket){
			sockets_lst[key].lastUpdate = +new Date;
		}
	});
}

function updateServer(res, new_socket){
	Object.keys(sockets_lst).forEach(key => {
		if(sockets_lst[key].server === socket){
			sockets_lst[key].server = new_socket;
		}
	});
}

function updatePlayer(pid, socket){
	Object.keys(sockets_lst).forEach(key => {
		if(sockets_lst[key].server === socket){
			if(sockets_lst[key].players[pid]){
				sockets_lst[key].players[pid] = socket;
			}
		}
	});
}

function removeSocket(res, socket){
	delete sockets_lst[res.data.gameid];
}

function removeSocketList(socket){
	Object.keys(sockets_lst).forEach(key => {
		if(sockets_lst[key].server === socket){
			delete sockets_lst[key];
		}
	});
}
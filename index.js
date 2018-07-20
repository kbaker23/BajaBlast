const serv = require('./server/server.js');
const socketio = require('./server/socket.js');
const Game = require('./game-logic/game.js');


const s = new serv.Server('localhost',80);
s.setRoutes();
s.start();

( async () => {
	const db = await socketio.createDatabase('Tasks');
	const socket =  socketio.createSocket(s.server);
	
	Game.setDatabase(db);
	socketio.start(socket, db, Game.eventHandler);
})()







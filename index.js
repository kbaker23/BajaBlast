const serv = require('./server/server.js');
const socketio = require('./server/socket.js');
const Game = require('./game-logic/game.js');
const DB = require('./database/db.js');

( async () => {
	const s = new serv.Server('localhost',80);
	s.start();

	const db = new DB.DB('Tasks');
	await db.login();

	const socket =  socketio.createSocket(s.server);

	Game.setDatabase(db);
	socketio.start(socket, db, Game.eventHandler);
})();

const Tasks = require('./tasks.js');
'use strict';

const P_REG = '@';
const W_REG = '*';

const EVENTS = {
	'createGame': createGame,
	'joinGame': joinGame,
	'startGame': startGame
}

const GAMES = {};

const ID_VALS = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M','1','2','3','4','5','6','7','8','9','0','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m','!','@','#','$','%','&','*','?','+','=','-'];

/**
* Generates a random id for a game.
* @return string - Game ID
*/
function genId(){
	let id = '';
	for(let i = 0; i < 6; i++){
		id += ID_VALS[Math.floor(Math.random() * ID_VALS.length)];
	}
	return id;
}

class Game{
	
	constructor(){
		
	}
	
	/**
	* creates a new game given an already created game data or a game name and 
	* settings for the game.
	* @param game - JSON - Game data of previously created game. False if creating
			a new game.
				-name: name of game
				-settings: settings for the game
				-gameid: Game ID
				-players: Players in the game
	* @param name - String - Name for the game
	* @param settings - JSON - Settings for the game.
				-tasksPerLevel: The number of tasks per level
				-size: The max number of players in the game
	*/
	newGame(game, name, settings){
		this.start = false;
		if(game){
			this.name = game.name;
			this.settings = game.settings;
			this.gameid = game.gameid;
			this.players = game.players;
		}
		else{
			this.name = name;
			this.settings = settings;
			this.players = [];
			this.gameid = genId();
			while(GAMES[this.gameid]){
				this.gameid = genId();
			}
			GAMES[this.gameid] = {
				name: this.name,
				settings: this.settings,
				players: this.players,
				gameid: this.gameid,
				addPlayer: this.addPlayer,
				removePlayer: this.removePlayer
			};
		}
	}
	
	/**
	* Adds a player to the game
	* @param player - JSON - The player to add
				-name: The player's name
	*/
	addPlayer(player){
		this.players.push(player);
		GAMES[this.gameid].players = this.players;
	}
	
	/**
	* Removes a player from the game.
	* @param player - JSON - The player to removeAttribute
			-name: The player's name
	*/
	removePlayer(player){
		this.players = this.players.filter( (p) => {
			return player !== p;
		});
	}
}

let db = '';
/**
* Sets the database instance.
* @param dbase - MongoDB promise - The MongoDB promise for tasks.
*/
module.exports.setDatabase = function(dbase){
	db = dbase;
}

/**
* Handles the different event calls to the server for the game.
* @param event - String - The event
* @param data - JSON - The data for the event
* @param callback - Function - The callback to the server to send back to client
*/
module.exports.eventHandler = function(event, data, callback){
	if(event === 'startGame'){
		Promise.resolve(EVENTS[event](data)).then( res => {
			callback(res);
		});
		
	}
	else{
		callback(EVENTS[event](data));
	}
}

/**
* Sets up a success return JSON 
* @param data - JSON - The data to be returned
* @return JSON - The return data
		-data: the data to be returned
		-success: true
*/
function succ(data){
	return {data: data, success: true};
}

/**
* Sets up an error return JSON
* @param msg - String - The error message
* @return JSON - The return error message
		-data: 
			-error: the error message
		-success: false
*/
function error(msg){
	return {data: {error: msg}, success: false};
}


/**
* Event to create a game.
* @param data - JSON - The game data to create a new game.
* @return JSON - Returns the result of creating a game.
*/
function createGame(data){
	
	try{
		if(!data['name'] || !data['settings']){
			return error('Invalid data format');
		}
		const game = new Game();
		game.newGame(false, data.name, data.settings);
		return succ({gameid: game.gameid});
	}
	catch(err){
		return error('Unable to create the game.');
	}
}

/**
* Event to join a game.
* @param data - JSON - The data to join a game. Needs the gameid for the game and 
		player information
* @return JSON - Returns the result of joining a game
*/
function joinGame(data){
	try{
		if(!data['gameid'] || !data['player']){
			return error('Invalid data format.');
		}
		if(!data.player['name']){
			return error('Invalid player format.');
		}
		const game_data = GAMES[data.gameid];
		if(game_data){
			if(game_data['start']){
				return error('Game already started.');
			}
			const game = new Game();
			game.newGame(game_data, '', '');
			game_data.addPlayer.bind(game)(data.player);
			return succ({gameid: game.gameid, pid: game_data.players.length, player:{name: data.player.name}});
		}
		else{
			return error('Game does not exist.');
		}
	}
	catch(err){
		return error('Unable to join game.');
	}
}

/**
* Event to start and select all tasks for the game.
* @param data - JSON - The data to start a game. Need gameid for the game.
* @return JSON - Returns the list of tasks for the game.
*/
function startGame(data){
	try{
		if(!data || !data['gameid']){
			return error('Invalid data format.');
		}
		
		const game_data = GAMES[data.gameid];
		if(!game_data){
			return error('Invalid game id.');
		}
		if(!game_data.players || game_data.players.length === 0){
			return error('No players have joined the game.');
		}
		
		if(game_data){
			if(game_data['start']){
				return error('Game already started.');
			}
			if(!(game_data['settings'] && game_data.settings['tasksPerLevel'])){
				return error('Invalid game settings format.');
			}
			
			const start = new Date();
			const tasks_prom = Tasks.getTasks(db, game_data);			
			
			return tasks_prom.then(res => {
				GAMES[data.gameid]['start'] = true;
				const end = new Date();
				const dif = end - start;
				console.log(dif);
				return res;
			})
			.catch(err=> {
				return error('Error retrieving tasks.');
			});
			
		}
		else{
			return error('Game does not exist.');
		}		
	}
	catch(err){
		return error('Unable to start game');
	}
}

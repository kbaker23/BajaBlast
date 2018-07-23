
'use strict';

const P_REG = '@';
const W_REG = '*';

const EVENTS = {
	'createGame': createGame,
	'joinGame': joinGame,
	'startGame': startGame
}

const LEVEL = {
	'first': 0,
	'second': 1,
	'third': 2,
	'fourth': 3,
	'end': 4,
	'any': -1
}

const GAMES = {};

const ID_VALS = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M','1','2','3','4','5','6','7','8','9','0','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m','!','@','#','$','%','&','*','?','+','=','-'];
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
	
	addPlayer(player){
		this.players.push(player);
		GAMES[this.gameid].players = this.players;
	}
	
	removePlayer(player){
		this.players = this.players.filter( (p) => {
			return player !== p;
		});
	}
}

let db = '';
module.exports.setDatabase = function(dbase){
	db = dbase;
}

module.exports.eventHandler = function(event, data, callback){
	if(event === 'startGame'){
		EVENTS[event](data).then(res => {
			callback(res);
		});
	}
	else{
		callback(EVENTS[event](data));
	}
}

function succ(data){
	return {data: data, success: true};
}

function error(msg){
	return {data: {error: msg}, success: false};
}

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

function startGame(data){
	try{
		const tasks_prom = getTasks();
		return tasks_prom.then(res => {
			if(res === 0){
				return error('Error reading from database.');
			}
			if(!data['gameid']){
				return error('Invalid data format.');
			}
			const game_data = GAMES[data.gameid];
			if(game_data){
				if(game_data['start']){
					return error('Game already started.');
				}
				if(!(game_data['settings'] && game_data.settings['tasksPerLevel'])){
					return error('Invalid game settings format');
				}
				const tpl = game_data.settings.tasksPerLevel;
				const first = selectTasks(res.first, tpl);
				const second = selectTasks(res.second, tpl);
				const third = selectTasks(res.third, tpl);
				const fourth = selectTasks(res.fourth, tpl);
				const end = selectTasks(res.end, tpl);
				const any = selectTasks(res.any, tpl);
								
				GAMES[data.gameid]['start'] = true;
				return succ({
					gameid: game_data.gameid,
					players: game_data.players,
					first: first,
					second: second,
					third: third,
					fourth: fourth,
					end: end,
					any: any
				});
			}
			else{
				return error('Game does not exist.');
			}
		}).catch(err =>{
			console.log(err);
			return error('Error starting game.');
		});
	}
	catch(err){
		return error('Unable to start game');
	}
}

function getTasks(){
	const tasks = {};
	const error = {};
		
	return db.getCol('first')
	.then(res => {
		tasks['first'] = res;	
		return db.getCol('second');
	})
	.then(res => {
		tasks['second'] = res;
		return db.getCol('third');
	})
	.then(res => {
		tasks['third'] = res;
		return db.getCol('fourth');
	})
	.then(res => {
		tasks['fourth'] = res;
		return db.getCol('end');
	})
	.then(res => {
		tasks['end'] = res;
		return db.getCol('any');
	})
	.then(res => {
		tasks['any'] = res;
		return tasks;
	})
	.catch(err => {
		return 0;
	});
	
}

function selectTasks(tasks, tpl, players){
	const select = [];
	
	const s = Math.min(tasks.length, tpl);
	for(let i=0; i< s; i++){
		const rand = Math.floor(Math.random() * tasks.length);
		const task = tasks[rand];
		task.Level = LEVEL[task.Level];
		const t = selectWildcards(task);
		if(t){
			task.Task = t;
		}
		const twist = selectTwist(task.Twist);
		if(twist){
			task.Twist = twist;
		}
		task.Drinks = selectDrinks(task.Drinks);
		
		select.push(task);
		tasks.splice(rand, 1);
	}
	return select;
}

function selectWildcards(task){
	if(!task['Wildcard']) return;
	
	const wc = task.Wildcard.split(',');
	const desc = task.Task;
	const new_wc = wc[ Math.floor(Math.random() * wc.length)];
	return desc.replace(/\*/g,  new_wc);
}

function selectTwist(twist){
	if(!twist) return;
	
	const twists = twist.split(',');
	return twists[Math.floor(Math.random() * twists.length);
	
	
}

function selectDrinks(drinks){
	if(!drinks) return 1;
	
	const d = drinks.split(',');
	return d[Math.floor(Math.random() * d.length)];
	
}





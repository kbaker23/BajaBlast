'use strict';

const LEVEL = {
	'first': 0,
	'second': 1,
	'third': 2,
	'fourth': 3,
	'end': 4,
	'any': -1
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
* Gets all tasks for the game.
* @param db - MongoDB promise - The MongoDB promise for tasks
* @param game_data - JSON - Information about the game including gameid
		players, game settings.
* @return Promise - A promise resolving to a JSON containing all the tasks
		or a JSON containing an error message
*/
module.exports.getTasks = function(db, game_data){
	const tasks_prom = retrieveTasks(db);
	return tasks_prom.then(res => {
		if(res === 0){
			return error("Error reading from database.");
		}
		
		const tpl = game_data.settings.tasksPerLevel;
		const tasks = select(game_data, res, tpl);
		
		return succ({
			gameid:game_data.gameid,
			players: game_data.players,
			first: tasks.first,
			second: tasks.second,
			third: tasks.third,
			fourth: tasks.fourth,
			end: tasks.end,
			any: tasks.any
		});
		
	})
	.catch(err => {
		console.log(err);
		return error("Error starting game.");
	});
	
}

/**
* Retrieves all tasks from the database.
* @param db - MongoDB Promise - The database promise for tasks
* @return JSON - All tasks grouped by level name
*/
function retrieveTasks(db){
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

/**
* Selects tasks from each level.
* @param game_data - JSON - The game information like players 
		and game settings
* @param res - JSON - The list of tasks in the database
* @param tpl - int - The tasks per level
*/
function select(game_data, res, tpl){
	const tasks = {};
	tasks['first'] = selectTasks(res.first, tpl, game_data.players, 0%game_data.players.length);
	tasks['second'] = selectTasks(res.second, tpl, game_data.players, 1%game_data.players.length);
	tasks['third'] = selectTasks(res.third, tpl, game_data.players, 2%game_data.players.length);
	tasks['fourth'] = selectTasks(res.fourth, tpl, game_data.players, 3%game_data.players.length);
	tasks['end'] = selectTasks(res.end, tpl, game_data.players, 4%game_data.players.length);
	tasks['any'] = selectTasks(res.any, tpl, game_data.players, 5%game_data.players.length);
	
	return tasks;
}

/**
* Selects random tasks from a specific level. Determines wildcards, 
	drinks, and players involved
* @param tasks - JSON - List of all tasks in specific level
* @param tpl - int - Tasks per level
* @param players - Array - List of players in the game
* @param cur - int - The starting player index
*/
function selectTasks(tasks, tpl, players, cur){
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
		console.log(players);
		task.Task = selectPlayers(task.Task, players, cur);
		
		select.push(task);
		tasks.splice(rand, 1);
		
		cur++;
		if(cur >= players.length){
			cur = 0;
		}
	}
	return select;
}

/**
* Selects players to be involved in the task. Selects current 
	player and random players
* @param task - String - The task description
* @param players - Array - The list of players in the game
* @param cur_player - int - The current player
* @return String - The task description with player names inserted
*/
function selectPlayers(task, players, cur_player){
	if(!players || !players.length || !task) return task;
	
	if(players.length <= 0){
		return task;		
	}
	
	let temp = players.slice(0);
	
	const single = task.match(/@[^\d]{1}|@$/g);
	const spec = task.match(/@[\d]{1}/g);
	if(!single || single.length === 0){
		if(!spec) return task;
		const p = [temp[cur_player]];
		temp.splice(cur_player, 1);
		task = task.replace(/@1/, p[0]);
		let count = 1;
		while(count < spec.length){
			const rand = Math.floor(Math.random() * temp.length);
			task = task.replace(new RegExp('@'+(++count)), temp[rand].name);
			temp.splice(rand, 1);
			count++;
		}
	}
	else{
		let count = 0;
		for(let i=cur_player; count<single.length; i++){
			if(i >= players.length ){
				i=-1;
				continue;
			}
			
			if(i===cur_player){
				task = task.replace(/@/, temp[i].name);
				temp.splice(i,1);
			}
			else{
				const rand = Math.floor(Math.random() * temp.length);
				task = task.replace(/@/, temp[rand].name);
				temp.splice(rand, 1);
			}
			
			count++;
			
			if(i === cur_player - 1) break;
		}
		
		
	}
	return task;
}

/**
* Selects a random wildcard for the task
* @param task - JSON - The task to get wildcard
* @return String - The new task description or the old task description
*/
function selectWildcards(task){
	if(!task['Wildcard']) return task.Task;
	
	const wc = task.Wildcard.split(',');
	const desc = task.Task;
	const new_wc = wc[ Math.floor(Math.random() * wc.length)];
	return desc.replace(/\*/g,  new_wc);
}

/**
* Selects a random twist for task
* @param twist - String - The list of twists
* @return String - The selected twist
*/
function selectTwist(twist){
	if(!twist) return;
	
	const twists = twist.split('/');
	return twists[Math.floor(Math.random() * twists.length)];
	
	
}

/**
* Selects the number of drinks for the task
* @param drinks - Sting - List of possible number of drinks
* @return A random drink number or "1" as default.
*/
function selectDrinks(drinks){
	if(!drinks) return "1";
	if(isNaN(drinks)) return "1";
	if(!drinks.split) return "1";
	
	const d = drinks.split(',');
	return d[Math.floor(Math.random() * d.length)];
	
}

/**
Usage:
	Main function:
		Race.race => function to get times for each player
	
	Helper functions:
		Race.get_possible => function to get an increment for the race 
							times
	
		Race.possible => recursive function to get all possible ways to 
						add to given time
*/

const Race = {
	num_checkpoints: 0,
	
	/**
		The main function to determine race intervals.
		Takes a time for the winner of the race, the total number of 
		players and the number of intervals desired in the race.
		
		@version 1.0 - 
			Notes: Does not include a CPU horse
			Notes: Does not strategically create an exciting race. Race 
					based entirely off of random variables
		
		@param time - The winning time
		@param num_players - The total number of players
		@param num_checkpoints - The total number of intervals
									
		@return JSON - 
					error: The error message,
					res: Array of Arrays => 		
							Array with size num_players containing Array
							with size num_checkpoints
	*/
	race: function(time, num_players, num_checkpoints){
		if(time <= 0){
			return {error: 'The time is too small. Must be > 0'};
		}
		if(time <= num_checkpoints){
			return {error: 'There are too many intervals for given time. Intervals < time'};
		}
		
		if(num_players <= 0){
			return {error: 'There must be more players in the race.'};
		}
		
		if(num_checkpoints <= 0){
			return {error: 'There must be more intervals for the race.'};
		}
		
		
		Race.num_checkpoints = num_checkpoints;
		const winner = Math.floor(Math.random() * num_players);
		let results = new Array(num_players);
		
		for(let i = 0; i< num_players; i++){
			const res = [];
			if(i === winner){
				const inc = Race.get_possible(time);
				res.push(inc[0]);
				for(let j = 1; j<inc.length; j++){
					const val = res[j-1] + inc[j];
					res.push(val);
				}
			}
			else{
				const end = Math.floor(Math.random()* 5 + time + 1);
				const inc = Race.get_possible(end);
				res.push(inc[0]);
				for(let j = 1; j<inc.length; j++){
					const val = res[j-1] + inc[j];
					res.push(val);
				}
			}
			results[i] = res;
		}
		
		return results;
	}, 
	get_possible: function(time){
		if(Race.num_checkpoints <= 0){
			return [];
		}
		
		let list = [];
		const opts = [];
		Race.possible(opts, 0, time, time, list);
		const rand = Math.floor(Math.random() * list.length);
		return list[rand];
	},
	possible: function(opts, idx, n, reduced, list){
		if(Race.num_checkpoints <= 0){
			return;
		}
		
		if(reduced < 0){
			return -1;
		}
		
		if(reduced === 0 && idx === Race.num_checkpoints){
			
			let s=[];
			let i =0;
			let temp = opts.slice(0, idx);
			while(i < idx){
				const rand = Math.floor(Math.random() * (idx-i));
				s.push(temp[rand]);
				temp.splice(rand, 1);
				i++;
			}
			
			return s;
		}
		
		let prev = 1;
		if(idx !== 0){
			prev = opts[idx - 1];
		}
		

		for(let i = prev; i<=n; i++){
			opts[idx] = i;
			const ans = Race.possible(opts, idx+1, n, reduced - i, list);
			if(ans && ans !== -1){
				list.push(ans);			
			}
		}
	}
};


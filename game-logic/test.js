const sockjs = require('sockjs-client');
const sock = sockjs('http://localhost:5000/api');

sock.onopen = function(){
	const to_send = JSON.stringify({event: 'createGame', data: {name: 'game', settings: {tasksPerLevel: 10, size: 5}}});
	sock.send(to_send);
	
}

let join = true;
let start = true;
sock.onmessage = function(msg){
	const data = JSON.parse(msg.data);
	if(data && data.error){
		console.log(data.error);
	}
	else if(data && data.data && data.data.gameid){
		if(join){
			sock.send(JSON.stringify({event: 'joinGame', data: {gameid: data.data.gameid, player: {name: 'Jake'}}}));
			join = false;
		}
		else if(start){
			sock.send(JSON.stringify({event: 'startGame', data: {gameid: data.data.gameid}}));
			start = false;
		}
		else{
			check_data(data.data.first);
			check_data(data.data.second);
			check_data(data.data.third);
			check_data(data.data.fourth);
		}
	}
	
	
	
}

sock.onerror = (e) => {
	console.log(e);
}


function check_data(data){
	for(let i=0; i<data.length; i++){
		const task = data[i].Task;
		for(let j=i+1; j<data.length; j++){
			if(task === data[j].Task){
				console.log("Duplicate");
				return;
			}
		}		
	}
	console.log("No duplicates");
}
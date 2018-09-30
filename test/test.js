const sockjs = require('sockjs-client');

let start = 0;
let end = 0;
let done = 0;

(function main(){
  let num_clients = 25;
  if(process && process.argv && process.argv.length === 3){
    num_clients = process.argv[2];
  }
  start = new Date();
  test(num_clients);

})();

function test(num){
  console.log(num);
  const players = ['Kellan', 'Jake', 'Nelson', 'Ptore', 'Joe', 'Bob', 'Billy', 'Will', 'Pat', 'Sue', 'Lue', 'Hue', 'Jim', 'Pam', 'Hank'];
  const games = {};
  const joinStats = {};
  const createStats = {
    end: []
  };
  const startStats = {};
  const sock = sockjs('http://localhost:5000/api');
  sock.onopen = function(){
    const to_send = JSON.stringify({event: 'createGame', data: {name: 'game', settings: {tasksPerLevel: 10, size: 5}}});
    for(let i=0; i<num; i++){
      createStats[i] = {
        start: new Date(),
      };
      sock.send(to_send);
    }
  }
  sock.onmessage = function(data){
    const json = JSON.parse(data.data);
    if(json.error){
      console.log(json.data.msg);
    }
    else if(json.event === 'createGame'){
      createStats['end'].push(new Date());
      joinStats[json.data.gameid] = {
        start: new Date(),
        end: 0
      }
      let to_send = JSON.stringify({event: 'joinGame', data: {gameid: json.data.gameid, player: {name: 'Jake'}}});
      sock.send(to_send);
      to_send = JSON.stringify({event: 'joinGame', data: {gameid: json.data.gameid, player: {name: 'Kellan'}}});
      sock.send(to_send);
      to_send = JSON.stringify({event: 'joinGame', data: {gameid: json.data.gameid, player: {name: 'Ptore'}}});
      sock.send(to_send);
      to_send = JSON.stringify({event: 'joinGame', data: {gameid: json.data.gameid, player: {name: 'Nelson'}}});
      sock.send(to_send);

    }
    else if(json.event === 'joinGame'){
      if(games[json.data.gameid] >= 3){
        joinStats[json.data.gameid]['end'] = new Date();
        startStats[json.data.gameid] = {
          start: new Date(),
          end: 0
        }
        const to_send = JSON.stringify({event: 'startGame', data: {gameid: json.data.gameid}});
        sock.send(to_send);
      }
      else{
        if(games[json.data.gameid]){
          games[json.data.gameid]++;
        }
        else{
          games[json.data.gameid] = 1;
        }
      }
    }
    else if(json.event === 'startGame'){
      startStats[json.data.gameid]['end'] = new Date();
      done++;
      if(done >= num){
        end = new Date();
        console.log("Total time: ", (end - start) / 1000);
        computeStats(createStats, joinStats, startStats);
        sock.close();
      }
    }
    else{
    }
  }
  sock.onerror = function(e){
    console.log(e);
  }
  sock.onclose = function(){
    console.log('closed');
  }

}

function computeStats(create, join, start){
  console.log('------------------');
  console.log('JOIN:');
  console.log('------------------');
  computeJoin(join);

  console.log('------------------');
  console.log('START:');
  console.log("------------------");
  computeStart(start);
}

function computeJoin(stats){
  computeStart(stats);
}

function computeStart(stats){
  let min = stats[Object.keys(stats)[0]].end - stats[Object.keys(stats)[0]].start;
  let max = 0;
  let sum = 0;

  for(let stat in stats){
    const start = stats[stat].start;
    const end = stats[stat].end;
    const time = end - start;
    if(time > max){
      max = time;
    }
    if(time < min){
      min = time;
    }
    sum+=time;
  }
  const avg = sum / Object.keys(stats).length;

  const output = "Min time: "+ min + "\n"
                +"Max time: "+ max + '\n'
                +"Avg time: "+ avg + '\n';
  console.log(output);
}

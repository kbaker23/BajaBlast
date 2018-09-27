/*
  TODO:
    -Instructions for the game
    -Proper scaling for holes, names, and mole
    -Display which player is the mole
    -Insert timer/ progress bar
    -Add art stuff instead of my shitty art
*/

const WhackAShots = function(game){
	this.game = game;
	this.graphics = null;
	
	this.time = 0;
	this.timer = null;
	this.game_time = Phaser.Timer.MINUTE * 1;
	this.endEvent = null;
	
	this.started = false;
	
	this.board = {};
	
	this.mole = null;
	
	this.order = [];
	
  //*************************************************
  //*************************************************
  //Set this.players to array containing player names as strings
	this.players = players;
  //*************************************************
  //*************************************************
  
	this.probs = [0.1, 0.3, 0.6, 1.0];
	this.game_len = Math.floor(Math.random() * this.players.length + (this.players.length * 4));
	
	const rand = Math.floor(Math.random() * this.players.length);
	this.player_mole = this.players[rand];
	this.players.splice(rand, 1);
	
	this.mole_hidden = Math.random() * 3000 + 1000;
	this.mole_appear = Math.random()* 1000 + 500;
}

WhackAShots.prototype = WhackAShots.prototype.constructor = WhackAShots;

WhackAShots.prototype = {
//**********************************
//Probably will have to change this to work with your game
	preload: function(){
		this.game.stage.backgroundColor = "0x4488aa";
		this.graphics = this.game.add.graphics(0,0);
		
		this.time = this.game.time.now;
		
		this.game.load.image('mole', 'sprites/mole.png');
	},
	create: function(){
		this.createOrder();
		this.createBoard();
		this.createTimer();
		this.timer.start();
		this.started = true;
		
	},
	update: function(){
		if(this.started){
			const time = this.game.time.now;
			
			if(time - this.time > this.mole_appear){
				if(this.mole)this.mole.visible = false;
			}
			if(time - this.time > this.mole_hidden + this.mole_appear){
				this.moveMole();
				this.time = this.game.time.now;
				
				this.mole_hidden = Math.random() * 3000 + 1000;
				this.mole_appear = Math.random() * 1000 + 500;
			}
			
		}
	},
	destroy: function(){
		
	},
	createOrder: function(){
		const q_size = 4;
		let rest = [], queue = [];
		if(this.players.length >= q_size){
			queue = this.players.slice(0, q_size);
			rest = this.players.slice(q_size, q_size + (this.players.length - q_size));
		}
		for(let i=0; i<this.game_len; i++){
			const rand = Math.random();
			if(this.players.length < q_size){
				const player = this.players[Math.floor(rand * this.players.length)];
				this.order.push(player);
			}
			else{
				console.log(queue, rest);
				for(let k=0; k<this.probs.length; k++){
					if(rand <= this.probs[k]){
						const player = queue[k];
						this.order.push(player);
						
						queue.splice(k, 1);
						rest.push(player);
						queue.unshift(rest[0]);
						rest.splice(0 ,1);
						break;
					}
				}
			}
		}
	},
  //***********************************************
  //This is where I draw circles for holes and put player names
  //I tried scaling it as best I could
	createBoard: function(){
    //Where the top left of board should be
		const startPosY = this.game.scale.height/4;
		const startPosX = this.game.scale.width/4;
		const size = (startPosX * startPosY) / 200;
		const margin = size/10;
		const fontSize = margin*2;
		const font = {
			font: 'bold ' +fontSize+ 'px Arial',
			fill: '#0f0',
			boundsAlignH: 'center',
			boundsAlignV: 'middle'
		};
		
		let x = startPosX;
		let y = startPosY;
    //Loop through all players minus the mole and insert hole, name under hole
		for(let i=0; i<this.players.length; i++){
			this.graphics.beginFill("0x000000");
			this.graphics.drawCircle(x, y, size);
			const txt = this.game.add.text(0, 0, this.players[i], font);
			txt.setTextBounds(x, y + size/2 + fontSize/2, 0, 0);
			txt.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			
			this.board[this.players[i]] = {
				x: x,
				y: y,
				size: size
			};
			
			if(i > 0 && i%3 === 0){
				x = startPosX;
				y += size + margin + margin;
			}
			else{
				x += size + margin;
			}
		}
	},
	createTimer: function(){
		this.timer = this.game.time.create();
		this.endEvent = this.timer.add(this.game_time, this.gameOver, this);
		
	},
	moveMole: function(){
		if(this.order.length <= 0){
			return;
		}
		
		const player = this.order[0];
		this.order.shift();
		const player_info = this.board[player];
		
		if(this.mole){
      //Move mole to fit in hole
			this.mole.visible = true;
			this.mole.x = player_info.x - player_info.size/2 * .8;
			this.mole.y = player_info.y - player_info.size/2 * .8;
		}
		else{	
      //Insert mole and scale mole to fit in hole
			this.mole = this.game.add.sprite(player_info.x - player_info.size/2 * .8, player_info.y - player_info.size/2 * .8, 'mole');
			this.mole.width = player_info.size * .8;
			this.mole.height = player_info.size * .8;
		}
	},
	gameOver: function(){
		//TODO When the game ends
	}
};

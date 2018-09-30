const config = {
	type: Phaser.Auto,
	width: 500,
	height: 500,
	backgroundColor: '#aae125',
	scene: {
		preload: preload,
		create: create,
		update: update
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: false
		}
	}
};


const game = new Phaser.Game(config);

function preload(){
	this.load.image('frantic-wave1', 'assets/frantic-wave1.png');
	this.load.image('frantic-wave2', 'assets/frantic-wave2.png');
	this.load.image('frantic-wave3', 'assets/frantic-wave3.png');
	this.load.image('frantic-wave4', 'assets/frantic-wave4.png');
}

function create(){
	
	
	this.anims.create({
		key: 'go',
		frames: [
			{key: 'frantic-wave1'},
			{key: 'frantic-wave2'},
			{key: 'frantic-wave3'},
			{key: 'frantic-wave4'}
		],
		frameRate: 10,
		repeat: -1
	});
	
	console.log(this);
	this.add.sprite(100, 200, 'frantic-wave1').play('go');
	
	
	
}

function update(){
	
}
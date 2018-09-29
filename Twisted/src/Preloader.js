"use strict";

//UI
var title_txt = null;
var loading_txt = null;
var consent_txt = null;
var playButton = null;

BasicGame.Preloader = function (game) {
	this.ready = false;
};

BasicGame.Preloader.prototype = {

	preload: function () {
        
        //Consent text
        var consentString = "Please drink responsibly. By continuing, you agree that\nyou are responsible for any consequences that may result from playing\nTwisted and that everyone in your party is over 21 years of age.";
        consent_txt = this.game.add.text(this.world.centerX, this.world.height * 0.45, consentString, {font:gm.font, fill:"#000000"});
        setText(consent_txt, 80, '#FFFFFF', 'center');
        
        
        //Loading
        loading_txt = this.game.add.text(this.world.centerX, this.world.height * 0.675, "Loading...", {font:gm.font, fill:"#000000"});
        setText(loading_txt, 100, '#FFFFFF', 'center');
        
        //Play button
        playButton = this.add.button(this.world.centerX, this.world.height * 0.675, 'whiteButton', playGame, this);
        playButton.text = this.game.add.text(this.world.centerX, playButton.y, "Ok", {font:gm.font, fill:"#FFFFFF"});
        setButton(playButton, playButton.text, 140, null);
        playButton.visible = false;
        playButton.text.visible = false;
        addButtonBounceTween(playButton, playButton.text);
        
        
        //Load Assets
        
        //Sound
        for (var i = 0; i < music.length; i++) {
            for (var x = 0; x < music[i].length; x++) {
                this.load.audio(music[i][x], 'assets/Sound/LevelMusic/' + music[i][x] + '.m4a');
            }
        }
        this.load.audio('level1', 'assets/Sound/level1.mp3');
        this.load.audio('level2', 'assets/Sound/level2.mp3');
        this.load.audio('level3', 'assets/Sound/level3.mp3');
        this.load.audio('level4', 'assets/Sound/level4.mp3');
        this.load.audio('angels', 'assets/Sound/angels.mp3');
        this.load.audio('stinger1', 'assets/Sound/stinger1.mp3');
        this.load.audio('bossIntro', 'assets/Sound/bossIntro.mp3');
        
        //Add universal sounds
        sfx.buttonClick = this.add.audio('buttonClick');
        sfx.whoosh = this.add.audio('whoosh');
        
        //Bosses
        this.load.image('lime', 'assets/Bosses/lime.png');
        this.load.image('finishLine', 'assets/Bosses/finishLine.png');
        this.load.image('beer1', 'assets/Bosses/beer1.png');
        this.load.image('beer2', 'assets/Bosses/beer2.png');
        this.load.image('beer3', 'assets/Bosses/beer3.png');
        
        
        //UI
        this.load.image('black', 'assets/black.png');
        this.load.image('redButton', 'assets/UI/redButton.png');
        this.load.image('logo', 'assets/UI/logo.png');
        this.load.spritesheet('mute', 'assets/UI/mute.png', 400, 366);
        this.load.image('heart', 'assets/UI/heart.png');
        this.load.image('delete', 'assets/UI/delete.png');
        
        
        //Particles
        this.load.image('bubble', 'assets/Particles/bubble.png');
	},

	create: function () {
        
        //Add sounds
        sfx.stinger1 = this.add.audio('stinger1');
        sfx.bossIntro = this.add.audio('bossIntro');
        
        //Music Sources
        //Sound
        for (var i = 0; i < music.length; i++) {
            for (var x = 0; x < music[i].length; x++) {
                musicSources[i].push(thisGame.add.audio(music[i][x]));
            }
        }

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//this.preloadBar.cropEnabled = false;
	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.ready == false)
		{
			this.ready = true;
            playButton.visible = true;
            playButton.text.visible = true;
            loading_txt.visible = false;
		}

	}

};

function playGame() {
    thisGame.state.start('Gameplay');
    sfx.buttonClick.play();
}

BasicGame = {
    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    thisGame: null,
    initOriented: false
};

BasicGame.Boot = function (game) {
    thisGame = game;
};

BasicGame.Boot.prototype = {

    init: function () {

        //Init for game scaling
        BasicGame.initOriented = false;
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.stage.backgroundColor = gm.fontColor1;
        document.getElementById("gameBody").style.backgroundColor = gm.fontColor1;
        
        //Plugins
        this.add.plugin(PhaserInput.Plugin);

        //Set scaling for multiple devices
        if (this.game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(gm.gameWidth / 4, gm.gameHeight / 4, gm.gameWidth, gm.gameHeight);
            this.scale.setResizeCallback(this.gameResized, this);
            this.game.scale.refresh();
        }
        else if (!this.game.device.desktop)
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(gm.gameWidth / 4, gm.gameHeight / 4, gm.gameWidth, gm.gameHeight);
            this.scale.forceOrientation(true, false);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            this.game.scale.refresh();
        }
        

    },

    preload: function () {
        //Load preload graphics
        this.load.image('whiteButton', 'assets/UI/whiteButton.png');
        
        //Music
        this.load.audio('mainMenu', 'assets/Sound/mainMenu.m4a');
        
        //Sound
        this.load.audio('buttonClick', 'assets/Sound/buttonClick.wav');
        this.load.audio('whoosh', 'assets/Sound/whoosh.wav');
        
        //Loading
        this.load.spritesheet('loadingSwirl', 'assets/UI/loadingSwirl.png', 64, 64);
        
        //Custom text hack
        this.game.add.text(-200, -200, "hack", {font: gm.font, fill:"#FFFFFF"});
        this.game.add.text(-200, -200, "hack", {font: gm.fontTwisted, fill:"#FFFFFF"});
        
    },

    create: function () {
        
        this.state.start('Preloader');

    },

    gameResized: function (width, height) {
        //  Note that this callback is only really useful if you use a ScaleMode of RESIZE and place it inside your main game state.
    },

    enterIncorrectOrientation: function () {

        gm.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        gm.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }

};

"use strict";

//Logic
var gameState = "";
var score = 0;
var paused = false;

//Player
var player = null;

//UI
//Main
var black = null;
var title_txt = null;
var newGameButton = null;
var loadingSwirl = null;
var muteButton = null;
//Add players
var addPlayersTitle = null;
var addPlayersDoneButton = null;
var addPlayerInstructions = null;
var addPlayerButton = null;
var addedPlayers = [];
//Level Transitions
var level_txt = null;
var untilEndGame_txt = null;
//Gameplay
var round_txt = null;
var task_txt = null;
var twist_txt = null;
var twistButton = null;
var skipButton = null;
var drink_txt = null;
var rollingLime = null;
var hearts = null;
//Bosses
var boss = null;

//Audio


//Input
var cursors = null;
var gamepad = null;
var joystick = null;

BasicGame.Gameplay = function (game) {
    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
};

BasicGame.Gameplay.prototype = {

	create: function () {
        
        //Logic
        gm.gotNewGameData = false;
        
        //Audio
        //Play Music
        gm.music = this.add.audio('mainMenu');
        gm.music.loopFull(1);
        gm.music.volume = 0.7;
        
        //Physics
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        
        //Groups
        /*questionPickups = this.add.group();
        for (var i = 0; i < level1Questions.length; i++) {
            var newPickup = this.add.sprite(level1Questions[i].x * (map.width / ogMapWidth), level1Questions[i].y * (map.height / ogMapHeight), 'level1Question');
            newPickup.scale.setTo(this.world.width / 3000);
            newPickup.y -= map.width * 0.02;
            newPickup.x += map.height * 0.02;
            newPickup.anchor.setTo(0, 1);
            questionPickups.add(newPickup);
        }*/
        
        
        
        //Player
        /*player = this.add.sprite(this.world.centerX, this.world.centerY - (map.height / 11), 'player');
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(gm.scaleHorizontal);
        this.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.bounce.set(0.05);*/
        
        //UI
        //Main Menu
        title_txt = this.add.sprite(this.world.centerX, -400, "logo");
        title_txt.anchor.setTo(0.5);
        title_txt.scale.setTo(1 * gm.scaleHorizontal);
        dropBounceTween(title_txt, this.world.height * 0.35, 500).onComplete.add(
            function e() {
                sfx.whoosh.play();
                textBounceTween(title_txt);
                twistTween(title_txt, 15, 3000);
            },
            thisGame
        );
        //Play button
        newGameButton = this.add.button(this.world.centerX, this.world.centerY + (this.world.height * 0.25), 'whiteButton', newGame, this);
        newGameButton.text = this.game.add.text(newGameButton.x, newGameButton.y, "New Game", {font:gm.font, fill:"#FFFFFF"});
        setButton(newGameButton, newGameButton.text, 150, null);
        addButtonBounceTween(newGameButton, newGameButton.text);
        //Loading swirl
        loadingSwirl = this.add.sprite(newGameButton.x, newGameButton.y, 'loadingSwirl');
        loadingSwirl.anchor.setTo(0.5);
        loadingSwirl.scale.setTo(3 * gm.scaleVertical);
        loadingSwirl.animations.add('go');
        loadingSwirl.animations.play('go', 15, true);
        loadingSwirl.visible = false;
        
        //Add Players
        addPlayersTitle = this.add.text(this.world.centerX, this.world.height * 0.125, "Add Players", {font:gm.fontTwisted, fill:'#FFFFFF'});
        setText(addPlayersTitle, 200, '#FFFFFF', 'center');
        addPlayersTitle.visible = false;
        smallBounceTween(addPlayersTitle);
        //Add player button
        addPlayerButton = this.add.button(this.world.centerX, this.world.centerY + (this.world.height * 0.25), 'whiteButton', addPlayer, this);
        addPlayerButton.text = this.game.add.text(addPlayerButton.x, addPlayerButton.y, "+ Add Player", {font:gm.font, fill:"#FFFFFF"});
        setButton(addPlayerButton, addPlayerButton.text, 125, null);
        smallBounceTween(addPlayerButton);
        smallBounceTween(addPlayerButton.text);
        addPlayerButton.visible = false;
        addPlayerButton.text.visible = false;
        //Add player instructions
        addPlayerInstructions = this.add.text(this.world.centerX, this.world.height * 0.225, "Select players to edit their names", {font:gm.fontTwisted, fill:'#FFFFFF'});
        setText(addPlayerInstructions, 90, '#E6F1FD', 'center');
        addPlayerInstructions.visible = false;
        smallBounceTween(addPlayerInstructions);
        //Done button
        addPlayersDoneButton = this.add.button(this.world.centerX, this.world.centerY + (this.world.height * 0.375), 'whiteButton', doneAddingPlayers, this);
        addPlayersDoneButton.text = this.game.add.text(addPlayersDoneButton.x, addPlayersDoneButton.y, "Done", {font:gm.font, fill:"#FFFFFF"});
        setButton(addPlayersDoneButton, addPlayersDoneButton.text, 110, null);
        smallBounceTween(addPlayersDoneButton);
        smallBounceTween(addPlayersDoneButton.text);
        addPlayersDoneButton.visible = false;
        addPlayersDoneButton.text.visible = false;
        
        
        //Level transition
        level_txt = this.add.text(this.world.centerX, this.world.centerY, "LEVEL 1", {font:gm.fontTwisted, fill:'#FFFFFF'});
        setText(level_txt, 400, '#FFFFFF', 'center');
        level_txt.visible = false;
        //Until endgame
        untilEndGame_txt = this.add.text(this.world.centerX, this.world.height * 0.80, "4 Levels until the ENDGAME", {font:gm.font, fill:'#FF0000'});
        setText(untilEndGame_txt, 100, '#FF0000', 'center');
        untilEndGame_txt.visible = false;
        //Player fields
        for (var i = 1; i <= gm.maxPlayers; i++) {
            var playerField = {
                nameInput: null,
                numberText: null
            };
            playerField.nameInput = this.add.inputField(0, 0, {
                font: gm.font,
                fill: '#274F79',
                fillAlpha: 0.80,
                fontWeight: 'bold',
                width: 500 * gm.scaleHorizontal,
                padding: 20 * gm.scaleHorizontal,
                borderWidth: 4,
                borderColor: '#000000',
                borderRadius: 15,
                placeHolder: 'Player ' + i,
                placeHolderColor: '#274F79',
                backgroundColor: '#E6F1FD',
                min: 1,
                max: 16, 
                zoom: true
            });
            playerField.nameInput.visible = false;
            if (i > 2) {
                playerField.xButton = this.add.sprite(0, 0, 'delete');
                playerField.xButton.scale.setTo(0.5 * gm.scaleHorizontal);
                playerField.xButton.anchor.setTo(0.5);
                playerField.xButton.inputEnabled = true;
                playerField.xButton.events.onInputDown.add(removePlayer, this);
                playerField.xButton.visible = false;
                playerField.xButton.index = i - 1;
            }
            addedPlayers.push(playerField);
        }
        
        
        //Gameplay
        //Round
        round_txt = this.add.text(this.world.centerX, this.world.height * 0.3, "Round 1/10", {font:gm.font, fill:'#FFFFFF'});
        setText(round_txt, 300, '#FFFFFF', 'center');
        round_txt.visible = false;
        rollingLime = this.add.sprite(this.world.width * 2, this.world.height * 0.70, 'lime');
        rollingLime.anchor.setTo(0.5);
        rollingLime.scale.setTo(1 * gm.scaleHorizontal);
        rollingLime.visible = false;
        //Task
        task_txt = this.add.text(this.world.centerX, this.world.height * 0.25, "Task", {font:gm.font, fill:'#FFFFFF'});
        setText(task_txt, 120, '#FFFFFF', 'center');
        task_txt.visible = false;
        textBounceTween(task_txt);
        //The Twist
        twistButton = this.add.button(this.world.centerX, this.world.centerY + (this.world.height * 0.25), 'whiteButton', revealTwist, this);
        twistButton.text = this.game.add.text(twistButton.x, twistButton.y, "THE TWIST?", {font:gm.fontTwisted, fill:"#FFFFFF"});
        setButton(twistButton, twistButton.text, 200, null);
        smallBounceTween(twistButton);
        smallBounceTween(twistButton.text);
        twistButton.visible = false;
        twistButton.text.visible = false;
        //Skip
        skipButton = this.add.button(this.world.centerX, this.world.centerY + (this.world.height * 0.20), 'whiteButton', skipTask, this);
        skipButton.text = this.game.add.text(skipButton.x, skipButton.y, "Skip this, -1 Life", {font:gm.fontTwisted, fill:"#FFFFFF"});
        setButton(skipButton, skipButton.text, 120, null);
        smallBounceTween(skipButton);
        smallBounceTween(skipButton.text);
        skipButton.visible = false;
        skipButton.text.visible = false;
        
        //Hearts
        hearts = this.add.group();
        for (var i = 0; i < gm.lives; i++) {
            var heart = this.add.sprite(this.world.width * 0.04 + (this.world.width * 0.05 * i), this.world.height * 0.05, 'heart');
            heart.scale.setTo(0.5 * gm.scaleHorizontal);
            heart.anchor.setTo(0.5);
            smallBounceTween(heart);
            heart.visible = false;
            hearts.add(heart);
        }
        
        
        //Black
        black = this.add.image(this.world.centerX, this.world.centerY, 'black');
        black.anchor.setTo(0.5);
        black.width = this.world.width;
        black.height = this.world.height;
        black.alpha = 0.8;
        black.visible = false;
        
        
        //Mute button
        muteButton = this.add.sprite(this.world.width * 0.96, this.world.height * 0.05, 'mute');
        muteButton.scale.setTo(0.45 * gm.scaleHorizontal, 0.35 * gm.scaleHorizontal);
        muteButton.anchor.setTo(0.5);
        muteButton.inputEnabled = true;
        muteButton.frame = 0;
        muteButton.events.onInputDown.add(muteGame, this);
        gm.mute = false;
        
        //Play buttons
        /*playButton = this.add.button(this.world.centerX, -400, 'button', startGameButton, this);
        playButton_txt = this.game.add.text(this.world.centerX, -400, "Play", {font:"40px Rounds Black", fill:"#FFFFFF"});
        setButton(playButton, playButton_txt, 50 * (map.width / 1200), null);*/
        
        
        //JSON
        //questions = this.cache.getJSON('questions');
        
        goToGameState("MainMenu");
	},

	update: function () {
        
        //Delta Time
        var deltaTime = this.time.elapsed/1000;
        
        //Main gameplay logic
        if (gameState == "MainMenu") {
           
        }
        else if (gameState == "AddPlayers") {
             //Pressed new game, got data back
            if (loadingSwirl.alpha == 1 && loadingSwirl.visible && gm.gotNewGameData) {
                gm.music.stop();
                gm.music = this.add.audio('angels');
                gm.music.play();
                if (!gm.mute) {
                    gm.music.volume = 0.7;
                }
                else {
                    gm.music.volume = 0;
                }

                //Play intro
                if (gm.debug) {
                    gm.level = 2;
                    showNextTask();
                }
                else {
                    playIntro();
                }
                
                //Hide
                addPlayersTitle.visible = false;
                addPlayerInstructions.visible = false;
                for (var i = 0; i < addedPlayers.length; i++) {
                    addedPlayers[i].nameInput.visible = false;
                    if (i > 1) {
                        addedPlayers[i].xButton.visible = false;
                    }
                }
                loadingSwirl.alpha = 0.95;
            }
        }
        else if (gameState == "Gameplay") {
            
            
        }
        
        //Boss logic
        if (boss != null) {
            boss.update();
            
            if (boss.finished) {
                bossFinished();
            }
        }
        
        //Rolling Lime
        if (rollingLime.visible) {
            rollingLime.x = round_txt.x;
            rollingLime.angle -= 90 * deltaTime;
        }
	}

};

//Game Flow Logic
function newGame() {
    //Sound
    sfx.buttonClick.play();
    
    //Visible
    newGameButton.visible = false;
    newGameButton.text.visible = false;
    loadingSwirl.visible = false;
    loadingSwirl.alpha = 1;
    
    goToGameState("AddPlayers");
}
function repositionAddedPlayers() {
    var startY = thisGame.world.height * 0.30;
    if (gm.playerCount == 2) {
        addedPlayers[0].nameInput.y = startY;
        addedPlayers[1].nameInput.y = startY;
        addedPlayers[0].nameInput.x = thisGame.world.centerX - thisGame.world.width * 0.15 - (addedPlayers[0].nameInput.width / 2);
        addedPlayers[1].nameInput.x = thisGame.world.centerX + thisGame.world.width * 0.15 - (addedPlayers[1].nameInput.width / 2);
        addedPlayers[1].nameInput.visible = true;
        addedPlayers[0].nameInput.visible = true;
        
        for (var i = 2; i < gm.maxPlayers; i++) {
            addedPlayers[i].nameInput.visible = false;
            if (i > 1) {
                addedPlayers[i].xButton.visible = false;
            }
        }
    }
    else {
        for (var i = 0; i < gm.maxPlayers; i++) {
            addedPlayers[i].nameInput.x = (i + 1) * thisGame.world.width * 0.20 - (addedPlayers[i].nameInput.width / 2) - (Math.floor(i/4) * thisGame.world.width * 0.80);
            addedPlayers[i].nameInput.y = startY + (Math.floor(i/4) * thisGame.world.height * 0.15);
            if (i > 1) {
            addedPlayers[i].xButton.x = addedPlayers[i].nameInput.x + addedPlayers[0].nameInput.width * 1.075;
            addedPlayers[i].xButton.y = addedPlayers[i].nameInput.y - (thisGame.world.height * 0.003);
            }
            
            if (i < gm.playerCount) {
                addedPlayers[i].nameInput.visible = true;
                if (i > 1) {
                    addedPlayers[i].xButton.visible = true;
                }
            }
            else {
                addedPlayers[i].nameInput.visible = false;
                if (i > 1) {
                    addedPlayers[i].xButton.visible = false;
                }
            }
        }
    }
}
//Add new player to added player list
function addPlayer() {
    gm.playerCount++;
    if (gm.playerCount > gm.maxPlayers) {
        gm.playerCount = gm.maxPlayers;
    }
    addedPlayers[gm.playerCount - 1].nameInput.setText("Player " + gm.playerCount);
    repositionAddedPlayers();
}
function removePlayer(button) {
    gm.playerCount--;
    if (gm.playerCount < 2) {
        gm.playerCount = 2;
    }
    
    var startIndex = button.index;
    for (var i = startIndex; i < gm.playerCount; i++) {
        addedPlayers[i].nameInput.setText(addedPlayers[i + 1].nameInput.text._text);
    }
    
    repositionAddedPlayers();
}
function doneAddingPlayers() {
    players = [];
    for (var i = 0; i < gm.playerCount; i++) {
        players.push(addedPlayers[i].nameInput.text._text);
    }
    
    //Create new game and send to backend
    sendJoinGame();
    
    loadingSwirl.visible = true;
    addPlayersDoneButton.visible = false;
    addPlayersDoneButton.text.visible = false;
    addPlayerButton.visible = false;
    addPlayerButton.text.visible = false;
}
function playIntro() {
    
    //Fade out
    document.getElementById("gameBody").style.backgroundColor = gm.fontColor2;
    black.visible = true;
    black.alpha = 0;
    var fadeInBlackTween = thisGame.add.tween(black).to({ alpha: 1}, 1000);
    fadeInBlackTween.start();
    
    //Strings
    var firstString = "Greetings challengers,\n\nYou are about to face a drinking game\nwhich no mortal should ever attempt.";
    var secondString = "Remember to work as a team.";
    var thirdString = "Prepare for twists and beware of\nthe ENDGAME.";
    
    //Textfields
    //First
    var first_txt = thisGame.add.text(thisGame.world.centerX, thisGame.world.height * 0.25, firstString, {font:gm.font, fill:'#FFFFFF'});
    setText(first_txt, 90, '#FFFFFF', 'center');
    //first_txt.anchor.setTo(0, 0.5);
    first_txt.alpha = 0;
    var first_txtTween = thisGame.add.tween(first_txt).to({ alpha: 1}, 6000);
    fadeInBlackTween.chain(first_txtTween);
    //Second
    var second_txt = thisGame.add.text(first_txt.x, thisGame.world.height * 0.5, secondString, {font:gm.font, fill:'#FFFFFF'});
    setText(second_txt, 90, '#FFFFFF', 'center');
    //second_txt.anchor.setTo(0, 0.5);
    second_txt.alpha = 0;
    var second_txtTween = thisGame.add.tween(second_txt).to({ alpha: 1}, 6000);
    first_txtTween.chain(second_txtTween);
    //Third
    var third_txt = thisGame.add.text(first_txt.x, thisGame.world.height * 0.75, thirdString, {font:gm.font, fill:'#FFFFFF'});
    setText(third_txt, 90, '#FFFFFF', 'center');
    //third_txt.anchor.setTo(0, 0.5);
    third_txt.alpha = 0;
    var third_txtTween = thisGame.add.tween(third_txt).to({ alpha: 1}, 9000);
    second_txtTween.chain(third_txtTween);
    third_txtTween.onComplete.add(
        function e(){
            first_txt.visible = false;
            second_txt.visible = false;
            third_txt.visible = false;
            loadingSwirl.visible = false;
            playIntroForLevel();
        },
        thisGame
    );
}
function playIntroForLevel() {
    var levelName = "";
    switch (gm.level) {
        case 1: 
            levelName = "GENESIS";
            break;
        case 2: 
            levelName = "PASSION";
            break;
        case 3: 
            levelName = "CLASS";
            break;
        case 4: 
            levelName = "ANARCHY";
            break;
    }
    
    //Music
    gm.music.stop();
    gm.music = thisGame.add.audio('level' + gm.level);
    gm.music.onStop.removeAll();
    gm.music.play();
    if (!gm.mute) {
        gm.music.volume = 0.7;
    }
    else 
    {
        gm.music.volume = 0;
    }
    gm.music.onStop.add(
        
        function e() {
            gm.music.onStop.removeAll();
            playRandomMusic();
            if (!gm.mute) {
                gm.music.volume = 0.7;
            }
            else {
                gm.music.volume = 0;
            }
        }, 
    thisGame);
    
    //Hide
    thisGame.stage.backgroundColor = gm.fontColor2;
    document.getElementById("gameBody").style.backgroundColor = gm.fontColor2;
    black.visible = false;
    title_txt.visible = false;
    newGameButton.visible = false;
    newGameButton.text.visible = false;
    
    //Level text
    level_txt.visible = true;
    level_txt.text = "LEVEL " + gm.level;
    level_txt.y = -200;
    dropBounceTween(level_txt, thisGame.world.centerY, 500);
    level_txt.alpha = 0.99;
    var levelTextIntroTween = thisGame.add.tween(level_txt).to({ alpha: 1}, 4500);
    levelTextIntroTween.start();
    levelTextIntroTween.onComplete.add(
        function e(){
            
            //Level number shown, now show the name
            level_txt.text = levelName;
            
            //Until end game text
            untilEndGame_txt.alpha = 0;
            untilEndGame_txt.visible = true;
            if (gm.level == 4) {
                untilEndGame_txt.text = "Last level until the ENDGAME";
            }
            else {
                untilEndGame_txt.text = "" + (5 - gm.level) + " levels until the ENDGAME";
            }
            var untilTween = thisGame.add.tween(untilEndGame_txt).to({ alpha: 1}, 5000);
            untilTween.start();
            untilTween.onComplete.add(
                function e(){

                    goToGameState("Gameplay");
                    
                },
                thisGame
            );
        },
        thisGame
    );
}
function playBossIntro() {
    
    switch (gm.level) {
        case 1: 
            
            level_txt.visible = true;
            level_txt.text = "A Challenger\nApproaches!";
            flashTween(level_txt, 0.4);
            sfx.bossIntro.play();
            stopRandomMusic();
            
            //Timer event for delay into creating boss
            thisGame.time.events.add(Phaser.Timer.SECOND * 3, 
                function e() {
                //Remove intro
                level_txt.visible = false;
                level_txt.text = "";
                thisGame.tweens.remove(level_txt.flashTween1);
                thisGame.tweens.remove(level_txt.flashTween2);
                
                //Waterfall Boss
                boss = new Waterfall(thisGame);
                boss.create();
            }
            , this);
            break;
            
        case 2:
            level_txt.visible = true;
            level_txt.text = "A Challenger\nApproaches!";
            flashTween(level_txt, 0.4);
            sfx.bossIntro.play();
            stopRandomMusic();
            
            //Timer event for delay into creating boss
            thisGame.time.events.add(Phaser.Timer.SECOND * 3, 
                function e() {
                //Remove intro
                level_txt.visible = false;
                level_txt.text = "";
                thisGame.tweens.remove(level_txt.flashTween1);
                thisGame.tweens.remove(level_txt.flashTween2);
                
                //Waterfall Boss
                boss = new LimeRace(thisGame);
                boss.create();
            }
            , this);
            break;
            
        default:
            return;
            break;
    }
    
}
function bossFinished() {
    
    boss.destroy();
    boss = null;
    
    //Go to next level
    gm.level++;
    playIntroForLevel();
    return;
}
function showNextTask() {
    
    //Hide
    task_txt.visible = false;
    twistButton.visible = false;
    twistButton.text.visible = false;
    skipButton.visible = false;
    skipButton.text.visible = false;
    
    
    //Increment task
    gm.currentTask++;
    
    //Check for Boss round
    if (gm.currentTask > gm.currentNumberOfTasks) {
        if (gm.level < 3) {
            goToGameState("Boss");
            return;
        }
        else {
            //Reached end of level
            gm.level++;
            playIntroForLevel();
            return;
        }
    }
    
    //Show hearts
    for (var i = 0; i < hearts.length; i++) {
        hearts.getAt(i).visible = true;
    }
    changeLives(0);
    
    //Round text
    round_txt.visible = true;
    rollingLime.visible = true;
    round_txt.text = "Round " + (gm.currentTask) + "/" + gm.currentNumberOfTasks;
    horizontalScrollTween(round_txt, 4000).onComplete.add(
        
        function e() {
            //Sound
            sfx.whoosh.play();
            
            //Task text
            task_txt.visible = true;
            task_txt.y = -200;
            dropBounceTween(task_txt, thisGame.world.height * 0.25, 500);
            //Alter Task text
            task_txt.text = addLinesByWordCount(taskList[gm.level - 1][gm.currentTask - 1].Task, 7);
            replaceAtsWithPlayers();
            
            //Twisted button
            twistButton.visible = true;
            twistButton.text.visible = true;
            skipButton.visible = true;
            skipButton.text.visible = true;
            twistButton.y = -500;
            twistButton.text.y = -500;
            skipButton.y = thisGame.world.height * 2;
            skipButton.text.y = thisGame.world.height * 2;
            dropBounceTween(twistButton, thisGame.world.height * 0.65, 2500);
            dropBounceTween(twistButton.text, thisGame.world.height * 0.65, 3000);
            dropBounceTween(skipButton, thisGame.world.height * 0.85, 3000);
            dropBounceTween(skipButton.text, thisGame.world.height * 0.85, 3400);
            if (taskList[gm.level - 1][gm.currentTask - 1].Twist == "") {
                twistButton.text.text = "Done!";
            }
            else {
                twistButton.text.text = "The Twist?";
            }
        },
        thisGame
    );
    
    
}
function replaceAtsWithPlayers() {
    var newText = task_txt.text;
    
    var usedPlayers = [];
    while (newText.indexOf('@') != -1) {
        var index = newText.indexOf('@');
        newText = newText.replace('@','');
        
        //Insert name
        var playerIndex = getRandomInt(0, players.length - 1);
        while (checkInArray(usedPlayers, playerIndex)) {
            playerIndex = getRandomInt(0, players.length - 1);
        }
        
        newText = [newText.slice(0, index), players[playerIndex], newText.slice(index)].join('');
    }
    
    task_txt.text = newText;
}
function revealTwist() {
    
    //If the twist isn't a thing
    if (taskList[gm.level - 1][gm.currentTask - 1].Twist == "") {
        showNextTask();
        return;
    }
    
    //Hide
    twistButton.visible = false;
    twistButton.text.visible = false;
    skipButton.text.visible = false;
    skipButton.visible = false;
    
    //Show
    task_txt.y = -200;
    dropBounceTween(task_txt, thisGame.world.centerY, 200);
    task_txt.text = addLinesByWordCount(taskList[gm.level - 1][gm.currentTask - 1].Twist, 7);
    task_txt.alpha = 0.99;
    var nextTween = thisGame.add.tween(task_txt).to({ alpha: 1}, 8000);
    nextTween.start();
    nextTween.onComplete.add(
        function e() {
            showNextTask();
        },
        thisGame
    );
    sfx.buttonClick.play();
    sfx.whoosh.play();
}
function skipTask() {
    changeLives(-1);
    sfx.buttonClick.play();
    showNextTask();
    return;
}
//Player status
function changeLives(num) {
    gm.lives += num;
    hearts.callAll('kill');
    
    for (var i = 0; i < gm.lives; i++) {
        var newLife = hearts.getFirstDead();
        newLife.revive(100);
    }
}
//--
//States
function goToGameState(state) {
    switch (state) {
        case "MainMenu": 
            //Logic
            gm.gotNewGameData = false;
            
            
            break;
        case "AddPlayers":
            //Hide
            title_txt.visible = false;
            newGameButton.visible = false;
            newGameButton.text.visible = false;
            
            //Show
            addPlayersDoneButton.visible = true;
            addPlayersDoneButton.text.visible = true;
            addPlayersTitle.visible = true;
            addPlayerInstructions.visible = true;
            addPlayerButton.visible = true;
            addPlayerButton.text.visible = true;
            repositionAddedPlayers();
            break;
        case "Gameplay":
            
            //Hide
            level_txt.visible = false;
            untilEndGame_txt.visible = false;
            
            //Level logic
            switch (gm.level) {
                case 1:
                    thisGame.stage.backgroundColor = gm.fontColor3;
                    document.getElementById("gameBody").style.backgroundColor = gm.fontColor3;
                    break;
                case 2:
                    thisGame.stage.backgroundColor = gm.fontColor4;
                    document.getElementById("gameBody").style.backgroundColor = gm.fontColor4;
                    break;
                case 3:
                    thisGame.stage.backgroundColor = gm.fontColor5;
                    document.getElementById("gameBody").style.backgroundColor = gm.fontColor5;
                    break;
                case 4:
                    thisGame.stage.backgroundColor = gm.fontColor2;
                    document.getElementById("gameBody").style.backgroundColor = gm.fontColor2;
                    break;
            }
            
            //Task logic
            gm.currentNumberOfTasks = taskList[gm.level - 1].length;
            if (gm.debug) {
                gm.currentNumberOfTasks = 1;
            }
            gm.currentTask = 0;
            showNextTask();
            break;
        case "Boss":
            
            playBossIntro();
            
            break;
    }
    gameState = state;
}
//---


//Collision Handlers
function sampleCollisionHandler (player, item) {
    
}
//---


//Utilities
function pauseGame() {
    paused = !paused;
}
//Overall Game logic
function muteGame() {
    //Crop mute button
    var cropRect = null;
    if (gm.mute == true) {
        muteButton.frame = 0;
        gm.mute = false;
    }
    else {
        muteButton.frame = 1;
        gm.mute = true;
    }
    
    //Set volumes
    if (gm.mute == true) {
        gm.music.volume = 0;
        sfx.buttonClick.volume = 0;
        sfx.whoosh.volume = 0;
    }
    else {
        gm.music.volume = 1;
        sfx.buttonClick.volume = 1;
        sfx.whoosh.volume = 1;
    }
}
//---
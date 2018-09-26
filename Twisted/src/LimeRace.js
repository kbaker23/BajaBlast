var LimeRace = function(game) {
    //Init
    this.game = game;
    this.complete = false;
    this.bossState = 0; //name, pick a lime, starting places, countdown, race, finish
    this.stateTimer = 0;
    this.finished = false;
    
    //Setup
    //UI
    this.nameText = null;
    this.statusText = null;
    this.instructionsText = null;
    this.lime = null;
    this.limes = null;
    this.finishLine = null;
    this.spinTween = null;
    this.timerClock = null;
    this.okButton = null;
    this.currentPlace = 1;
    this.limeCount = 2;
    this.firstPlaceText = null;
    this.secondPlaceText = null;
    this.thirdPlaceText = null;
};

LimeRace.prototype = LimeRace.prototype.constructor = LimeRace;

LimeRace.prototype = {
    
    create: function() {
        
        //Timer
        this.timerClock = thisGame.add.sprite(thisGame.world.centerX, thisGame.world.height * 0.30, 'loadingSwirl');
        this.timerClock.anchor.setTo(0.5);
        this.timerClock.scale.setTo(4 * gm.scaleHorizontal);
        this.timerClock.animations.add('go');
        this.timerClock.animations.play('go', 15, true);
        this.timerClock.visible = false;
        this.timerClock.text = thisGame.add.text(this.timerClock.x, this.timerClock.y, "0", {font:gm.font, fill:'#FFFFFF'});
        setText(this.timerClock.text, 110, "#FFFFFF", 'center');
        this.timerClock.text.visible = false;
        smallBounceTween(this.timerClock.text);
        
        //Status text, ready, drink, stop
        this.statusText = thisGame.add.text(thisGame.world.centerX, -thisGame.world.height * 0.18, "Everyone pick a lime to win.\nSay your bet out loud.", {font:gm.font, fill:'#FFFFFF'});
        setText(this.statusText, 170, '#FFFFFF', 'center');
        
        //Name text
        this.nameText = thisGame.add.text(thisGame.world.centerX, -thisGame.world.height * 1.8, "LIME RACE", {font:gm.font, fill:'#FFFFFF'});
        setText(this.nameText, 400, '#FFFFFF', 'center');
        this.nameText.anchor.setTo(0.5, 1);
        twistTween(this.nameText);
        var bounceInTween1 = dropBounceTween(this.nameText, thisGame.world.height * 0.30, 400);
        bounceInTween1.onComplete.add(
            function e(){
                this.stateTimer = 8;
            },
            this
        );
        
        //Main lime
        this.lime = thisGame.add.sprite(thisGame.world.centerX, thisGame.world.height * 1.65, 'lime');
        this.lime.scale.setTo(1.4 * gm.scaleHorizontal);
        this.lime.anchor.setTo(0.5);
        var bounceInTween2 = dropBounceTween(this.lime, thisGame.world.height * 0.65, 900);
        bounceInTween2.onComplete.add(
            function e(){
                sfx.stinger1.play();
                smallBounceTween(this.lime);
            },
            this
        );
        
        //Finish line
        this.finishLine = thisGame.add.tileSprite(thisGame.world.width * 0.8, 0, thisGame.world.width * 0.05, thisGame.world.height, 'finishLine');
        this.finishLine.alpha = 0;
        
        //Limes
        this.limes = thisGame.add.group();
        
        //Instructions
        this.instructionsText = thisGame.add.text(thisGame.world.centerX, thisGame.world.height * 1.5, "Bet on a lime to win the race.", {font:gm.font, fill:'#E5FDF3'});
        setText(this.instructionsText, 140, '#FFFFFF', 'center');
        var bounceInTween = dropBounceTween(this.instructionsText, thisGame.world.height * 0.33, 1500);
        
        //Place text
        this.firstPlaceText = thisGame.add.text(thisGame.world.width * 0.225, thisGame.world.height * -1.5, "1st Place", {font:gm.font, fill:'#E5FDF3'});
        setText(this.firstPlaceText, 125, '#FFFFFF', 'center');
        this.secondPlaceText = thisGame.add.text(thisGame.world.centerX, thisGame.world.height * -1.5, "2nd Place", {font:gm.font, fill:'#E5FDF3'});
        setText(this.secondPlaceText, 115, '#FFFFFF', 'center');
        this.thirdPlaceText = thisGame.add.text(thisGame.world.width * 0.775, thisGame.world.height * -1.5, "3rd Place", {font:gm.font, fill:'#E5FDF3'});
        setText(this.thirdPlaceText, 108, '#FFFFFF', 'center');
        
        //Ok button
        this.okButton = thisGame.add.button(thisGame.world.centerX, thisGame.world.centerY + (thisGame.world.height * 0.30), 'whiteButton', this.choseLimes, this);
        this.okButton.text = thisGame.add.text(this.okButton.x, this.okButton.y, "Done", {font:gm.fontTwisted, fill:"#FFFFFF"});
        setButton(this.okButton, this.okButton.text, 200, null);
        smallBounceTween(this.okButton);
        smallBounceTween(this.okButton.text);
        this.okButton.visible = false;
        this.okButton.text.visible = false;
        
        
    },
    
    update: function () {
        var deltaTime = thisGame.time.elapsed/1000;
        
        //State timer
        if (this.stateTimer > 0) {
            
            this.stateTimer -= deltaTime;
            this.timerClock.text.text = "" + Math.floor(this.stateTimer);
                            
            if (this.stateTimer < 0) {
                
                if (this.bossState == 4) {
                    this.stateTimer = 2;
                    //Visible
                    this.statusText.visible = false;
                    
                    //Limes
                    for (var i = 0; i < this.limes.length; i++) {
                        //Rotation
                        if (this.limes.getAt(i).place == 0) {
                            this.limes.getAt(i).speed = getRandomInt(50, 200);
                        }
                    }
                }
                else {
                    this.nextState();
                }
                
            }
        }
        
        //Limes
        for (var i = 0; i < this.limes.length; i++) {
            //text Position
            this.limes.getAt(i).text.x = this.limes.getAt(i).x;
            this.limes.getAt(i).text.y = this.limes.getAt(i).y - this.limes.getAt(i).height * 1.2;
            
            //Rotation
            if (this.bossState < 5) {
                this.limes.getAt(i).angle += this.limes.getAt(i).speed * deltaTime;
            }
            
            if (this.bossState >= 2 && this.bossState < 5) {
                this.limes.getAt(i).text.x = this.limes.getAt(i).x - this.limes.getAt(i).width * 1.3;
                this.limes.getAt(i).text.y = this.limes.getAt(i).y;
            }
            
            if (this.bossState == 4) {
                //Speed
                this.limes.getAt(i).x += this.limes.getAt(i).speed * 0.5 * deltaTime;
                
                if (this.limes.getAt(i).x > thisGame.world.width * 0.8 && this.limes.getAt(i).place == 0) {
                    this.limes.getAt(i).place = this.currentPlace;
                    this.currentPlace++;
                }
                
                if (this.limes.getAt(i).x > thisGame.world.width * 0.83 && this.limes.getAt(i).speed != 0 && this.limes.getAt(i).place !=  0) {
                    this.limes.getAt(i).speed = 0;
                    
                    if (this.bossState == 4 && this.currentPlace == this.limeCount + 1) {
                        this.stateTimer = 0;
                        this.nextState();
                        break;
                    }
                }
            }
        }
        
    },
    scaleSort: function(a, b) {

        if (a.scale.x < b.scale.x)
        {
            return -1;
        }
        else if (a.scale.x > b.scale.x)
        {
            return 1;
        }
        else
        {
            return 0;
        }

    },
	destroy: function() {
		this.lime.destroy();
        this.timerClock.text.destroy();
        this.timerClock.destroy();
        this.statusText.destroy();
        this.nameText.destroy();
        this.instructionsText.destroy();
        for (var i = 0; i < this.limes.length; i++) {
            this.limes.getAt(i).text.destroy();
        }
        this.limes.destroy();
        this.finishLine.destroy();
        this.okButton.text.destroy();
        this.okButton.destroy();
        this.firstPlaceText.destroy();
        this.secondPlaceText.destroy();
        this.thirdPlaceText.destroy();
	},
    nextState: function() {
        this.bossState++;
        
        switch (this.bossState) {
            case 1:
                //Pick a lime
                playRandomMusic();
                
                //Tweens
                var bounceInTween = dropBounceTween(this.statusText, thisGame.world.height * 0.18, 1000);
                textBounceTween(this.statusText);
                
                //Visible
                this.instructionsText.visible = false;
                this.nameText.visible = false;
                dropBounceTween(this.lime, -1 * thisGame.world.height, 1200);
                
                //Limes
                var startX = thisGame.world.width * 0.1;
                var totalWidth = thisGame.world.width * 0.8;
                var limeCount = gm.playerCount + 2;
                if (limeCount > 8) {
                    limeCount = 8;
                }
                this.limeCount = limeCount;
                for (var i = 0; i < limeCount; i++) {
                    var newLime = thisGame.add.sprite(startX + (i * (totalWidth / (limeCount - 1))), -1 * thisGame.world.height, 'lime');
                    newLime.anchor.setTo(0.5);
                    newLime.scale.setTo(0.175 * gm.scaleHorizontal);
                    dropBounceTween(newLime, thisGame.world.centerY, 1000);
                    newLime.text = thisGame.add.text(newLime.x, newLime.y - newLime.height * 1.5, "" + (i + 1), {font:gm.font, fill:'#E5FDF3'});
                    setText(newLime.text, 110, '#FFFFFF', 'center');
                    newLime.index = i + 1;
                    newLime.speed = 0;
                    newLime.place = 0;
                    this.limes.add(newLime);
                }
                
                
                
                //Ok button
                this.okButton.visible = true;
                this.okButton.text.visible = true;
                
                break;
            case 2: 
                //Hide
                this.timerClock.visible = false;
                this.timerClock.text.visible = false;
                this.okButton.visible = false;
                this.okButton.text.visible = false;
                
                //Text
                this.statusText.text = "Preparing to race...";
                
                //Tween limes to start pos
                var startY = thisGame.world.height * 0.175;
                var totalHeight = thisGame.world.height * 0.77;
                for (var i = 0; i < this.limes.length; i++) {
                    var limeTween = thisGame.add.tween(this.limes.getAt(i)).to({ x: thisGame.world.width * 0.1, y: startY + (i * (totalHeight / (this.limes.length - 1)))}, 3000 + (getRandomInt(0, 2000)));
                    limeTween.start();
                    
                    //Rotation
                    this.limes.getAt(i).speed = getRandomInt(-200, -150);
                }
                
                
                 thisGame.add.tween(this.finishLine).to({ alpha: 1 }, 3000).start();
                
                //Set Timer
                this.stateTimer = 5;
                break;
            case 3:
                
                //Text
                this.statusText.text = "Get ready...";
                
                //Visible
                this.timerClock.text.visible = true;
                
                //Limes
                for (var i = 0; i < this.limes.length; i++) {
                    //Rotation
                    this.limes.getAt(i).speed = 80;
                }
                
                this.stateTimer = 5;
                break;
            case 4:
                
                //Text
                this.statusText.text = "Go!";
                
                //Visible
                this.timerClock.text.visible = false;
                
                //Limes
                for (var i = 0; i < this.limes.length; i++) {
                    //Rotation
                    this.limes.getAt(i).speed = getRandomInt(200, 250);
                }
                
                //Timer
                this.stateTimer = 2;
                
                break;
            case 5:
                
                //Hide
                this.finishLine.visible = false;
                
                //Show
                this.okButton.visible = true;
                this.okButton.text.visible = true;
                this.statusText.visible = true;
                
                //Place text
                dropBounceTween(this.firstPlaceText, thisGame.world.height * 0.6, 1000);
                dropBounceTween(this.secondPlaceText, thisGame.world.height * 0.6, 1000);
                dropBounceTween(this.thirdPlaceText, thisGame.world.height * 0.6, 1000);
                
                //Limes
                var limeTween = null;
                for (var i = 0; i < this.limes.length; i++) {
                    if (this.limes.getAt(i).place == 1) {
                        this.limes.getAt(i).scale.setTo(0.30 * gm.scaleHorizontal);
                        this.limes.getAt(i).angle = -10;
                        limeTween = thisGame.add.tween(this.limes.getAt(i)).to({ x: this.firstPlaceText.x, y: thisGame.world.height * 0.6 - thisGame.world.height * 0.1}, 1000 + (getRandomInt(0, 500)));
                        limeTween.start();
                    }
                    else if (this.limes.getAt(i).place == 2) {
                        this.limes.getAt(i).scale.setTo(0.25 * gm.scaleHorizontal);
                        this.limes.getAt(i).angle = 5;
                        limeTween = thisGame.add.tween(this.limes.getAt(i)).to({ x: this.secondPlaceText.x, y: thisGame.world.height * 0.6 - thisGame.world.height * 0.1}, 1000 + (getRandomInt(0, 500)));
                        limeTween.start();
                    }
                    else if (this.limes.getAt(i).place == 3) {
                        this.limes.getAt(i).scale.setTo(0.2 * gm.scaleHorizontal);
                        this.limes.getAt(i).angle = -7;
                        limeTween = thisGame.add.tween(this.limes.getAt(i)).to({ x: this.thirdPlaceText.x, y: thisGame.world.height * 0.6 - thisGame.world.height * 0.1}, 1000 + (getRandomInt(0, 500)));
                        limeTween.start();
                    }
                    else {
                        limeTween = thisGame.add.tween(this.limes.getAt(i)).to({ x: this.limes.getAt(i).x + getRandomInt(-100, 100), y: thisGame.world.height * 1.5}, 500 + (getRandomInt(0, 500)));
                        limeTween.start();
                    }
                }
                
                //Text
                this.statusText.text = "Drink " + Math.floor(gm.playerCount / 2) + " times if your\nlime finished behind 3rd place.";
                
                break;
        }
        
    },
    choseLimes: function() {
        if (this.bossState >= 5) {
            this.finishedRace();
            return;
        }
        this.nextState();
    },
    finishedRace: function() {
        //Finish
        this.finished = true;
    }
};

var Waterfall = function(game) {
    //Init
    this.game = game;
    this.complete = false;
    this.bossState = 0; //name, start, gameplay, finish
    this.stateTimer = 0;
    this.finished = false;
    
    //Setup
    //UI
    this.nameText = null;
    this.statusText = null;
    this.instructionsText = null;
    this.beer = null;
    this.spinTween = null;
    this.timerClock = null;
    this.emitter = null;
    this.emitterTween = null;
};

Waterfall.prototype = Waterfall.prototype.constructor = Waterfall;

Waterfall.prototype = {
    
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
        this.statusText = thisGame.add.text(thisGame.world.centerX, -thisGame.world.height * 0.18, "Start drinking in...", {font:gm.font, fill:'#FFFFFF'});
        setText(this.statusText, 170, '#FFFFFF', 'center');
        
        //Name text
        this.nameText = thisGame.add.text(thisGame.world.centerX, -thisGame.world.height * 1.8, "WATERFALL", {font:gm.font, fill:'#FFFFFF'});
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
        
        //Bubbles
        this.emitter = thisGame.add.emitter(thisGame.world.centerX, 400, 100);
        this.emitter.makeParticles('bubble');
        this.emitter.setRotation(0, 0);
        this.emitter.setAlpha(0.1, 1, 3000);
        this.emitter.setScale(0.1, 1, 0.1, 1, 6000, Phaser.Easing.Quintic.Out);
        this.emitter.gravity = -300;
        this.emitter.x = thisGame.world.centerX + thisGame.world.width * 0.075;
        this.emitter.y = thisGame.world.height * 0.40;
        
        //Beer graphic
        this.beer = thisGame.add.sprite(thisGame.world.centerX, thisGame.world.height * 1.65, 'beer1');
        this.beer.scale.setTo(1.4 * gm.scaleHorizontal);
        this.beer.anchor.setTo(0.5);
        var bounceInTween2 = dropBounceTween(this.beer, thisGame.world.height * 0.65, 900);
        bounceInTween2.onComplete.add(
            function e(){
                sfx.stinger1.play();
                smallBounceTween(this.beer);
            },
            this
        );
        
        //Instructions
        this.instructionsText = thisGame.add.text(thisGame.world.centerX, thisGame.world.height * 1.5, "Drink until the beer falls over.", {font:gm.font, fill:'#E5FDF3'});
        setText(this.instructionsText, 140, '#FFFFFF', 'center');
        var bounceInTween = dropBounceTween(this.instructionsText, thisGame.world.height * 0.33, 1500);
        
        
    },
    
    update: function () {
        var deltaTime = thisGame.time.elapsed/1000;
        
        if (this.stateTimer > 0) {
            
            this.stateTimer -= deltaTime;
            this.timerClock.text.text = "" + Math.floor(this.stateTimer);
                            
            if (this.stateTimer <= 0) {
                this.nextState();
            }
        }
        
        this.emitter.customSort(this.scaleSort, this);
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
		this.beer.destroy();
        this.timerClock.text.destroy();
        this.timerClock.destroy();
        this.statusText.destroy();
        this.emitter.destroy();
	},
    nextState: function() {
        this.bossState++;
        
        switch (this.bossState) {
            case 1:
                
                playRandomMusic();
                
                //Tweens
                var bounceInTween = dropBounceTween(this.statusText, thisGame.world.height * 0.18, 1000);
                bounceInTween.onComplete.add(
                    function e(){
                        this.stateTimer = 8;
                        this.timerClock.text.visible = true;
                    },
                    this
                );
                textBounceTween(this.statusText);
                
                //Visible
                this.instructionsText.visible = false;
                this.nameText.visible = false;
                break;
            case 2: 
                //fall
                this.beer.loadTexture('beer' + this.bossState);
                this.spinTween = thisGame.add.tween(this.beer).to({ angle: 30 }, 2000, function(k) { return Math.sin(Math.PI * 2 * k); }, true, 0, -1);
                this.statusText.text = "Drink now, don't stop!";
                
                this.timerClock.visible = false;
                this.timerClock.text.visible = false;
                
                this.stateTimer = getRandomInt(10, 15);
                
                //Particles
                //this.emitterTween = thisGame.add.tween(this.emitter).to({ angle: 30 }, 2000, function(k) { return Math.sin(Math.PI * 2 * k); }, true, 0, -1);
                thisGame.add.tween(this.emitter).to( { emitX: thisGame.world.centerX + thisGame.world.width * 0.075, emitY:  thisGame.world.height * 0.55}, 2000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
                //this.emitter.setXSpeed(1, 20);
                this.emitter.start(false, 2000, 1);
                break;
            case 3: 
                //Dead
                this.beer.loadTexture('beer' + this.bossState);
                thisGame.tweens.remove(this.spinTween);
                this.beer.angle = 0;
                this.statusText.text = "\nStop!\n\nChallenger defeated.";
                
                //Particles
                this.emitter.on = false;
                
                this.stateTimer = 5;
                break;
            case 4:
                //Finish
                this.finished = true;
                break;
        }
        
    }
};
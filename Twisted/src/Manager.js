"use strict";
//RANDOM HELPERS
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//ARRAY HELPERS
function shuffle(array) 
{
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function removeFromArray(array, search_term) {
    for (var i=array.length-1; i>=0; i--) {
        if (array[i] === search_term) {
            array.splice(i, 1);
            // break;       //<-- Uncomment  if only the first term has to be removed
        }
    }
}
function checkInArray(array, search_term) {
    for (var i=array.length-1; i>=0; i--) {
        if (array[i] === search_term) {
            return true;
            // break;       //<-- Uncomment  if only the first term has to be removed
        }
    }
    return false;
}

//Button creation
function setButton(button, text, size, buttonSound)
{
    text.fontSize = size * gm.scaleHorizontal;
    text.align = 'center';
    text.anchor.setTo(0.5);
    button.anchor.setTo(0.5, 0.5);
    button.input.useHandCursor = true;
    button.width = text.width * 1.2;
    button.height = text.height * 1.2;
}

//Text creation
function setText(text, size, color, align)
{
    text.fontSize = size * gm.scaleHorizontal;
    text.fill = color;
    text.align = align;
    text.anchor.setTo(0.5);
}
function addLinesByWordCount(useString, wordCount) {
    var newStrings = [];
    newStrings = useString.split(" ");
    
    var newString = "";
    for (var x = 0; x < newStrings.length; x++) {
        if (x % wordCount == 0 && x != 0) {
            newString += "\n" + newStrings[x] + " ";
        }
        else {
            newString += newStrings[x] + " ";
        }
    }
    
    return newString;
}

//Tween Presets
function dropBounceTween(obj, toY, speed) {
    var bounceTween = thisGame.add.tween(obj).to({y: toY}, speed, Phaser.Easing.Bounce.In);
    bounceTween.start();
    return bounceTween;
}
function horizontalScrollTween(obj, speed) {
    var outOfBounds = thisGame.world.width + (thisGame.world.width * 0.35);
    obj.x = outOfBounds;
    
    var scrollTween = thisGame.add.tween(obj).to({x: (-1 * outOfBounds)}, speed);
    scrollTween.start();
    
    return scrollTween;
}
function twistTween(obj, angle, speed) {
    return thisGame.add.tween(obj).to({ angle: angle }, speed, function(k) {                return Math.sin(Math.PI * 2 * k);            }, true, 0, -1);
}

function flashTween(object, seconds) {
    //Flash object as speed of seconds, doesn't return tweens but stores them on the object
    object.alpha = 0;
    var firstTween = thisGame.add.tween(object).to({ alpha: 1}, seconds * 1000);
    var secondTween = thisGame.add.tween(object).to({ alpha: 0}, seconds * 1000);
    firstTween.chain(secondTween);
    secondTween.chain(firstTween);
    firstTween.start();
    
    object.flashTween1 = firstTween;
    object.flashTween2 = secondTween;
}
function textBounceTween(buttonText) {
    var firstTextTween = thisGame.add.tween(buttonText.scale).to({ x: buttonText.scale.x * 1.05, y: buttonText.scale.y * 1.05}, 1000);
    var secondTextTween = thisGame.add.tween(buttonText.scale).to({ x: buttonText.scale.x * 0.95, y: buttonText.scale.y * 0.95}, 1000);
    firstTextTween.chain(secondTextTween);
    secondTextTween.chain(firstTextTween);
    firstTextTween.start();
}
function smallBounceTween(buttonText) {
    var firstTextTween = thisGame.add.tween(buttonText.scale).to({ x: buttonText.scale.x * 1.02, y: buttonText.scale.y * 1.02}, 1500);
    var secondTextTween = thisGame.add.tween(buttonText.scale).to({ x: buttonText.scale.x * 0.98, y: buttonText.scale.y * 0.98}, 1500);
    firstTextTween.chain(secondTextTween);
    secondTextTween.chain(firstTextTween);
    firstTextTween.start();
}
function addButtonBounceTween(button, buttonText) {
    var firstButtonTween = thisGame.add.tween(button.scale).to({ x: button.scale.x * 1.1, y: button.scale.y * 1.1});
    var firstTextTween = thisGame.add.tween(buttonText.scale).to({ x: buttonText.scale.x * 1.1, y: buttonText.scale.y * 1.1});
    var secondButtonTween = thisGame.add.tween(button.scale).to({ x: button.scale.x * 0.9, y: button.scale.y * 0.9});
    var secondTextTween = thisGame.add.tween(buttonText.scale).to({ x: buttonText.scale.x * 0.9, y: buttonText.scale.y * 0.9});
    firstButtonTween.chain(secondButtonTween);
    secondButtonTween.chain(firstButtonTween);
    firstTextTween.chain(secondTextTween);
    secondTextTween.chain(firstTextTween);
    firstButtonTween.start();
    firstTextTween.start();
}


//MUSIC
function playRandomMusic() {
    
    //Check if possible
    if (musicSources[gm.level - 1].length == 0) {
        return;
    }
    
    //Get random index
    var randomIndex = getRandomInt(0, musicSources[gm.level - 1].length - 1);
    
    gm.music = musicSources[gm.level - 1][randomIndex];
    gm.music.play();
    gm.music.loop = false;
    if (gm.music.event == null) {
        gm.music.event = gm.music.onStop.add(playRandomMusic, this);
    }
}
function stopRandomMusic() {
    gm.music.pause();
    gm.music.onStop.removeAll();
}



//Collision helpers
function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}
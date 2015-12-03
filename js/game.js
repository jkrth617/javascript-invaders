$(document).on('ready', function(e) {
  
  var game = new Game;
  // var ship = new Ship(game);

  $(document).keydown(function(e) {
    e.preventDefault(); // prevent the default action (scroll / move caret)
    // var $ship = $('#space-ship');
    switch(e.which) {
      case 37: // left
        game.ship.moveShip(-20);
      break;

      case 39: // right
        game.ship.moveShip(20);
      break;

      case 32:
        game.ship.shipShoot();
      break

      default: return; // exit this handler for other keys
    }
  });

})

var bulletCounter = 0;

var Bullet = function Bullet(ship) {
  this.game = ship.game;//refactor to make ship apart of the game so that I can just pass ship in
  // var startingPosition = ship.position();
  this.xPosition = ship.xPosition;
  this.yPosition = ship.yPosition;
  bulletCounter ++;
  ship.$ship.before("<div id = 'bullet"+bulletCounter+"' class='bullet'>.</div>");
  this.id = "bullet"+bulletCounter;
  $('#'+this.id).css("left", "+="+this.xPosition);
};

var Ship = function Ship(game){
  this.game = game;
  this.xPosition = 650;//centered with px
  this.yPosition = 289;//50% height in px
  this.$ship = $ship = $('#space-ship');
}

Ship.prototype.shipShoot = function () {
  var self = this;
  var bullet = new Bullet(self);
  self.game.bullets.push(bullet)
  //below was the animation but this is being moved to the master animater
  // while(bullet.unimpeded()){//unimpeded(bullet)){
  //   bullet.yPosition -= 10;
  //   $('#'+bullet.id).animate({ top: bullet.yPosition }, 50);
  // } 
};

Ship.prototype.moveShip = function (movement) {
  var self = this;
  // var pos = self.$ship.position().left;
  if (onScreen(self.xPosition)){
    self.xPosition += movement;
    // var newPos = pos + movement + "";//coerce into a string
    // self.$ship.animate({ left: newPos }, 100);
  }
};

var onScreen = function (position) {
  return true;
};

Bullet.prototype.unimpeded = function () {
  var bullet = this;
  var enemyHitId = bullet.hit();
  if (enemyHitId){
    setTimeout(function(){
      $("#alien"+enemyHitId).remove();
      $("#"+bullet.id).remove();
    }, 1500);
    return false;    
  }
  else if (bullet.offScreen()){
    setTimeout(function(){
      $("#"+bullet.id).remove();
    }, 2500);
    return false;
  }
  else{
    return true;
  }
};

Bullet.prototype.hit = function () {
  var bullet = this;
  // this.game.army.//forEach(function(alien){
  var aliens = bullet.game.enemies;
  for(var i = 0; i < aliens.length; i++){
    var alien = aliens[i];
    var xDistance = Math.abs(alien.xPosition - bullet.xPosition);
    var yDistance = Math.abs(alien.yPosition - bullet.yPosition);
     if (i == 79){
     }//this was made to only stop on one
    if (yDistance <= 20 && xDistance <=20){
      var hitId = alien.id;
      bullet.game.enemies = _.reject(aliens, function(alien){ return alien.id == hitId; });
      return hitId;
    }
  }
  return false;
};

Bullet.prototype.offScreen = function () {
  if(this.yPosition <= 0){
    return true;
  } else {
    return false;//write this later
  }
};

var alienCounter = 0;//this should be in Game

var Alien = function Alien () {
  this.id = alienCounter;
  alienCounter++;  
  this.content = "<span id = alien"+this.id+" class='alien'>W</span>";
  this.xPosition = this.calcXPosition(this.id);
  this.yPosition = this.calcYPosition(this.id);
};

Alien.prototype.calcXPosition = function(id) {
  var row = id%20;
  var pos = 25 * row;
  return pos;//could just returnthe above line but maybe i want to mess with it more
};

Alien.prototype.calcYPosition = function(id) {
  var row = Math.floor(id/20);
  var pos = 25 * row;
  return pos;//could just returnthe above line but maybe i want to mess with it more
};
//I can refactor this to just accept another thing like the 10 or 20 to DRY out the function calls but I dont know how its going to play out right now

var Game = function Game () {
  this.ship = new Ship(this);
  this.$container = $("#invading-army");
  this.bullets = [];
  this.enemies = this.alienSetUp(); 
  this.shifter = 20;
  this.placeAliensOnPage();
  this.startLoop();
  //this.startMotion();
};

Game.prototype.startLoop = function () {
  this.coreLoopId = setInterval(this.masterAnimater.bind(this), 100);//the loop is saved because later I could create a pause function
};

Game.prototype.masterAnimater = function () {
  this.shiftControlShip();
  this.shiftControlAliens();
  this.shiftControlBullets();


};

Game.prototype.shiftControlShip = function () {
  $(this.ship.$ship).animate({ left: this.ship.xPosition.toString() }, 50);
};

Game.prototype.startMotion = function () {
  var self = this;
  var x = 0;
  while (x<1000){//self.gameInProgress()){
    self.shiftControl();
    x++;
  }
};

Game.prototype.shiftControlBullets = function () {
  var self = this;
  self.bullets.forEach(self.shiftBullet)
};

Game.prototype.shiftBullet = function (bullet) {
  if (bullet.unimpeded()) {
    bullet.yPosition -= 10;
    $('#'+bullet.id).animate({ top: bullet.yPosition }, 50);
  }
};

Game.prototype.gameInProgress = function () {
  var army = this.enemies;
  for(var i = 0;i<army.length;i++){
    if (army[i].yPosition>=210){
      alert("game over");
      return false;
    }
  }
  return true;
}

Game.prototype.shiftControlAliens = function () {
var self = this;
  if(self.againstBound()){
    self.shiftDown();
    self.shifter *= -1;
    // self.shiftControl(shifter*-1);
  }else{
    self.shift();
  }
};

Game.prototype.againstBound = function () {
  var self = this;
  var advancingArmy = self.enemies;
  for(var i = 0; i < advancingArmy.length; i++){
    if((self.shifter < 0 && advancingArmy[i].xPosition <=5)||(self.shifter > 0 && advancingArmy[i].xPosition >=1245)){
      return true;
    }
  }
  return false;
};

Game.prototype.shiftDown = function () {
  var self = this;
  var advancingArmy = self.enemies;
  advancingArmy.forEach(function(alien){
    alien.yPosition+=20;
    $('#alien'+alien.id).animate({ top: alien.yPosition }, 200);
  })
};

Game.prototype.shift = function () {
  var self = this;
  var advancingArmy = self.enemies;
  advancingArmy.forEach(function(alien){
    alien.xPosition+=self.shifter;
    $('#alien'+alien.id).animate({ left: alien.xPosition }, 200);
  })
};

Game.prototype.alienSetUp = function () {
  var army = [];
  for(var i = 0; i < 80; i++){
    army.push(new Alien);
    // $('#invading-army').append(alien.content);
  }
  return army;
};

Game.prototype.placeAliensOnPage = function () {
  var self = this;
  self.enemies.forEach(function(alien){
    self.$container.append(alien.content);
    $('#invading-army #alien'+alien.id).css("left", "+="+alien.xPosition);
    $('#invading-army #alien'+alien.id).css("top", "+="+alien.yPosition);    
  })
};

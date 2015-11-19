$(document).on('ready', function(e) {
  
  alienSetUp();

  $(document).keydown(function(e) {
    e.preventDefault(); // prevent the default action (scroll / move caret)
    var $ship = $('#space-ship');
    switch(e.which) {
      case 37: // left
        moveShip($ship, -40);
      break;

      case 39: // right
        moveShip($ship, 40);
      break;

      case 32:
        shipShoot($ship);
      break

      default: return; // exit this handler for other keys
    }
  });

})

var bulletCounter = 0;

var Bullet = function Bullet(ship) {
  var startingPosition = ship.position();
  this.xPosition = startingPosition.left;
  this.yPosition = startingPosition.top;
  bulletCounter ++;
  ship.before("<div id = 'bullet"+bulletCounter+"' class='bullet'>.</div>");
  this.id = "bullet"+bulletCounter;
};

var shipShoot = function ($ship) {
  console.log('bang');
  var bullet = new Bullet($ship);
  $('#'+bullet.id).css("left", "+="+bullet.xPosition);
  var counter = 0;
  while(counter < 350){//unimpeded(bullet)){
    bullet.yPosition -= 10;
    counter += 10;
    debugger;
    $('#'+bullet.id).animate({ top: bullet.yPosition }, 50);
  } 

};

var moveShip = function ($target, movement) {
  var pos = $target.position().left;
  if (onScreen(pos)){
    var newPos = pos + movement + "";//coerce into a string
    $target.animate({ left: newPos }, 100);
  }
};

var onScreen = function (position) {
  return true;
};

var unimpeded = function (bullet) {
  return true;
};

var alienCounter = 0;

var Alien = function Alien () {
  this.id = alienCounter;
  alienCounter++;  
  this.content = "<span id = alien"+this.id+"' class='alien'>W</span>";
  this.xPosition = this.calcXPosition(this.id);
  this.yPosition = this.calcYPosition(this.id);
};

Alien.prototype.calcXPosition = function(id) {
  var row = id%4;
  var pos = 50 * row;
  return pos;//could just returnthe above line but maybe i want to mess with it more
};

Alien.prototype.calcYPosition = function(id) {
  var row = Math.floor(id/5);
  var pos = 50 * row;
  return pos;//could just returnthe above line but maybe i want to mess with it more
};
//I can refactor this to just accept another thing like the 10 or 20 to DRY out the function calls but I dont know how its going to play out right now

var alienSetUp = function () {
  for(var i = 0; i < 80; i++){
    var alien = new Alien;
    $('#invading-army').append(alien.content);
    $('#alien'+this.id).css("left", "+="+alien.xPosition);
    $('#alien'+this.id).css("top", "-="+alien.yPosition);
    debugger;
  }
};

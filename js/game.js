$(document).on('ready', function(e) {
  
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

var counter = 0;

var Bullet = function Bullet(ship) {
  var startingPosition = ship.position();
  this.xPosition = startingPosition.left;
  this.yPosition = startingPosition.top;
  counter ++;
  ship.before("<div id = 'bullet"+counter+"'class='bullet'>.</div>");
  this.id = "bullet"+counter;
};

var shipShoot = function ($ship) {
  console.log('bang');
  var bullet = new Bullet($ship);
  $('#'+bullet.id).css("left", "+="+bullet.xPosition);
  var counter = 0;
  while(counter < 100){//unimpeded(bullet)){
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
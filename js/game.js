$(document).on('ready', function(e) {
  
  $(document).keydown(function(e) {
    e.preventDefault(); // prevent the default action (scroll / move caret)
    var $ship = $('#space-ship');
    switch(e.which) {
      case 37: // left
        moveShip($ship, -40)
      break;

      case 39: // right
        moveShip($ship, 40)
      break;

      default: return; // exit this handler for other keys
    }
  });

})

var moveShip = function ($target, movement) {
  debugger;
  var pos = $target.position().left;
  if (onScreen(pos)){
    var newPos = pos + movement + "";//coerce into a string
    $target.animate({ left: newPos });
  }
};

var onScreen = function (position) {
  return true;
};
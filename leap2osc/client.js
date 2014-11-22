var osc = require('node-osc');
var Leap = require('leapjs');

var client = new osc.Client('127.0.0.1', 16937);
client.send('/init', 1);

var inverter = 1;
var x = 0;
var speed = 1;

/*
setInterval(function(){
	if(x > 1 || x < 0){
		inverter *= -1;
	}

	x += inverter * speed / 100;
	client.send('/knob/value', x);
	console.log(x);

}, 10);
*/

var previousFrame = null;
var paused = false;
var pauseOnGesture = false;

var controllerOptions = {enableGestures: true};

function clip(x){
	return x<0 ? 0 : x>1 ? 1 : x;
}


Leap.loop(controllerOptions, function(frame) {
  if (paused) {
    return; // Skip this update
  }

  if (frame.hands.length > 0) {
    for (var i = 0; i < frame.hands.length; i++) {

      if ( i >= 3) break;

      var hand = frame.hands[i];

      var leftRight = clip((hand.palmPosition[0] + 300) / 600);
      var height = clip(hand.palmPosition[1] / 500);
      var nearFar = clip((hand.palmPosition[2] - 300) / 600 * -1);
      var grab = clip(hand.grabStrength);
      var pinch = clip(hand.pinchStrength);

	  // x y z
      client.send('/hand' + (i+1) + '/left-right', leftRight);
      client.send('/hand' + (i+1) + '/height', height);
      client.send('/hand' + (i+1) + '/near-far', nearFar);
      client.send('/hand' + (i+1) + '/grab', grab);
      client.send('/hand' + (i+1) + '/pinch', pinch);
      

  	}
  }
  
});
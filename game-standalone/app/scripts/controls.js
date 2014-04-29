/*global $*/

var app = app || {};

// Keyboard Input helper
// Source: http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
var Key = {
	pressed: {},

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	isDown: function(keyCode){
		return this.pressed[keyCode];
	},

	anyDown: function(){
		var p = this.pressed;
		return p[this.LEFT] || p[this.UP] || p[this.DOWN] || p[this.RIGHT];
	},

	onKeyDown: function(event){
		this.pressed[event.keyCode] = true;
	},

	onKeyUp: function(event){
		this.pressed[event.keyCode] = undefined;
	},
};

// Arrow keys
$('body').keydown(function(e){
	Key.onKeyDown(e);
	var player = app.objects[0];
	var dx = 15;
	var dy = 15;

	if (e.keyCode === 37){				// LEFT
		player.dx = -dx;
	} else if (e.keyCode === 38){		// UP
		player.dy = -dy;
	} else if (e.keyCode === 39){		// RIGHT
		player.dx = +dx;
	} else if (e.keyCode === 40){		// DOWN
		player.dy = +dy;
	}
}).keyup(function(e){
	Key.onKeyUp(e);
	var player = app.objects[0];
	var dx = 0;
	var dy = 0;

	if (e.keyCode === 37){				// LEFT
		player.dx = -dx;
	} else if (e.keyCode === 38){		// UP
		player.dy = -dy;
	} else if (e.keyCode === 39){		// RIGHT
		player.dx = +dx;
	} else if (e.keyCode === 40){		// DOWN
		player.dy = +dy;
	}
});
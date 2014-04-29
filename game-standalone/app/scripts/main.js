/*global PIXI, requestAnimFrame*/
/*global Key, io, Player*/

// app namespace
var app = app || {};

setup();
requestAnimFrame(animate);


// game setup
function setup(){
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0xFFFFaF);
	// var stage = new PIXI.Stage(0x333333);		// stage color

	// create a renderer instance.
	var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight-4);


	// make grid

	var rowN = 50;
	var colN = 100;
	var gx, gy;
	var grid = new PIXI.Graphics();
	grid.lineStyle(2, 0x000000, 1);
	for (var i=0; i<colN; i++){
		for (var j=0; j<rowN; j++){
			gx = i*100;
			gy = j*100;
			grid.moveTo(gx + 20, gy);
			grid.lineTo(gx + 100 - 20, gy);
			grid.moveTo(gx, gy + 20);
			grid.lineTo(gx, gy + 100 - 20);
		}
	}
	stage.addChild(grid);



	// make player
	var graphics = new PIXI.Graphics();
	graphics.beginFill(0xFF0000);				// player color
	 
	// draw a triangle using lines
	graphics.moveTo(10,10);
	graphics.lineTo(10, 100);
	graphics.lineTo(150, 100);
	 
	graphics.drawCircle(100,100,50);

	// end the fill
	graphics.endFill();

	graphics.dx = 0;
	graphics.dy = 0;

	var hitC = new PIXI.Circle(100,100,50);
	graphics.hitArea = hitC;
	graphics.setInteractive(true);
	graphics.click = function(data){
		console.log('hit rect');
	};
	 
	// add it the stage so we see it on our screens..
	stage.addChild(graphics);

	// Make goal posts
	var goalN = 20;
	var goals = [];
	for (i=0; i<goalN; i++){
		var goal = new PIXI.Graphics();
	 
		goal.beginFill(0xa1000F);
		goal.drawCircle(Math.random()*2000 - 1000,Math.random()*2000 - 1000,20);
		goal.endFill();
		 
		stage.addChild(goal);

		goals.push(goal);
	}
	

	// main scope where our player moves
	var scope = {
		left: 50,
		right: window.innerWidth - 50,
		up: 50,
		down: window.innerHeight-4 - 50,
	};


	// add the renderer view element to the DOM
	document.getElementById('main').appendChild(renderer.view);

	// add to app namespace
	app.stage = stage;
	app.renderer = renderer;
	app.scope = scope;

	app.goals = goals;
	app.otherPlayers = app.otherPlayers || [];
	app.objects = app.objects || [];
	app.objects.push(graphics);

	// networking
	app.online = (typeof io !== 'undefined');
	if (app.online){
		// var socket = io.connect('http://somegameserver.herokuapp.com:8000/');
		var socket = io.connect();
		app.socket = socket;

		// when receiving news
	    socket.on('news', function (data) {
			console.log(data);
			// socket.emit('my other event', { my: 'data' });
			if (data['created'] === true){
				var newPlayer = new Player({ id: data.id, color: 0x009CF0 });
				app.otherPlayers.push(newPlayer);
			} else if (data['data']){
				console.log(data['data']);
				var otherData = data['data'];
				for (var i = app.otherPlayers.length - 1; i >= 0; i--) {
					var other = app.otherPlayers[i];
					if (other.id === data.id){
						other.position.x = otherData.x;
						other.position.y = otherData.y;
					}
				}
			}
		});
	} else {		// localstorage

	}

}


// animation loop
function animate() {

	// update
	if (Key.anyDown() === true){
		// for (var i=0, len=app.objects.length; i<len; i++){
		var player = app.objects[0];
		player.position.x += player.dx;
		player.position.y += player.dy;

		// send pos to server
		if (app.online){
			app.socket.emit('my other event', { x: player.position.x, y: player.position.y });
		}

		if (player.getBounds().x < app.scope.left){
			app.stage.worldTransform.tx += 15;
		}
		if (player.getBounds().x > app.scope.right){
			app.stage.worldTransform.tx -= 15;
		}
		if (player.getBounds().y < app.scope.up){
			app.stage.worldTransform.ty += 15;
		}
		if (player.getBounds().y > app.scope.down){
			app.stage.worldTransform.ty -= 15;
		}
	}

    // render the stage, request next frame
    app.renderer.render( app.stage );
    requestAnimFrame(animate);
}
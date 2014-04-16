/*global PIXI, requestAnimFrame*/
/*global Key*/

// app namespace
var app = app || {};

setup();
requestAnimFrame(animate);


// game setup
function setup(){
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0xFFFFaF);

	// create a renderer instance.
	var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight-4);

	var graphics = new PIXI.Graphics();
	 
	// begin a green fill..
	graphics.beginFill(0xFF0000);
	 
	// draw a triangle using lines
	graphics.moveTo(10,10);
	graphics.lineTo(10, 100);
	graphics.lineTo(150, 100);
	 
	graphics.drawCircle(100,100,50);

	// end the fill
	graphics.endFill();

	graphics.dx = 0;
	graphics.dy = 0;
	 
	// add it the stage so we see it on our screens..
	stage.addChild(graphics);

	var graphics2 = new PIXI.Graphics();
	 
	// begin a green fill..
	graphics2.beginFill(0x11000F);
	 
	graphics2.drawCircle(100,100,50);

	// end the fill
	graphics2.endFill();
	 
	// add it the stage so we see it on our screens..
	stage.addChild(graphics2);

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

	app.objects = app.objects || [];
	app.objects.push(graphics);
	app.objects.push(graphics2);
}


// animation loop
function animate() {

	// update
	if (Key.anyDown() === true){
		// for (var i=0, len=app.objects.length; i<len; i++){
		var player = app.objects[0];
		player.position.x += player.dx;
		player.position.y += player.dy;

		if (player.getBounds().x < app.scope.left){
			app.stage.worldTransform.tx += 5;
		}
		if (player.getBounds().x > app.scope.right){
			app.stage.worldTransform.tx -= 5;
		}
		if (player.getBounds().y < app.scope.up){
			app.stage.worldTransform.ty += 5;
		}
		if (player.getBounds().y > app.scope.down){
			app.stage.worldTransform.ty -= 5;
		}
	}

    // render the stage, request next frame
    app.renderer.render( app.stage );
    requestAnimFrame(animate);
}
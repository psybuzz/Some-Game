/*global PIXI, app*/

function Player (options) {
	// make player
	var graphics = new PIXI.Graphics();
	if (options){
		for (var o in options){
			graphics[o] = options[o];
		}
	}


	graphics.beginFill(options['color'] || 0xFF0000);				// player color
	 
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
	app.stage.addChild(graphics);	// move this elsewhere?

	return graphics;
}
var space, form;

var theme = {
  background: '#EBEBEB',
  mid: '#B2B2B2',
  primary: '#0F4BEB',
  accent: '#FF2305',
  white: '#FFF',
  black: '#000'
}

var params = {
	x:40,
	y:20,
	minSize:1,
	maxSize:5,
	freq:10,
	offset:4,
	noiseScale:0.2,
	scaleFactor:5,
	scaleOffset:1,
	noiseSpeed: 15,
	shape:'circle',
	regenerate:function(){
		generateGrid();
	}
}


console.log('init');

var gui = new dat.GUI();
gui.add(params, 'x', 0, 100);
gui.add(params, 'y', 0, 100);
gui.add(params, 'shape', ['circle', 'square', 'line']);

// gui.add(params, 'minSize', 1, 10);
// gui.add(params, 'maxSize', 1, 10);
// gui.add(params, 'freq', 1, 20);
// gui.add(params, 'offset', 1, 20);
// gui.add(params, 'offset', 1, 20);

gui.add(params, 'noiseScale', 0, 2);
gui.add(params, 'noiseSpeed', 1, 100);
gui.add(params, 'scaleFactor', 2, 10);
gui.add(params, 'scaleOffset', 0, 10);
gui.add(params, 'regenerate');




space = new SVGSpace("pt", ready).setup({bgcolor: theme.background});
form = new SVGForm( space );
// noise = new SimplexNoise();

var cells = [];


function generateGrid(){
	clear();

	// console.log('foo', noise.noise(1, 10))

	var cellSize = space.size.$divide([params.x, params.y, 0])

	for (var i = 0; i < (params.x); i++) {
		for (var j = 0; j < (params.y); j++) {

			cell = new Cell(
				i*cellSize.x, 
				j*cellSize.y, 
				0, 
				(i+1)*cellSize.x,
				(j+1)*cellSize.y,
				0,
				1,
				params.shape
				// Util.randomRange(params.minSize, params.maxSize)
				// PerlinNoise.noise( i*0.1, j*0.1, 0.8 )*5
			)

			space.add(cell);
			cells.push(cell);
		}
	}
}

function clear(){

	cells.forEach(function(cell){
		console.log(cell)
		space.remove(cell);
	});

	var svg = space.space;
	while (svg.lastChild) {
	  svg.removeChild(svg.lastChild);
	}

	cells = [];
}







function ready(bounds, elem) {
	console.log('SVG space is ready');
  form.scope("item", elem ); // initiate the scope which uses the svg dom as parent node
  space.bindMouse();
  space.bindTouch();
  space.play();

  generateGrid();
}



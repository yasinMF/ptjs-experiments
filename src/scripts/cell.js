//Item Class
function Cell(x, y, z, tx, ty, tz, size, shape, color){
	// console.log('foo', arguments)
	this.start = new Vector(x, y, z);
	this.end = new Vector(tx, ty, tz);
	this.center = this.findCenter(this.start, this.end);
	this.size = size ? size : 2;
	this.shape = shape ? shape : 'circle';
	this.color = color ? color : theme.primary
}

Util.extend( Cell, Vector );

Cell.prototype.findCenter = function(vec1, vec2){
	return new Vector((vec1.x+vec2.x)/2, (vec1.y+vec2.y)/2, (vec1.z+vec2.z)/2)
}


Cell.prototype.animate = function(time, fps, context) {
  form.enterScope(this);

  // this.pulse(time);
  this.noise(time);
  this.draw();
}

Cell.prototype.noise = function(time){
	this.transformedSize = Math.pow(PerlinNoise.noise( this.center.x*(params.noiseScale/100), this.center.y*(params.noiseScale/100), time/(100*params.noiseSpeed) )*2, params.scaleFactor)+params.scaleOffset;
}

Cell.prototype.pulse = function(time){
	let amp = this.size;
  let freq = params.freq/10000;
  let offset = (this.center.x/(space.size.x/params.offset))+Util.gaussian(this.center.y) //Math.sin((freq*(time+this.center.y)*2*Math.PI));
  this.transformedSize = amp*Math.sin((freq*(time)*2*Math.PI)+offset)+(amp);
}


Cell.prototype.draw = function(){
	form.fill(this.color).stroke(false);

	if(this.shape === 'circle'){
		form.circle(new Circle(this.center).setRadius(this.transformedSize));
	}else if(this.shape === 'square'){
		form.rect(new Rectangle(this.center.x, this.center.y, this.center.x+1, this.center.y+1).setCenter(this.center.x, this.center.y).resizeCenterTo(this.transformedSize, this.transformedSize));
	}else if(this.shape === 'line'){
		form.rect(new Rectangle(this.center.x, this.start.y, this.center.x+1, this.end.y).setCenter(this.center.x, this.center.y).resizeCenterTo(1, this.transformedSize));
	}else{
		form.circle(new Circle(this.center).setRadius(this.transformedSize));
	}
}




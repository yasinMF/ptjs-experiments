var themes = [
  {
    background: '#263238',
    primary: '#283593',
    white: '#FFF',
    black: '#000'
  }
]

var data = [];
// var capturer = new CCapture( { format: 'webm' } );

// Set up dat gui
var controls = {
  activeTheme: 0,

  getData:function(){
    $.getJSON( "https://sheets.googleapis.com/v4/spreadsheets/1sbrgKTkeBNgwt3Iih1iMAte4IUjKyibkNfiPSjWQ41Q/values/Sheet1?key=AIzaSyC8Psnjoh2rYMBsnlTi7Aj8cfRH64W5Z6c&majorDimension=ROWS&range=RainfallAcrossUSCities!A1:Z999", function( d ) {
      console.log('Fetched data', d.values);
      data = d.values;
      run();
    });
  },

  exportFrame:function(){
    
    var svgData = document.getElementById("pt_svg").outerHTML;
    var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    saveAs(svgBlob, "export.svg");
  },

  startRecording:function(){
    capture.startRecording();
  },



  stopRecording:function(){
    capture.stopRecording();
  }
}


var capture = {
  zip:null,
  recording:false,
  frameCount:0,
  startRecording:function(){
    this.zip = new JSZip();
    this.frameCount = 0;
    this.recording = true;
  },
  recordFrame:function(){
    var svgData = document.getElementById("pt_svg").outerHTML;
    var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    this.zip.file('frame-'+this.frameCount+'.svg', svgBlob);
    this.frameCount++;
  },
  stopRecording:function(){
    this.zip.generateAsync({type:"blob"}).then(function(content) {
      // see FileSaver.js
      saveAs(content, "frames.zip");
    });
  }
}

var gui = new dat.GUI();
gui.add(controls, 'getData');
gui.add(controls, 'exportFrame');
gui.add(controls, 'startRecording');
gui.add(controls, 'stopRecording');






function run(){
  
  var space = new SVGSpace("pt", ready).setup({bgcolor: themes[controls.activeTheme].background});
  var form = new SVGForm( space );

  function rand(r) { return Math.random() * r - Math.random() * r; }


  //// 2. Create Elements
  function Ball(x, y, z, r, target, fill){
    Circle.apply(this, arguments);
    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.target = target;
    console.log(this.target)
    this.fill = fill;
  }
  Util.extend( Ball, Circle );

  Ball.prototype.animate = function( time, frame, ctx ) {

    form.enterScope(this);

    this.accelerateToTarget();

    this.velocity.add(this.acceleration.$divide(this.radius*10));
    // this.velocity.multiply(0.98);
    this.add(this.velocity);
    this.acceleration.set(0,0)

    form.fill( this.fill ).stroke( false );
    form.circle( this );
  }

  Ball.prototype.accelerateToTarget = function(){

    var diff = this.target.$subtract(this);
    diff.normalize();
    diff.multiply(0.5);
    this.acceleration = diff;

  }



  

  for(var i=0; i<data.length; i++){
    var dataPoint = data[i];
    var x = (space.size.x/data.length)*dataPoint[0];
    var y = (space.size.y/2)-(Math.random()*(space.size.y/4))+(space.size.y/8);
    var size = Math.pow(dataPoint[1], 4)/100000;
    var target = new Vector(x, y);

    var possibleColors = [themes[controls.activeTheme].primary, themes[controls.activeTheme].white, themes[controls.activeTheme].black]
    var fill = possibleColors[Math.floor(Math.random()*possibleColors.length)];

    var ball = new Ball(x, y+Math.random()*100, 0, size, target, fill);
    space.add(ball);
  }




  //// 3. Visualize, Animate, Interact
  space.add({
    animate: function(time, fps, context) {
      form.enterScope(this);
      // controls.export();
      if(capture.recording){
        capture.recordFrame();
      }
    },

    onMouseAction: function(type, x, y, evt) {
      if (type=="move") {

      }
    },

    onTouchAction: function(type, x, y, evt) {
      this.onMouseAction( type, x, y );
    }

  });


  // 4. Start playing
  // Here we need to make sure the svg dom is ready first, via callback function (see constructor SVGSpace(...))
  function ready(bounds, elem) {
    $('#pt_svg').attr('width', window.innerWidth);
    $('#pt_svg').attr('height', window.innerHeight);
    form.scope("item", elem ); // initiate the scope which uses the svg dom as parent node
    space.bindMouse();
    space.bindTouch();
    space.play();
  }


}





//// 1. Create dat gui









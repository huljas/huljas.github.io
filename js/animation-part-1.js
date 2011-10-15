var ctx;
var canvasObj;
var fps = 30;
var stars = [];
var starCount = 30;

var Animation = {
  
  init : function(id) {  
    canvasObj = document.getElementById(id);
    if (canvasObj.getContext) {
        ctx = canvasObj.getContext("2d");
    }
    if (ctx) {
      for (var i = 0; i < starCount; i++) {
	var x = 0 + Math.random() * canvasObj.width;
	var y = 0 + Math.random() * canvasObj.height;
	var r = 0 + Math.random() * Math.PI * 2;
	var outR = 6 + Math.random() * 14;
	var inR = outR / 3.12;
	var vx = Math.random() * 50;
	if (Math.random() < 0.5) vx = -vx;
	var vy = Math.random() * 50;
	if (Math.random() < 0.5) vy = -vy;	
	var vr = Math.random() * Math.PI * 2;
	if (Math.random() < 0.5) vr = -vr;
	  
	var star = new Star(x, y, r, outR, inR, vx, vy, vr);
	stars.push(star);
      }
      
      Animation.draw();  
      setInterval(Animation.draw, 1000/fps);  
    }
  },  
  
  draw: function() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasObj.width, canvasObj.height);

    ctx.strokeStyle = "#b0b0ff";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#ccccff";
    
    for (i in stars) {    
	stars[i].draw(ctx);
    }
  },
  
  drawStar : function(ctx, x, y, outR, inR, rotation) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
        var radians = rotation + i * 2*Math.PI/10;

        var radius = i % 2 == 0 ? outR : inR;

        var _x = x + Math.cos(radians) * radius;
        var _y = y + Math.sin(radians) * radius;

        if (i == 0) {
            ctx.moveTo(_x, _y);
        } else {
            ctx.lineTo(_x, _y);
        }
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
};

function Star(x,y,rotation,outR,inR,vx,vy,vr) {
  this.x = x;
  this.y = y;
  this.outR = outR;
  this.inR = inR;
  this.rotation = rotation;
  this.vx = vx;
  this.vy = vy;
  this.vr = vr;
  
  this.draw = function(ctx) {
    this.x += this.vx / fps;
    this.y += this.vy / fps;
    this.rotation += this.vr / fps;
    if (this.x - this.outR > canvasObj.width) this.x = 0 - this.outR;
    if (this.x + this.outR < 0) this.x = canvasObj.width + this.outR;
    if (this.y - this.outR > canvasObj.height) this.y = 0 - this.outR;
    if (this.y + this.outR < 0) this.y = canvasObj.height + this.outR;
    Animation.drawStar(ctx, this.x, this.y, this.outR, this.inR, this.rotation);
  };  
}



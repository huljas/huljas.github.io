
var ForkMeSun = {

  ctx : null,
  canvasObj : null,
  fps : 12,
  stars : [],
  img : null,
  
  init : function(id) {
    ForkMeSun.canvasObj = document.getElementById(id);
    if (ForkMeSun.canvasObj.getContext) {
      ForkMeSun.ctx = ForkMeSun.canvasObj.getContext("2d");
    }
    if (ForkMeSun.ctx) {
      var speed = 0.5;
      var outer = new Star2(30, 75, 75, 0, 70, 62, 0, 0, speed, "#443", "#eea", 1);
      ForkMeSun.stars.push(outer);
      var inner = new Star2(30, 75, 75, 0, 60, 54, 0, 0, -speed, "#ddb", "#ffd", 2);
      ForkMeSun.stars.push(inner);
      var img = new Image()
      ForkMeSun.img = img;
      img.addEventListener('load', function(e) {
	ForkMeSun.draw();
	setInterval(ForkMeSun.draw, 1000/ForkMeSun.fps);
      }, true);
      img.src="/images/bg-page-2.png"
    }
  },
  
  draw: function() {
    var ctx = ForkMeSun.ctx;
    ctx.fillStyle = ctx.createPattern(ForkMeSun.img, 'repeat')
    ctx.fillRect(0, 0, ForkMeSun.canvasObj.width, ForkMeSun.canvasObj.height);

    ctx.strokeStyle = "#b0b0ff";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#ccccff";
    
    for (i in ForkMeSun.stars) {
      ForkMeSun.stars[i].draw(ctx);
    }

    ctx.save();

    ctx.lineWidth = 1;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = "#000";
    ctx.font = "32px 'Dorsa'";
    ctx.textBaseline = 'middle';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.rotate(-Math.PI*2/8);
    ctx.fillStyle = '#26d';
    ctx.fillText('Fork me on GitHub', -48, 103);
    ctx.restore();
  },
  
  drawStar : function(ctx, points, x, y, outR, inR, rotation) {
    ctx.beginPath();
    for (var i = 0; i < points*2; i++) {
        var radians = rotation + i * Math.PI/points;

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

function Star2(points,x,y,rotation,outR,inR,vx,vy,vr,stroke,fill,lineWidth) {
  this.points = points;
  this.x = x;
  this.y = y;
  this.outR = outR;
  this.inR = inR;
  this.rotation = rotation;
  this.vx = vx;
  this.vy = vy;
  this.vr = vr;
  if (stroke) this.stroke = stroke;
  else this.stroke = "#000000";
  if (fill) this.fill = fill;
  else this.fill = "#ffffff";
  if (lineWidth) this.lineWidth = lineWidth;
  else this.lineWidth = 1;
  
  
  this.draw = function(ctx) {
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fill;

    this.x += this.vx / ForkMeSun.fps;
    this.y += this.vy / ForkMeSun.fps;
    this.rotation += this.vr / ForkMeSun.fps;
    if (this.x - this.outR > ForkMeSun.canvasObj.width) this.x = 0 - this.outR;
    if (this.x + this.outR < 0) this.x = ForkMeSun.canvasObj.width + this.outR;
    if (this.y - this.outR > ForkMeSun.canvasObj.height) this.y = 0 - this.outR;
    if (this.y + this.outR < 0) this.y = ForkMeSun.canvasObj.height + this.outR;
    ForkMeSun.drawStar(ctx, points, this.x, this.y, this.outR, this.inR, this.rotation);
  };
}
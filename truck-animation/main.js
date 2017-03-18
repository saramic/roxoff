var minX, minY, multXY;
window.onload = function()
{
	x = 0;
	y = 0;
	speed = 5;
	angle = 0;
	mod = 0;
	
  cX = canvas.width;
  cY = canvas.height;
  northings = _.remove(_.map(_.keys(MinetecLocations), function(x) {
    return parseInt(MinetecLocations[x]['northing'])
  }), function(x) {
    return x !== 0
  });
  eastings = _.remove(_.map(_.keys(MinetecLocations), function(x) {
    return parseInt(MinetecLocations[x]['easting'])
  }), function(x) {
    return x !== 0
  });
  minY = Math.min.apply(null, northings);
  maxY = Math.max.apply(null, northings);
  minX = Math.min.apply(null, eastings);
  maxX = Math.max.apply(null, eastings);
  multY = parseFloat(maxY - minY)/parseFloat(cY);
  multX = parseFloat(maxX - minX)/parseFloat(cX);
  multXY = multY > multX ? multY : multX;

  //MinetecLocations
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	car = new Image();
    car.src="myimage.png";

    window.addEventListener("keydown", keypress_handler, false);
    window.addEventListener("keyup", keyup_handler, false);

  locations(canvas, context);
	var move = setInterval(function()
	{
		draw();
	}, 30);
};

function dot(context, x, y) {
  context.rect(x, y, 2, 2);
           context.fillStyle = "black";
           context.fill();
}


function fromEasting(easting) {
    return (easting - minX)/multXY;
}
function fromNorthing(northing) {
    return (northing - minY)/multXY;
}
function locations(canvas, context) {
  Object.keys(MinetecLocations).forEach(function(x) {
    y = fromNorthing(MinetecLocations[x]['northing']);
    x = fromEasting(MinetecLocations[x]['easting']);
    console.log(parseInt(x), parseInt(y));
    dot(context, parseInt(x), parseInt(y));
  });
}

function draw()
{
	context = canvas.getContext("2d");
	//context.clearRect(0, 0, 800, 800);

	context.fillStyle = "rgb(200, 100, 220)";
	context.fillRect(50, 50, 100, 100);

	x += (speed*mod) * Math.cos(Math.PI/180 * angle);
	y += (speed*mod) * Math.sin(Math.PI/180 * angle);

	context.save();
	context.translate(x, y);
	context.rotate(Math.PI/180 * angle);
	context.drawImage(car, -(car.width/2), -(car.height/2));	
	context.restore();
}

function keyup_handler(event)
{
	if(event.keyCode == 87 || event.keyCode == 83)
	{
		mod = 0;
	}
}

function keypress_handler(event)
{
	if(event.keyCode == 87)
	{
		mod = 1;
	}
	if(event.keyCode == 83)
	{
		mod = -1;
	}
	if(event.keyCode == 65)
	{
		angle -= 5;
	}
	if(event.keyCode == 68)
	{
		angle+=5;
	}
}

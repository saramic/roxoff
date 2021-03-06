var minX, minY, multXY;
window.onload = function()
{
	x = 0;
	y = 0;
	speed = 5;
	angle = 0;
	modX = 0;
	modY = 0;
	
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
	canvas = document.getElementById("bg");
	context = canvas.getContext("2d");

	canvasFg = document.getElementById("canvas");
	contextFg = canvasFg.getContext("2d");

	loaderImg = new Image();
    loaderImg.src="r1700_cat_sml.png";

	map = new Image();
    map.src="map_locations.png";

    window.addEventListener("keydown", keypress_handler, false);
    window.addEventListener("keyup", keyup_handler, false);

  locations(canvas, context);

  Object.keys(MinetecLocations).forEach(function(x) {
    MinetecLocations[x]['y'] = fromNorthing(MinetecLocations[x]['northing']);
    MinetecLocations[x]['x'] = fromEasting(MinetecLocations[x]['easting']);
  });
  showLoader(canvas, context);
	//context.drawImage(map, -100, -300);

	var move = setInterval(function()
	{
		draw();
	}, 30);
};

function invalidBeacon(beacon)  {
  return beacon.x == undefined || beacon.y == undefined;
}


function showLoader(canvas, context) {
  var nextCoordinates = [LoaderMovement.shift(),LoaderMovement.shift(), LoaderMovement.shift(),LoaderMovement.shift()];
 
  var beacon1 = getMinetecBeaconCoordinates(nextCoordinates[0] || {});
  var beacon2 = getMinetecBeaconCoordinates(nextCoordinates[1] || {});
  var beacon3 = getMinetecBeaconCoordinates(nextCoordinates[2] || {});
  var beacon4 = getMinetecBeaconCoordinates(nextCoordinates[3] || {});

  if(invalidBeacon(beacon1) || invalidBeacon(beacon2) || invalidBeacon(beacon3)) {
    return;
  }

  context.beginPath();
  context.arc(beacon1.x, beacon1.y, nextCoordinates[0]['Range (cm?)']/multXY/100.0, 0, 2 * Math.PI, false);
  context.stroke();
  context.closePath();


  context.beginPath();
  context.arc(beacon2.x, beacon2.y,nextCoordinates[0]['Range (cm?)']/multXY/100.0, 0, 2 * Math.PI, false);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.arc(beacon3.x, beacon3.y,nextCoordinates[0]['Range (cm?)']/multXY/100.0, 0, 2 * Math.PI, false);
  context.stroke();
  context.closePath();

  Trilateration.beacons = [];
  Trilateration.addBeacon(0, Trilateration.vector(beacon1.x, beacon1.y));
  Trilateration.addBeacon(1, Trilateration.vector(beacon2.x, beacon2.y));
  Trilateration.addBeacon(2, Trilateration.vector(beacon3.x, beacon3.y));
  //Trilateration.addBeacon(2, Trilateration.vector(beacon4.x, beacon4.y));
  Trilateration.setDistance(0, nextCoordinates[0]['Range (cm?)']/multXY/100.0);
  Trilateration.setDistance(1, nextCoordinates[1]['Range (cm?)']/multXY/100.0);
  Trilateration.setDistance(2, nextCoordinates[2]['Range (cm?)']*multXY/100.0); // TODO why is this reverse?
  var pos = Trilateration.calculatePosition();
	context.drawImage(loaderImg, pos.x, pos.y);
  /*
  context.beginPath();
  context.rect(pos.x, pos.y, 10, 10);
  context.fillStyle = 'red';
  context.fill();
  context.closePath();
  */
};

function getMinetecBeaconCoordinates(coordinates) {
  return {
    'x': (MinetecLocations[coordinates['Tag 2 ID']] || {})['x'],
    'y': (MinetecLocations[coordinates['Tag 2 ID']] || {})['y']
  }
};

function dot(context, x, y, color) {
  context.rect(x, y, 2, 2);
  context.fillStyle = color;
  context.fill();
}

function fromEasting(easting) {
    return (easting - minX)/multXY;
}
function fromNorthing(northing) {
    return (northing - minY)/multXY;
}
function locations(canvas, context) {
  Object.keys(MinetecLocations).forEach(function(tagId) {
    y = fromNorthing(MinetecLocations[tagId]['northing']);
    x = fromEasting(MinetecLocations[tagId]['easting']);
    context.fillText(tagId,x,y+10);
    //console.log(parseInt(x), parseInt(y));
    dot(context, parseInt(x), parseInt(y), 'black');
  });
}

function draw()
{
	context = canvasFg.getContext("2d");

  context.clearRect(0, 0, 800, 800);
  //showLoader(canvas, context);

	x += (speed*modX);// * Math.cos(Math.PI/180 * angle);
	y += (speed*modY);// * Math.sin(Math.PI/180 * angle);

	context.save();
	context.translate(x, y);
	//context.rotate(Math.PI/180 * angle);
	context.drawImage(loaderImg, 100, 100);
	context.restore();
}

function keyup_handler(event)
{
  modX = 0;
  modY = 0;
}

function keypress_handler(event)
{
  // vi keys
	if(event.keyCode == 75)
	{
		modY = 1;
	}
	if(event.keyCode == 73)
	{
		modY = -1;
	}
	if(event.keyCode == 76)
	{
		modX = 1;
	}
	if(event.keyCode == 74)
	{
		modX = -1;
	}
}

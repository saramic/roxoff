window.Trilateration = {};
Trilateration.beacons = [];
Trilateration.sqr = function(a) {
  return Math.pow(a, 2);
};

Trilateration.vector = function(x, y) {
  return {
    x: x,
    y: y
  };
};

Trilateration.setDistance = function(index, distance) {
  Trilateration.beacons[index].dis = distance;
};

Trilateration.addBeacon = function(index, position) {
  Trilateration.beacons[index] = position;
};

Trilateration.calculatePosition = function() {
  var j, k, x, y;
  if (Trilateration.beacons.length < 3) {
    console.error("Error! Please add at least three Trilateration.beacons!");
    return Trilateration.vector(0, 0);
  }
  k = (Trilateration.sqr(Trilateration.beacons[0].x) + Trilateration.sqr(Trilateration.beacons[0].y) - Trilateration.sqr(Trilateration.beacons[1].x) - Trilateration.sqr(Trilateration.beacons[1].y) - Trilateration.sqr(Trilateration.beacons[0].dis) + Trilateration.sqr(Trilateration.beacons[1].dis)) / (2 * (Trilateration.beacons[0].y - Trilateration.beacons[1].y)) - (Trilateration.sqr(Trilateration.beacons[0].x) + Trilateration.sqr(Trilateration.beacons[0].y) - Trilateration.sqr(Trilateration.beacons[2].x) - Trilateration.sqr(Trilateration.beacons[2].y) - Trilateration.sqr(Trilateration.beacons[0].dis) + Trilateration.sqr(Trilateration.beacons[2].dis)) / (2 * (Trilateration.beacons[0].y - Trilateration.beacons[2].y));
  j = (Trilateration.beacons[2].x - Trilateration.beacons[0].x) / (Trilateration.beacons[0].y - Trilateration.beacons[2].y) - (Trilateration.beacons[1].x - Trilateration.beacons[0].x) / (Trilateration.beacons[0].y - Trilateration.beacons[1].y);
  x = k / j;
  y = ((Trilateration.beacons[1].x - Trilateration.beacons[0].x) / (Trilateration.beacons[0].y - Trilateration.beacons[1].y)) * x + (Trilateration.sqr(Trilateration.beacons[0].x) + Trilateration.sqr(Trilateration.beacons[0].y) - Trilateration.sqr(Trilateration.beacons[1].x) - Trilateration.sqr(Trilateration.beacons[1].y) - Trilateration.sqr(Trilateration.beacons[0].dis) + Trilateration.sqr(Trilateration.beacons[1].dis)) / (2 * (Trilateration.beacons[0].y - Trilateration.beacons[1].y));
  return Trilateration.vector(x, y);
};

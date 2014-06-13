var interval = setInterval("rotator()", 20);
var count = 0;
var distance = 2;
var distanceIncrement = true;

function rotator() {
  $('#rotator').get(0).style.webkitTransform = "rotateY("+count+"deg)";
  $('#bounce').get(0).style.webkitTransform = "translateZ("+distance/10+"em)";

  if (count == 359) {
    count = 0;
  } else {
    count++;
  }

  if (distanceIncrement) {
    distance++;
  } else {
    distance--;
  }

  if(distance == 100 || distance == 1) {
    distanceIncrement = !distanceIncrement;
  }

}

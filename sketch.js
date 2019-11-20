var myStar;
var num_star = 800;
var allStars = [];
var hit = 0;
var hitwig = 0;
var odibeeSans;
var safeDur = 50;
let button;

function preload() {
  odibeeSans = loadFont("OdibeeSans-Regular.ttf");
}

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
  perspective(PI / 2.0, width / height, 0.01, 50000);
  // setAttributes('antialias', true);
  colorMode(HSB);
  angleMode(DEGREES);

  //CREATE THE CUBE SPACE
  for (var i = 0; i < num_star; i++) {
    var stars = new star(200, random() * 120 + 120, color(random(220, 280), random(40) + 40, 100));
    allStars.push(stars);
  }
  // noCursor();
  frameRate(60);
}

function touchMoved() {
  return false;//CANVAS NO MOVING
}

function touchEnded() {
  DeviceOrientationEvent.requestPermission()//MOBILE PHONE GYRO
}

function draw() {
  // console.log("H=" + hitwig);
  // console.log("S=" + safeDur);
  background(0);
  var score = frameCount;
  safeDur = constrain(safeDur + 1, 0, 100);//MAKE COLLISION COUNT ONLY ONCE
  elx = constrain(map(rotationY, -20, 20, 1, width), 1, width);//X POSITION
  ely = constrain(map(rotationX, 10, 60, 1, height), 1, height);//Y POSITION

  // DRAW A SPACESHIP
  push();
  translate(elx - width / 2 + random(hitwig / 3), ely - height / 2 + random(hitwig / 3), 500);
  rotateY(180);
  rotateX(90);
  rotateY((elx - width / 2) / 10);
  stroke(frameCount % 360, 255, 255);
  strokeWeight(15);
  noFill();
  scale(1, 1, 0.5);
  cone(50, 300, 3, 1, 0);
  translate(0, -50, 0);
  scale(1, 1, 0.2);
  cone(200, 100, 3, 1, 0);
  pop();

  //HP & SCORE
  push();
  translate(elx - width / 2, ely - height / 2, -200);
  fill(255);
  rect(400, 0, 15, hitwig * 5 - 375);
  textFont(odibeeSans);
  textSize(100);
  textAlign(RIGHT);
  text('HP', 460, 120);
  text('SCORE: ' + score, -350, 120);
  noFill();
  pop();


  //COLLISION: CANVAS WIGGLE
  hitwig = constrain(hitwig - 0.3, 0, 75);
  myCanvas.position(random(hitwig / 3), random(hitwig / 3));

  for (var i = 0; i < allStars.length; i++) {
    // SHOW THE CUBESPACE
    var b = allStars[i];
    b.move();
    b.display();
    b.acc();
  }
  if (hitwig == 75 && hit > 5) {
    // Game Over & SCORE
    noLoop();
    clear();
    background(255);
    fill(0);
    textFont(odibeeSans);
    textAlign(CENTER);
    textSize(200);
    text('GAME OVER', 0, -200);
    textSize(100);
    text('YOUR SCORE: ' + score, 0, 100);

    // Restart Button
    button = createButton('Restart');
    button.size(width/4,100);
    button.style('font-size',300);
    button.style('margin','auto');
    button.style('width','25%');
    button.position(width*0.375, height / 2 + 300);
    button.mousePressed(restt);
  }
}
function restt() {
  // Restart Button
  location.reload();
}

function star(_speed, _size, _color) {
  this.x = random(-8, 8) * windowWidth;
  this.y = random(-8, 8) * windowHeight;
  this.z = random(-50000);
  this.speed = _speed;
  this.color = _color;
  this.size = _size;
  var zpos = this.z;
  var spd = this.speed;
  this.acc = function () {
    spd += 0.1;//acceleration
  }
  this.move = function () {
    if (zpos < 0) {
      zpos += spd;//CUBE MOVE
    } else {
      this.x = random(-8, 8) * windowWidth;
      this.y = random(-8, 8) * windowHeight;
      zpos -= 50000;//CUBE WILL REBORN AT RANDOM POSITION
    }
  }
  var randomAngle = random(360);//RANDOM CUBE ORIENTATION
  this.display = function () {
    stroke(this.color);
    strokeWeight(5);
    noFill();

    push();
    translate(this.x, this.y, zpos);

    //CUBES ROTATE
    rotateX(frameCount + randomAngle);
    rotateY(frameCount + randomAngle);

    //CREATE CUBE
    box(this.size);

    //COLLISION: CACULATE DISTANCE BETWEEN SPACESHIP & CUBES
    var dis = dist(this.x, this.y, zpos, elx - width / 2, ely - height / 2, 0);
    if (dis < 250 && safeDur > 35) {
      hit++;
      hitwig += spd / 10;
      safeDur -= 49;//COLLISION SHOULD COUNTED ONLY ONCE
      console.log(hit);
    }
    pop();
  }
}

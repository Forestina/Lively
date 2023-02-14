/*
 * @Author: Mei Zhang
 * @Date: 2022-12-31 11:18:48
 * @LastEditTime: 2023-01-13 22:53:49
 * @Operation guidelines: 
 * 1.	Allow camera to capture video
 * 2.	Wave hands to reach 4 corners of the video, make sure closer enough to be detected
 *        Green area -> generate trees (Spring)
          Yellow area -> generate fireflies (Summer)
          Blue area -> generate fruits (Autumn)
          Light blue area -> generate wind (Winter)
 * 3.	Press SPACE to refresh the page.
 * Original work by Mei Zhang.

 * @Reminder:
 * Different zoom scale or browser affects sketch layout seriously.
 * The default threshold is in full darkness and the light source is in the front (night light). Change the threshold if the ambient light is different.
 */


//properties of the original sketch
let canvasWidth = 800;
let canvasHight = 1000;

//properties of state Yellow
let myX = canvasWidth / 2, myY = canvasHight / 2;//current value
let myX2 = canvasWidth / 2, myY2 = canvasHight / 2;//current value
let x = 0, y = 0, vx = 1, vy = 1;
let xoff = 0.0;
let theBubble;

//properties of state Green
let tree_clrR = 35, tree_clrG = 64, tree_clrB = 35;
let start = 0, drawer = 0;
let messager = null;//to store the camera captured human action

//light threshold control
let visualThreshold = 160;//test result: night>160, day<100




//class of state Yellow (bubble symbolizes fire fly)
class Bubble {
  constructor(_x, _y, _clrR, _clrG, _clrB) {
    this.xPos = _x;
    this.yPos = _y;
    this.clrR = _clrR;
    this.clrG = _clrG;
    this.clrB = _clrB;
  }
  display(_size) {
    noStroke();
    fill(this.clrR, this.clrG, this.clrB);
    ellipse(this.xPos, this.yPos, _size, _size);
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHight);
  background(0);

}

//actions of waving hands to different colors of camera filter
function draw() {

  //fade effect, only draw the fog evey 48 frames
  if (frameCount % 48 == 0) drawFog();


  //wave hands to yellow area, generate breeding bubbles as the track of fire fly
  if (messager == 'Yellow') {
    ellipseBreed();

  }

  //wave hands to blue area, generate randomly placing bubble groups as the fruits
  if (messager == 'Blue') {

    noStroke();
    fill(seasonExe('Spring', 'r'), seasonExe('Spring', 'g'), seasonExe('Spring', 'b'), generate("alpha"));
    drawbubble();
  }

  //wave hands to green area, generate branches as the tree
  if (messager == 'Green') {

    //frameRate(3);
    translate(width / 2, height);
    stroke(tree_clrR, tree_clrG, tree_clrB);
    if (frameCount % 8 == 0) {
      drawTree();
    }
  }

  //wave hands to light blue area, generate beizel graph as the blowing wind
  if (messager == 'LightBlue') {

    if (frameCount % 4 == 0) drawFog();

    fill(255, 255, 255, 10);

    noiseDraw();
  }

  //set Space to be keys to start again
  if (key == ' ') {
    //refresh the page
    location.replace(location.href);
  }
}

//logic of state 1, to set fire fly playing field
function ellipseBreed() {
  bubblePlay(myX, myY);
  myX += generate('edge') * vx;
  myY += generate('edge') * vy;

  // add velocity,check bounds
  if (myX <= 100 || myX >= canvasWidth - 100) {
    vx *= -1;
  }

  if (myY <= 100 || myY >= canvasHight - 100) {
    vy *= -1;
  }
}

//execution of state 1, to generate fire flys
function bubblePlay(x, y) {
  theBubble = new Bubble(x, y, seasonExe('Summer', 'r'), seasonExe('Summer', 'g'), seasonExe('Summer', 'b'));

  theBubble.display(generate('size'));
}

//logic of state 2, to set fruit group play field
function drawbubble() {
  push();
  translateLast(-200, -200);
  bubbleSpread(generate("circleDiameter"), generate("angle"));
  pop();
}

//execution of state 2, to generate fruits
function bubbleSpread(diameter, theta) {
  push();
  rotate(theta); // rotate to the angle provided
  strokeWeight(diameter * 0.1);
  circle(0, 0, diameter);// draw bubble branch4567
  translate(diameter, 0); // and move to its edge

  if (diameter > 10) { // stop condition - very important!
    let newAng = random(PI * 0.5); // create new angle
    let newDiameter = diameter * random(0.4, 0.8); // create new length

    for (let i = 0; i < 5; i++) {
      stroke(seasonExe('Winter', 'r'), seasonExe('Winter', 'g'), seasonExe('Winter', 'b'), generate("alpha"));
      bubbleSpread(newDiameter * random(0.8, 1.2), newAng * i);
    }

  }
  else {
  }
  pop();
}

//tool function, recusive function to translate based on the last one
function translateLast(x, y) {

  translate(x, y);

  if (x < 100) { // stop condition
    let newX = random(100, 400); // create new X

    translateLast(newX, y);


  }
  if (y < 100) {
    let newY = random(100, 400); // create new Y
    translateLast(x, newY);
  }
}

//logic of state 3, to set basic tree properties
function drawTree() {
  let branchLenth = random(100, 150);
  let branchAngle = -PI * 0.5;

  push();
  branch(branchLenth, branchAngle); // initial length and facing up
  pop();
}

//execution of state 3, recusive function to generate branches
function branch(len, theta) {
  push();
  rotate(theta); // rotate to the angle provided
  strokeWeight(sqrt(len) * 0.5);
  line(0, 0, len, 0); // draw one branch
  translate(len, 0); // and move to its edge


  if (len > 5.0) { // stop condition, threshold, more then start

    let newAng = random(PI * 0.25); // create new angle
    let newLen = len * random(0.6, 0.9); // create new length

    //set graduated color, be different each time play
    if (tree_clrB <= 64) tree_clrB++;
    else if (tree_clrR >= 35) tree_clrR--;
    else if (tree_clrG <= 64) tree_clrG++;
    stroke(tree_clrR, tree_clrG, tree_clrB);

    branch(newLen * random(0.8, 1.2), - newAng); // left branch
    branch(newLen * random(0.8, 1.2), newAng);   // right branch
  } else {//less then stop
    ellipse(0, 0, 4, 4); // draw a leaf
  }
  pop();
}

//logic of state 4, to set wind play field
function noiseDraw() {
  stroke(seasonExe('Winter', 'r'), seasonExe('Winter', 'g'), seasonExe('Winter', 'b'))

  xoff = xoff + 0.01;
  let n = noise(xoff) * width;

  bezierDraw(-n, -n);

}
//execution of state 4, to generate bezier graphs
function bezierDraw(x1, y1) {
  //y=kx+b
  x2 = generate('coordinate_x');
  k = generate('bezierK');
  y2 = k * x2 + generate('bezierB');

  x3 = generate('coordinate_x');
  y3 = k * x3 + generate('bezierB');

  x4 = generate('coordinate_x');
  y4 = k * x4 + generate('bezierB');

  bezier(x1, y1, x2, y2, x3, y3, x4, y4);

}

// fade effect, fog is a slightly opaque rectangle over the entire window
function drawFog() {
  push();
  fill(32, 16);
  noStroke();
  rect(0, 0, width, height);
  pop();
}

//tool function, dictionary of generating a random integrate value by name
function generate(name) {
  switch (name) {
    case 'ellipse':
      return Math.floor(random(0, 2 * PI));
    case 'x':
      return Math.floor(random(0, canvasWidth));
    case 'y':
      return Math.floor(random(0, canvasHight));
    case 'size':
      return Math.floor(random(1, 10));
    case 'opacity':
      return Math.floor(random(0, 100));
    case 'edge':
      return Math.floor(random(-10, 10));

    //beizel properties
    case 'coordinate_x':
      return Math.floor(random(-50, canvasWidth));
    case 'coordinate_y':
      return Math.floor(random(-50, canvasHight));
    case 'bezierK':
      return Math.floor(random(1, 10));
    case 'bezierB':
      return Math.floor(random(5, 500));
    case 'choise':
      return Math.floor(random(0, 2));

    //bubble properties
    case 'circleDiameter':
      return Math.floor(random(1, 50));
    case 'angle':
      return Math.floor(random(0, 2 * PI));
    case 'onCanvasX':
      return Math.floor(random(0, canvasWidth));
    case 'onCanvasY':
      return Math.floor(random(0, canvasHight));
    case 'alpha':
      return Math.floor(random(0, 100));

  }
}

//tool function, dictionary of grouped colors(four seasons), generating a random integrate color R,G,B value
function seasonExe(season, rgb) {

  var results;
  if (season == 'Spring') {
    if (rgb == 'r') results = Math.floor(random(150, 255));
    else if (rgb == 'g') results = Math.floor(random(90, 200));
    else if (rgb == 'b') results = Math.floor(random(0, 120));

  }
  else if (season == 'Summer') {
    if (rgb == 'r') results = Math.floor(random(0, 170));
    else if (rgb == 'g') results = Math.floor(random(130, 2000));
    else if (rgb == 'b') results = Math.floor(random(150, 255));

  }
  else if (season == 'Autumn') {
    if (rgb == 'r') results = Math.floor(random(150, 255));
    else if (rgb == 'g') results = Math.floor(random(90, 200));
    else if (rgb == 'b') results = Math.floor(random(0, 120));
  }
  else if (season == 'Winter') {
    if (rgb == 'r') results = Math.floor(random(0, 50));
    else if (rgb == 'g') results = Math.floor(random(0, 160));
    else if (rgb == 'b') results = Math.floor(random(100, 200));
  }
  else if (season == 'Winter_plus') {
    if (rgb == 'r') results = Math.floor(random(200, 255));
    else if (rgb == 'g') results = Math.floor(random(200, 255));
    else if (rgb == 'b') results = Math.floor(random(200, 255));

  }
  return results;
}


//Instance mode, create p5 object namespace
//video sketch
var sketch_1_Video = function (p) {

  p.video;
  p.vScale = 16;

  //counters for controlling area of different colors 
  p.greenCounter = 0;
  p.yellowCounter = 0;
  p.blueCounter = 0;
  p.lightBlueCounter = 0;

  p.setup = function () {

    p.createCanvas(canvasWidth, 480);

    p.pixelDensity(1);//high pixel density
    p.video = p.createCapture(p.VIDEO);
    p.video.size(p.width / p.vScale, p.height / p.vScale);

    p.video.hide();

  }
  p.draw = function () {

    p.background(51);
    p.video.loadPixels();
    p.loadPixels();
    for (p.y = 0; p.y < p.video.height; p.y++) {
      for (p.x = 0; p.x < p.video.width; p.x++) {
        p.index = (p.x + p.y * p.video.width) * 4;
        p.r = p.video.pixels[p.index + 0];
        p.g = p.video.pixels[p.index + 1];
        p.b = p.video.pixels[p.index + 2];

        p.bright = (p.r + p.g + p.b) / 3;

        p.w = p.map(p.bright, 0, 255, 0, p.vScale);

        p.noStroke();

        //set filters of differet colors
        if (p.x < 15 && p.y < 15) {//left up
          p.fill(0, p.bright, 0);//color green
          p.greenJudge();
        }
        else if (p.x > p.video.width - 15 && p.y > p.video.height - 15) {//right down
          p.fill(p.bright, p.bright, 0);//color yellow
          p.yellowJudge();

        }
        else if (p.x < 15 && p.y > p.video.height - 15) {//left down
          p.fill(0, 0, p.bright);//color blue
          p.blueJudge();

        }
        else if (p.x > p.video.width - 15 && p.y < 15) {//right uo
          p.fill(0, p.bright, p.bright);//color light blue
          p.lightblueJudge();

        }
        else {
          p.fill(p.bright);//the other area filled by brightness
        }

        p.rect(p.x * p.vScale, p.y * p.vScale, p.w, p.w);//rect filter


        p.pixels[p.index + 0] = p.r;
        p.pixels[p.index + 1] = p.g;
        p.pixels[p.index + 2] = p.b;
        p.pixels[p.index + 3] = 255;
      }
    }
  }

  //to judge if the area is being interacted, and store massages
  p.greenJudge = function () {
    if (p.bright > visualThreshold) {//"<"in day light, ">" in night light
      p.greenCounter++;

      //reacting delay
      if (p.greenCounter >= 70) {//enough pixel is being interacted
        p.greenCounter = 0;

        messager = 'Green';
      }
    }
  }
  p.yellowJudge = function () {
    if (p.bright > visualThreshold) {
      p.yellowCounter++;

      //reacting delay
      if (p.yellowCounter >= 70) {
        p.yellowCounter = 0;

        messager = 'Yellow';
      }
    }
  }
  p.blueJudge = function () {
    if (p.bright > visualThreshold) {
      p.blueCounter++;

      //reacting delay
      if (p.blueCounter >= 70) {
        p.blueCounter = 0;

        messager = 'Blue';
      }
    }
  }
  p.lightblueJudge = function () {
    if (p.bright > visualThreshold) {
      p.lightBlueCounter++;

      //reacting delay
      if (p.lightBlueCounter >= 70) {
        p.lightBlueCounter = 0;

        messager = 'LightBlue';
      }
    }
  }
}//template of sketch_1 draft

//data sketch
var sketch_2_Data = function (p) {

  p.canvasWidth = 800;
  p.canvasHight = 520;

  p.setup = function () {
    p.cnv = p.createCanvas(p.canvasWidth, p.canvasHight);
    p.background(0);
    p.cnv.position(1117, 53);//set canvas position

  }

  //logic of showing the corresponding words, by judge messager stored in video sketch
  p.draw = function () {
    if (frameCount % 8 == 0) p.drawFog();
    switch (messager) {
      case 'Green':
        p.fill(seasonExe('Spring', 'r'), seasonExe('Spring', 'g'), seasonExe('Spring', 'b'), generate("alpha"));
        p.myPrint('Flourish');
        break;
      case 'Yellow':
        p.fill(seasonExe('Summer', 'r'), seasonExe('Summer', 'g'), seasonExe('Summer', 'b'), generate("alpha"));
        p.myPrint('Fire Fly');
        break;
      case 'Blue':
        p.fill(seasonExe('Autumn', 'r'), seasonExe('Autumn', 'g'), seasonExe('Autumn', 'b'), generate("alpha"));
        p.myPrint('Fruit');
        break;
      case 'LightBlue':
        p.fill(seasonExe('Winter', 'r'), seasonExe('Winter', 'g'), seasonExe('Winter', 'b'), generate("alpha"));
        p.myPrint('Wind');
        break;
    }
  }
  //execution of printing words
  p.myPrint = function (info) {

    p.strokeWeight(1);
    p.textSize(Math.floor(random(20, 60)));

    p.textAlign(CENTER);
    p.text(info, Math.floor(random(0, p.canvasWidth)), Math.floor(random(0, p.canvasHight)));
  }
  //fade effect
  p.drawFog = function () {
    p.push();
    p.fill(32, 16);
    p.noStroke();
    p.rect(0, 0, width, height);
    p.pop();
  }
}
//call the sketch instances
var myCanvas_1_Video = new p5(sketch_1_Video);
var myCanvas_2_Data = new p5(sketch_2_Data);
var score = 0;
var maxScore = 0;
var grid = 10;
var direction = "right"; // default direction
var speedGame = 160; // default speed game
//
var playGame = document.getElementById("playGame");
var play = document.getElementById("play");
var canvas = document.getElementById("canvas");
var myCanvasWidth = document.getElementById("myCanvas").getAttribute("width");
var myCanvasHeight = document.getElementById("myCanvas").getAttribute("height");
var gameOver = document.getElementById("gameOver");
var playAgain = document.getElementById("playAgain");
//
var myGameArea = {
  canvas : document.getElementById("myCanvas"),
  start : function(){
    this.canvas.width =Number(myCanvasWidth.substring(0, myCanvasWidth.lastIndexOf("px")));
    this.canvas.height = Number(myCanvasHeight.substring(0, myCanvasHeight.lastIndexOf("px")));
    this.context = this.canvas.getContext("2d");
    this.interval = setInterval(updateGameArea,100);
    window.addEventListener('keyup',function(event){ myGameArea.key = event.keyCode;})
  },
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function(){
    clearInterval(this.interval);
  }
}

function updateGameArea(){
  myGameArea.clear();
  snake.draw();
  food.draw();
  if(checkCollision(snake.cell[0],food)){
    score ++;
    snake.addCell();
    var xRandom = getRandomInt(1,myGameArea.canvas.width/grid);
    var yRandom = getRandomInt(1,myGameArea.canvas.width/grid);
    food.newPos(xRandom, yRandom);
  }
  var len = snake.len;
  for(i=1; i < len; i++){
    if(checkCollision(snake.cell[0],snake.cell[i])){
      myGameArea.stop();
      maxScore =  score > maxScore ? score : maxScore;
      canvas.setAttribute("style","display: none;");
      gameOver.setAttribute("style","display: block;");
      document.getElementById("maxScore").innerHTML = "Max score: " + maxScore;
    }
  }
  snake.move();
  drawText("Score: ", score, 2*grid, (myGameArea.canvas.height/grid -2)*grid );
  drawText("Max score: ", maxScore, (myGameArea.canvas.width/grid -12)*grid, (myGameArea.canvas.height/grid -2)*grid);
}


var snake = {
  len : 3,
  cell : [{x:2,y:0},{x:1,y:0},{x:0,y:0}],
  //add cell
  addCell : function(){
    var xTail = this.cell[this.len-1].x;
    var yTail = this.cell[this.len-1].y;
    this.len++;
    this.cell.push({
        x : xTail,
        y : yTail
      }
    );
  },
  //draw snake
  draw : function(){
    var ctx = myGameArea.context;
    var maxX = myGameArea.canvas.width/grid;
    var maxY = myGameArea.canvas.height/grid;
    for(var i=this.len-1; i>=0; i--){
      if(this.cell[i].x < 0){
        this.cell[i].x = maxX;
      }
      if(this.cell[i].x > maxX){
        this.cell[i].x = 0;
      }
      if(this.cell[i].y < 0){
        this.cell[i].y = maxY;
      }
      if(this.cell[i].y > maxY){
        this.cell[i].y = 0;
      }
      ctx.fillStyle = "white";
      ctx.fillRect(this.cell[i].x*grid, this.cell[i].y*grid, grid-1, grid-1);
      //console.log("i: "+i+", x: "+snake.cell[i].x+", y: "+snake.cell[i].y);
    }
  },
  //
  move : function(){
    var xHead = this.cell[0].x;
    var yHead = this.cell[0].y;
    //remove tail snake
    this.cell.pop();
    //get direction
    document.addEventListener("keydown",getDirection);
    if(direction == "right"){xHead ++;}
    else if(direction == "left"){xHead --;}
    else if(direction == "up"){yHead --;}
    else if(direction == "down"){yHead ++;}
    //create newHead snake
    var newHead = {
      x : xHead,
      y : yHead
    };
    //add head snake
    this.cell.unshift(newHead);
  },
  reSet : function(){
    this.cell.splice(3,this.len);
    this.len = 3;
  }
}
function getDirection(e){
  if(e.keyCode == 37 && direction != "right"){direction = "left";}
  else if(e.keyCode == 38 && direction != "down"){direction = "up";}
  else if(e.keyCode == 39 && direction != "left"){direction = "right";}
  else if(e.keyCode == 40 && direction != "up"){direction = "down";}
}

var food = {
  x : (myGameArea.canvas.width/grid)/2,
  y : (myGameArea.canvas.height/grid)/2,
  newPos : function(x, y){
    this.x = x;
    this.y = y;
  },
  draw : function(){
    ctx = myGameArea.context;
    ctx.fillStyle = "red";
    ctx.fillRect(this.x*grid, this.y*grid, grid-1, grid-1);
  }
}
//get interger random (min -> max)
function getRandomInt(min, max){
  return Math.floor(Math.random()*(max - min +1));
}
//
function checkCollision(obj1,obj2){
  var crash = false;
  if(obj1.x == obj2.x && obj1.y == obj2.y){
    crash = true;
  }
  return  crash;
}
// draw score and max score
function drawText(text, content, x, y){
  var ctx = myGameArea.context;
  ctx.fillStyle = "green";
  ctx.font ="15px cursive";
  ctx.fillText(text + content, x , y);
}

function start(){
  myGameArea.start();
}

function reStart(){
  score = 0;
  snake.reSet();
  myGameArea.start();
}
//event

// click play
play.onclick = function(){
  playGame.setAttribute("style","display: none;");
  canvas.setAttribute("style","display: block;");
  start();
};
// click play again
 playAgain.onclick = function(){
  canvas.setAttribute("style","display: block;");
  gameOver.setAttribute("style","display: none;");
  reStart();
};
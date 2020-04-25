"use strict";

//Global variables to be used on the game
let ctx;
let canvas;
let time;
let timeInterval;
let obstacleArray = []; //Array to store every object generated
let score;
let gameOverFlag = false;

//Global variables to define eatMan character start position and to be used on drawing functions
let eatManPositionX = 50;
let eatManPositionY = 50;

//Setting game sounds sources using constructor 
let gameSound = new Sound("soundtrack.mp3");
let coinSound = new Sound("coinsound.wav");
let bombsound = new Sound("bombsound.mp3");
let explosion2 = new Sound("explosion2.wav");

//Setting images sources
let background = new Image();
background.src = "blue_dark_sky.png"; //background
let eatMan = new Image();
eatMan.src = "eatman.png"; //eatMan character source
let bomb = new Image();
bomb.src = "bomb2.png"; //bomb source
let goldCoin = new Image();
goldCoin.src = "gold_coin3.png"; //gold coin source
let silverCoin = new Image();
silverCoin.src = "silver_coin2.png"; //silver coin source
let gameOver = new Image();
gameOver.src = "gameover.png"; //game over billboard source

//Setup function to be called on page load
function setup()    {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	ctx.drawImage(background, 0, 0);
}

//Play function to be called when play button clicked. When clicked set up new play
function play()	{
	gameOverFlag = false;
	eatManPositionX = 50;
	eatManPositionY = 50;
	time = 30;
	score = 0;
	obstacleArray = [];
	clearInterval(timeInterval);
	generateObstaclesPosition(); //generate random positions for gold and silver coins and the bombs
	draw();
	timeHandler();
	gameSound.play();
}

//Drawing function
function draw() {
	ctx.clearRect(0,0,1200,800);
	ctx.drawImage(background, 0, 0);
	drawObjects();
	drawEatMan(eatManPositionX, eatManPositionY);
}

//Function to randomize X position
function randomX()	{
	return Math.round((Math.random() * 1100) + 100);
}

//Function to randomize Y position
function randomY()	{
	return Math.round((Math.random() * 700) + 100);
}

//Draw EatMan
function drawEatMan(x, y) {
	ctx.drawImage(eatMan, x, y, 50, 50);
}

//Draw Bomb
function drawBomb(x, y)	{
	ctx.drawImage(bomb, x, y, 50, 50);
}

//Draw Gold Coin
function drawGoldCoin(x, y)	{
	ctx.drawImage(goldCoin, x, y, 50, 50);
}

//Draw Silver Coin
function drawSilverCoin(x, y)	{
	ctx.drawImage(silverCoin, x, y, 50, 50);
}

//Draw objects according to what we have stored on the array
function drawObjects()	{

	for (let index = 0; index < obstacleArray.length; index++) {
		if(obstacleArray[index].type == "gold"){
			drawGoldCoin(obstacleArray[index].x, obstacleArray[index].y);
		}
		else if(obstacleArray[index].type == "silver"){
			drawSilverCoin(obstacleArray[index].x, obstacleArray[index].y);
		}
		else{
			drawBomb(obstacleArray[index].x, obstacleArray[index].y);
		}
	}
}

//Loops for creating obstacles and store in the array
function generateObstaclesPosition(){
	for (let i = 1; i <= 20 ; i++)	{
		obstacleArray.push(new Obstacle(randomX(), randomY(), "gold"));
	}
	for (let i = 1; i <= 50 ; i++)	{
		obstacleArray.push(new Obstacle(randomX(), randomY(), "silver"));
	}
	for (let i = 1; i <= 20 ; i++)	{
		obstacleArray.push(new Obstacle(randomX(), randomY(), "bomb"));
	}
}

//Keyboad Event Handler Function
function keyboardEventHandler(event)	{
	let k = event.keyCode;

	if (eatManPositionX < 0)	{eatManPositionX =0}
	if (eatManPositionX > 1150)	{eatManPositionX=1150}
	if (eatManPositionY < 0)	{eatManPositionY=0}
	if (eatManPositionY > 750)	{eatManPositionY=750}

	if (k == 38)	{
		eatManPositionY = eatManPositionY - 10;
	}
	if (k == 40)	{
		eatManPositionY = eatManPositionY + 10;
	}
	if (k == 37)	{
		eatManPositionX = eatManPositionX - 10;
	}
	if (k == 39)	{
		eatManPositionX = eatManPositionX + 10;
	}

	if (time > 0)	{
		findObstacle();
		if (!gameOverFlag)	{
			draw();
		}
		updateScoreboard();
	}
}

//If character approach obstacle one event happens
function findObstacle() {
	let range = 20;
	let xEatManUp = eatManPositionX + range;
	let xEatManDown = eatManPositionX - range;
	
	let yEatManUp = eatManPositionY + range;
	let yEatManDown = eatManPositionY - range;

	for (let index = 0; index < obstacleArray.length; index++) {
		let obstacle = obstacleArray[index];
		if(positionBetween(obstacle.x, xEatManUp, xEatManDown) && positionBetween(obstacle.y, yEatManUp, yEatManDown))	{
			//If bomb is eaten game is over
			if (obstacle.type == "bomb")	{
				bombsound.play();
				explosion2.play();
				gameIsOver();
			}

			//If silver coin eaten worth 100 points
			if (obstacle.type == "silver")	{
				coinSound.play();
				obstacleArray.splice(index,1);
				score = score + 100;
			}

			//If gold coin eaten worth 500 points
			if (obstacle.type == "gold")	{
				coinSound.play();
				obstacleArray.splice(index,1);
				score = score + 500;
			}

		}
	}
}

//Check position
function positionBetween(position, up, down) {
	return position <= up && position >= down;
}

//Obstacle constructor
function Obstacle(x, y, type)	{
	this.x = x;
	this.y = y;
	this.type = type;
}

//Function to clear the screen and show GAME OVER
function gameIsOver()	{
	gameOverFlag = true;
	clearInterval(timeInterval);
	ctx.drawImage(background, 0, 0);
	ctx.drawImage(gameOver, 0, 0, 900, 900);
	document.getElementById("time").innerHTML = "GAME OVER !!!"
	document.getElementById("score").innerHTML = "You got: " + score + " points!";
	gameSound.stop();
}

//Function to handle time
function timeHandler()	{
	timeInterval = setInterval(timerFunc, 1000);
}

//Function to be used in timeinterval
function timerFunc()	{
	//Game over after 30 seconds
	if (time == 0)	{
		document.getElementById("time").innerHTML = "Time: 0 seconds";
		gameIsOver();
	}
	if (time > 0 && time <= 30)	{
		document.getElementById("time").innerHTML = "Time: " + time + " seconds";
		time--;
	}
}

//Update scoreboard
function updateScoreboard() {
	document.getElementById("score").innerHTML = "SCORE = " + score;
}

//Sound constructor with src, play and stop
function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.play = function()	{
        this.sound.play();
    }
    this.stop = function()	{
        this.sound.pause();
    }
}

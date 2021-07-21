var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var score = 0;
var life = 3;
var bullets = 3;

var heart1, heart2, heart3

var gameState = "fight"

var lose, winning, explosionSound;


function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.jpeg")

  lose = loadSound("assets/lose.mp3")
  winning = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(width/2,height/2-40,20,20)
  bg.addImage(bgImg)
  bg.scale = 1.2;
  

  //creating the player sprite
  player = createSprite(width/10,height-100,10,10);
  player.addImage(shooterImg);
  player.scale = 0.5
   //creating sprites to depict lives remaining   
  heart1 = createSprite(width-250,40,20,20)
  heart1.addImage(heart1Img); 
  heart1.scale = 0.3
  heart1.visible = false
  heart2  = createSprite(width-300,40,20,20)
  heart2.addImage(heart2Img); 
  heart2.scale = 0.3
  heart2.visible = false
  heart3 = createSprite(width-250,40,20,20)
  heart3.addImage(heart3Img); 
  heart3.scale = 0.3

    //creating groups for zombies and bullets
  zombieGroup = new Group();
  bulletGroup = new Group();
    
}

function draw() {
  background(255); 


if(gameState === "fight"){
  if(life == 3){
    heart3.visible = true
  }  
  else if(life == 2){
    heart2.visible = true
    heart3.visible = false
  }
  else{ 
   heart1.visible = true
   heart2.visible = false
   heart3.visible = false
  }
  
  //go to gameState "lost" when 0 lives are remaining
  
  if(life == 0){
    gameState = "lost"
  }

  //go to gameState "won" if score is 100
  if(score == 10){
    gameState = "won"
    winning.play()
  }

  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")){
  player.y = player.y - 20
}
if(keyDown("DOWN_ARROW")){
  player.y = player.y + 20

}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  player.addImage(shooter_shooting)
  bullet = createSprite(width/10,player.y,10,10);
  bullet.velocityX = 50;
  bulletGroup.add(bullet)
  lose.play()
  bullets = bullets-1
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg);
  lose.stop()

}

//go to gameState "bullet" when player runs out of bullets
if(bullets == 0){
  gameState = "bullet"
  lose.play()
}

//destroy the zombie when bullet touches it and increase score
  for(var i=0; i<zombieGroup.length; i++){
    if(zombieGroup.get(i).isTouching(bulletGroup)){
      zombieGroup.get(i).destroy()
      bulletGroup.destroyEach()
      winning.play()
      score += 1
    }
}
//reduce life and destroy zombie when player touches it

for(var i=0; i<zombieGroup.length; i++){
  if(zombieGroup.get(i).isTouching(player)){
    zombieGroup.get(i).destroy()
    life = life -1 
    explosionSound.play()
  }
}

//calling the function to spawn zombies
enemy();

}




drawSprites();

//displaying the score and remaining lives and bullets
textSize(20)
  fill("white")
text("bullet:" + bullets , width-150, height/2-250)
text("score:" + score , width-150, height/2-220)
text("life:" + life , width-150, height/2-190)



//destroy zombie and player and display a message in gameState "lost"
 
if (gameState === "lost"){
  fill("red")
  textSize(100)
  zombieGroup.destroyEach()
  player.destroy()
  text("You LOST", windowWidth/2, height/2)
}
 
//destroy zombie and player and display a message in gameState "won"

else if (gameState === "won"){
  fill("yellow")
  textSize(100)
  zombieGroup.destroyEach()
  player.destroy()
  text("You WON", windowWidth/2, height/2)
}

//destroy zombie, player and bullets and display a message in gameState "bullet"

else if (gameState === "bullet"){
  fill("blue")
  textSize(100)
  zombieGroup.destroyEach()
  player.destroy()
  text("You have run out of bullets", windowWidth/10, height/2)
}


}


//creating function to spawn zombies
function enemy(){
  if(frameCount%100===0){
    zombie = createSprite(random(width/2,width),random(height/3,height-100),10,10);
    zombie.addImage(zombieImg);
    zombie.scale = 0.2
    zombie.velocityX = -3;
    zombie.lifetime = 400; 
    zombieGroup.add(zombie); 
  }

}

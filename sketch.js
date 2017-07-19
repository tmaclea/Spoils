/* 
TO DO:

reload cooldown bar near player

Later on:
    need to be able to build base
    within the base, ability to upgrade:
        shooting speed
        walking speed
        heath upgrades / healing
        bullet damage
        max base health
    within the base, ability to make:
        armor?
        bullets?


Zombies:
    Death animation
    lunge?

    types:
        A random (but zipfy) variation of zombie types
        different colors, health, speed, attack speed
        zombies get more difficult as more are killed

Low priority:
    Improve the bullets offscreen function 
*/

var player;
var zombies = [];
var bullets = [];
var parts = [];
var playerDead = false;
var NUM_ZOMBIES = 200;

function setup() {
    createCanvas(600,600);

    //spawn player
    player = new Player();
    //spawn zombies
    spawnZombies(NUM_ZOMBIES);
}

function draw() {
    background(200);

    //player display
    // use translate function to always show player in center
    translate(width/2-player.pos.x, height/2-player.pos.y);

    //create grid lines
    drawGrid(-width*2, -height*2, width*2, height*2);

    player.show();

    //do stuff with zombies
    for (var i = zombies.length - 1; i >= 0; i--) {
        zombies[i].show();
        zombies[i].move(player.pos.x, player.pos.y);

        if(zombies[i].isInRange(player)) {
            zombies[i].attack(player);
        }

        if(zombies[i].dead()){
            player.killCount++;
            parts = parts.concat(zombies[i].die());
            zombies.splice(i, 1);
        }
    }
    //make sure there are always 200 zombies
    //no need for recursive spawnZombies function
    if(zombies.length < NUM_ZOMBIES)
        spawnZombies(1);

    //do stuff with parts
    for(var i = 0; i < parts.length; i++) {
        parts[i].show();
        parts[i].update();
        if(player.pickUp(parts[i]) || parts[i].done){
            parts.splice(i, 1);
        }
    }

    //do stuff with bullets
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].render();
        bullets[i].fire();
        for (var j = 0; j < zombies.length; j++) {
            if(bullets[i].hits(zombies[j])){
                zombies[j].getShot(bullets[i]);
                bullets.splice(i,1);
                break;
            }
            if(bullets[i].offscreen()) {
                bullets.splice(i, 1);
                break;
            }
        }
    }

    //show health
    player.showHealth();
    //game over when health is 0
    if(player.health <= 0) {
        gameOver();
    }

    // movement of player
    //weird stuff happens if this isn't last in draw
    if(keyIsDown(87)) {player.move('up');} // w key
    if(keyIsDown(65)) {player.move('left');} // a key
    if(keyIsDown(83)) {player.move('down');} // s key
    if(keyIsDown(68)) {player.move('right');} // d key
}

function mousePressed() {
    if(player.canShoot){
        bullets.push(player.shoot(player.pos, mouseX, mouseY));
        //must start timer outside of the player.shoot function
        setTimeout(() => player.canShoot = true, player.firingSpeed);
    }

    if(playerDead) {
        restart();
    }
}

function spawnZombies(num) {
    var areaView = 316;  //300 pixels around the player in each direction + 16 radius of zombie  
    for (i = 0; i < num; i++) {
        var randW = random(-width * 2, width * 2);
        var randH = random(-height * 2, height * 2);
        //make sure zombie doesn't spawn in the view of the player
        if(randW > player.pos.x - areaView && randW < player.pos.x + areaView &&
            randH > player.pos.y - areaView && randH < player.pos.y + areaView) {
                zombies.splice(i, 1);
                //this recursion causes an infinite loop
                // spawnZombies(1);
        } else {
            zombies.push(new Zombie(randW, randH, player.killCount));
        }
    }
}

function drawGrid(topLeftX, topLeftY, botRightX, botRightY) {
    var LINE_DIST = 200;
    push();
        stroke(126);
        for(var x = topLeftX; x <= botRightX; x += LINE_DIST) {
            line(x, topLeftY, x, botRightY);
        }
        for(var y = topLeftY; y <= botRightY; y += LINE_DIST) {
            line(topLeftX, y, botRightX, y);
        }
    pop();
}

function gameOver() {
    playerDead = true;

    push();
        fill(0);
        textSize(48);
        text("Game Over", player.pos.x-100, player.pos.y-100);
        textSize(20);
        text("Click to restart", player.pos.x-40, player.pos.y-75);
    pop();
    noLoop();
}

function restart() {
    playerDead = false;
    player.startOver();
    
    //kill and respawn all zombies
    for(var i = zombies.length; i >= 0; i--) {
        zombies.splice(i,1);
    }
    spawnZombies(NUM_ZOMBIES);

    //remove all bullets
    for(var j = bullets.length; j >= 0; j--) {
        bullets.splice(j, 1);
    }

    //remove all parts
    for(var k = parts.length - 1; k >=0; k--) {
        parts.splice(k, 1);
    }

    loop();
}
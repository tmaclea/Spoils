/* 
TO DO:

workshop needs to have some indication of the progress of each item bought
e.g. Walking Speed level 1, level 2, max health: 200

make zombies not able to overlap one another

different kinds of parts that are worth more

press shift once to open store, press again to close

ongoing:
    improve item costs
    improve store aesthetics
    adjust amount of parts that zombies drop
    adjust chances of different zombies spawning

bugs:

other possibilities:
    make shooting not perfectly accurate, and
    add accuracy improvement as an upgrade

    add gun types that shoot differently
        shotgun, machine gun, etc...

    ability to make:
        bullets?
        clips?
        build a base?

    Other means of game progression besides upgrades
        Levels:
            zombie bosses
                could have a chance of spawning after a certain number of kills
                and play a role in the chances of different zombie types spawning
            Waves?
    zombie lunge?

    have friction of parts reduce depending on the amound of damage done to a zombie
        e.g. if zombie has 100 health and player does 1000 damage, friction is less
        than if player did 100 damage

    zombies drop powerups

Low priority:
    Improve the bullets offscreen function 
    player death animation
    zombie death animation
*/

var player, workshop, ztracker;
var zombies = [];
var bullets = [];
var parts = [];
var playerDead = false;
var NUM_ZOMBIES = 100;
var workshopOpen = false;
var paused = false;

function setup() {
    createCanvas(600,600);

    //spawn player
    player = new Player();
    //create workshop
    workshop = new Workshop();
    //spawn zombies
    spawnZombies(NUM_ZOMBIES);
    //zombie tracker
    ztracker = new Ztracker();
}

function draw() {
    background(200);

    //player display
    // use translate function to always show player in center
    translate(width/2-player.pos.x, height/2-player.pos.y);

    //create grid lines
    drawGrid(-width*2, -height*2, width*2, height*2);

    //do stuff with parts
    for(var i = 0; i < parts.length; i++) {
        parts[i].show();
        parts[i].update();
        if(player.pickUp(parts[i]) || parts[i].done){
            parts.splice(i, 1);
        }
    }

    //do stuff with zombies
    for (var i = zombies.length - 1; i >= 0; i--) {
        zombies[i].show();
        zombies[i].showHealth();
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
    if(zombies.length < NUM_ZOMBIES) { spawnZombies(1); }



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

    //show player
    player.show();

    //show health
    player.showHealth();
    if(!player.canShoot) { 
        player.reload(); 
    }
    //show paused text if game is paused
    if(paused) {
        fill(0);
        textSize(48);
        text("Paused", player.pos.x-80, player.pos.y-100);
    }
    //game over when health is 0
    if(player.health <= 0) {
        gameOver();
    }

    // movement of player
    //weird stuff happens if this isn't last in draw
    if(keyIsDown(87) || keyIsDown(UP_ARROW)) {player.move('up');}
    if(keyIsDown(65) || keyIsDown(LEFT_ARROW)) {player.move('left');} 
    if(keyIsDown(83) || keyIsDown(DOWN_ARROW)) {player.move('down');} 
    if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {player.move('right');} 
    if(keyIsDown(SHIFT)) {workshop.open(player); workshopOpen = true;}
}

function mousePressed() {
    if(workshopOpen || paused) {
        return;
    }

    if(player.canShoot){
        bullets.push(player.shoot(player.pos, mouseX, mouseY));
        //must start timer outside of the player.shoot function
        setTimeout(() => player.canShoot = true, player.firingSpeed);
    }
}

function keyReleased() {
    if(keyCode === SHIFT) {
        workshop.close();
        workshopOpen = false;
    }

    return false; //prevent any default browser behavior
}

function keyPressed() {

    //pause
    if(keyCode == ESCAPE && !workshopOpen) {
        pause();
    }

    if(workshopOpen) {workshop.moveSelection(keyCode, player);}

    //buy item
    if(workshopOpen && keyCode == 13) {workshop.buy(player);}

    if(keyCode == 32 && playerDead) restart();

    return false; //prevent default browser behavior
}

function spawnZombies(num) {
    var areaView = (height / 2) + player.r; //works as long as height = width
    for (i = 0; i < num; i++) {
        var randW = random(-width * 2, width * 2);
        var randH = random(-height * 2, height * 2);
        //make sure zombie doesn't spawn in the view of the player
        if(randW > player.pos.x - areaView && randW < player.pos.x + areaView &&
            randH > player.pos.y - areaView && randH < player.pos.y + areaView) {
                //do nothing
        } else {
            zombies.push(new Zombie(randW, randH, player.killCount, ztracker));
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
        text("Press space to restart", player.pos.x-75, player.pos.y-75);
    pop();
    noLoop();
}

function pause() {
    if(!paused) {
        noLoop();
        paused = true;
    } else {
        loop();
        paused = false;
    }
}

function restart() {
    playerDead = false;
    player.startOver();
    workshop.reset();
    
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
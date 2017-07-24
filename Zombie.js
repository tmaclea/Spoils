function Zombie(posX, posY, kills, ztracker) {
    this.pos = createVector(posX, posY);
    this.r = 16;
    this.vel = .1;
    this.maxVel = .05;
    this.health = 200;
    this.maxHealth = 200;
    this.strength = 50;
    this.attackSpeed = 2000;
    this.canAttack = true;
    this.color = color(127, 127, 0);
    this.parts = random(1,5); //amount of parts held by zombie
    this.xoff = random(-10000,10000); //x offset for perlin noise
    this.yoff = random(-10000,10000); //y offset for perlin noise
    this.wobble = random(1000); //magnitude of the wobble
    this.playerKills = kills;
    
    this.getRandomType(ztracker);
}

Zombie.prototype.show = function() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
}

Zombie.prototype.move = function(playerX, playerY) {
    //contrain zombie to edge of play area
    this.pos.y = constrain(this.pos.y, -height*2+this.r, height*2-this.r);
    this.pos.x = constrain(this.pos.x, -width*2+this.r, width*2-this.r);

    if(this.vel < this.maxVel) {
        this.vel += .8;
    } else {
        this.vel = this.maxVel;
    }
    var player = createVector(playerX+map(noise(this.xoff), 0, 1, -this.wobble, this.wobble), playerY+map(noise(this.yoff), 0, 1, -this.wobble, this.wobble)); //perlin noise for wobble
    this.xoff += 0.01;
    this.yoff += 0.01;
    player.sub(this.pos);
    player.setMag(this.vel);
    this.pos.add(player);
}


Zombie.prototype.getShot = function(player) {
    var angle = createVector(player.pos.x, player.pos.y);
    angle.sub(this.pos);
    angle.setMag(-10);
    this.pos.add(angle);
    this.vel -= 3;
    this.health -= player.damage;
}

Zombie.prototype.isInRange = function(something) {
    //check distance to the thing
    var d = dist(this.pos.x, this.pos.y, something.pos.x, something.pos.y);
    return d < something.r+this.r;
}

Zombie.prototype.attack = function(player) {
    if(this.canAttack){
        player.health -= this.strength;
        this.canAttack = false;
        setTimeout(() => this.canAttack = true, this.attackSpeed);
    }
}

Zombie.prototype.getRandomType = function(ztracker) {
    var chance = random();
    switch(true) {
        case (chance < (this.playerKills / 12000) && ztracker.type5 > 5):
            console.log("Type 6 spawned");
            this.color = color(0, 0, 200);
            this.health = 10000;
            this.maxHealth = 10000;
            this.vel = 2.5;
            this.maxVel = 2.5
            this.strength = 100;
            this.attackSpeed = 250;
            this.parts = random(35,60);
            break;
        case (chance < (this.playerKills / 10000) && ztracker.type4 > 5):
            console.log("Type 5 spawned");
            ztracker.type5++;
            this.color = color(130, 200, 200);
            this.health = 7500;
            this.maxHealth = 7500;
            this.vel = 1.5;
            this.maxVel = 1.5;
            this.strength = 75;
            this.attackSpeed = 500;
            this.parts = random(23,34);
            break;
        case (chance < (this.playerKills / 7500) && ztracker.type3 > 5):
            console.log("Type 4 spawned");
            ztracker.type4++;
            this.color = color(255, 130, 200);
            this.health = 5000;
            this.maxHealth = 5000;
            this.vel = 1.25;
            this.maxVel = 1.25;
            this.strength = 75;
            this.attackSpeed = 750;
            this.parts = random(15,23);
            break;
        case (chance < (this.playerKills / 6000) && ztracker.type2 > 5):
            console.log("Type 3 spawned");
            ztracker.type3++;
            this.color = color(130, 0, 130);
            this.health = 3000;
            this.maxHealth = 3000;
            this.vel = 1;
            this.maxVel = 1;
            this.strength = 75;
            this.attackSpeed = 1000;
            this.parts = random(12,17);
            break;
        case (chance < (this.playerKills / 3000) && ztracker.type1 > 5):
            console.log("Type 2 spawned");
            ztracker.type2++;
            this.color = color(200, 200, 0);
            this.health = 1000;
            this.maxHealth = 1000;
            this.vel = .5;
            this.maxVel = .5;
            this.strength = 50;
            this.attackSpeed = 1500;
            this.parts = random(7,13);
            break;
        case chance < (this.playerKills / 500):
            console.log("Type 1 spawned");
            ztracker.type1++;
            this.color = color(160, 160, 0);
            this.health = 500;
            this.maxHealth = 500;
            this.vel = .3;
            this.maxVel = .3;
            this.strength = 50;
            this.attackSpeed = 1900;
            this.parts = random(5,10);
            break;
        default:
            //keep default values
            return;
    }   
}

Zombie.prototype.dead = function() {
    return this.health <= 0;
}

Zombie.prototype.showHealth = function() {
    var posX = this.pos.x - 15;
    var posY = this.pos.y - 25;
    var healthBarLen = 30;

    //establish minimum health
    if(this.health < 0) {this.health = 0;}

    push();
    if(this.health < this.maxHealth) {
        noFill();
        rect(posX, posY, healthBarLen, 5, 10);
        fill(255,80,80);
        rect(posX, posY, floor(healthBarLen*(this.health/this.maxHealth)), 5, 10);
    }
    pop();
}

Zombie.prototype.die = function() {
    var parts = [];
    var blueChance = .33;
    for(var i = 0; i < this.parts; i++) {
        if(this.parts - i > 5 && random() < blueChance) {
            i += 5;
            part = new Part(this.pos.x, this.pos.y);
            part.setValue(5, color(0,0,255));
            parts.push(part);
        } else {
            parts.push(new Part(this.pos.x, this.pos.y));
        }
    }
    return parts;
}

Zombie.prototype.noOverlap = function(otherZombie) {
    var zomb = createVector(otherZombie.pos.x, otherZombie.pos.y);
    zomb.sub(this.pos);
    zomb.setMag(this.vel);
    this.pos.sub(zomb);
}
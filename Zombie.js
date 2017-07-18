function Zombie(posX, posY, kills) {
    this.pos = createVector(posX, posY);
    this.r = 16;
    this.vel = .1;
    this.health = 100;
    this.strength = 50;
    this.attackSpeed = 2000;
    this.canAttack = true;
    this.typeChance = kills / 5000;
    this.color = color(127, 127, 0);

    if(random() < this.typeChance) {
        console.log("special zombie spawned");
        this.color = color(0, 0, 200);
        this.health = 500;
        this.vel = 1;
        if(random() < .2) {
            this.vel = 10;
            this.r = 25;
            this.health = 1000;
            this.color = (127, 0, 0);
        }
    }
}

Zombie.prototype.show = function() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
}

Zombie.prototype.move = function(playerX, playerY) {
    var player = createVector(playerX+random(-1000,1000), playerY+random(-1000,1000)); //random numbers for wobble
    player.sub(this.pos);
    player.setMag(this.vel);
    this.pos.add(player);
}

Zombie.prototype.dead = function() {
    return this.health <= 0;
}

Zombie.prototype.getShot = function(bullet) {
    this.health -= bullet.damage;
}

Zombie.prototype.isInRange = function(player) {
    //check distance to player
    var d = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);
    return d < player.r+this.r;
}

Zombie.prototype.attack = function(player) {
    if(this.canAttack){
        player.health -= this.strength;
        this.canAttack = false;
        setTimeout(() => this.canAttack = true, this.attackSpeed);

    }
}
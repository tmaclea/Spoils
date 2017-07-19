function Zombie(posX, posY, kills) {
    this.pos = createVector(posX, posY);
    this.r = 16;
    this.vel = .05;
    this.health = 100;
    this.strength = 50;
    this.attackSpeed = 2000;
    this.canAttack = true;
    this.typeChance = kills / 5000;
    this.color = color(127, 127, 0);
    this.parts = random(1,5); //amount of parts held by zombie
    this.xoff = 0; //x offset for perlin noise
    this.wobble = random(1000); //magnitude of the wobble

    //randomly change zombie type
    if(random() < this.typeChance) {
        console.log("special zombie spawned");
        this.color = color(0, 0, 200);
        this.health = 500;
        this.vel = 1;
        this.strength = 75;
        this.parts = random(5,10);
    }
}

Zombie.prototype.show = function() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
}

Zombie.prototype.move = function(playerX, playerY) {
    var player = createVector(playerX+map(noise(this.xoff), 0, 1, -this.wobble, this.wobble), playerY+map(noise(this.xoff), 0, 1, -this.wobble, this.wobble)); //perlin noise for wobble
    this.xoff += random(-0.3, 0.3); //speed of the wobble
    this.wobble = random(1000);
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

Zombie.prototype.die = function() {
    var parts = [];
    for(var i = 0; i < this.parts; i++) {
        parts.push(new Part(this.pos.x, this.pos.y));
    }
    return parts;
}
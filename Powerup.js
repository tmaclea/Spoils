function Powerup(startX, startY) {
    this.pos = createVector(startX, startY);
    this.r = 10;
    this.vel = createVector(random(-7, 7), random(-7,7));
    this.friction = .8;
    this.timeAlive = 20000 + random(-1000,1000);
    this.boostTime = 5000;
    this.done = false;
    this.color = color(0);
    this.type = "error";

    this.getRandom();

    setTimeout(() => this.done = true, this.timeAlive);

}

Powerup.prototype.show = function() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
}

Powerup.prototype.update = function() {
    this.pos.add(this.vel);
    this.vel.mult(this.friction);
}

Powerup.prototype.getRandom = function() {
    var randBoost = floor(random(0,5));
    switch(randBoost) {
        case 0:
            this.type = "agility";
            this.color = color(255,255,0);
            break;
        case 1:
            this.type = "shooting";
            this.color = color(245,245,220);
            break;
        case 2:
            this.type = "invincible";
            this.color = color(0,0,200);
            break;
        case 3:
            this.type = "damage";
            this.color = color(255,0,0);
            break;
        case 4:
            this.type = "health";
            this.color = color(255);
            break;
    }
}

Powerup.prototype.boost = function(player) {
    var orig;
    switch(this.type) {
        case "agility":
            orig = player.vel;
            player.vel = 5;
            setTimeout(() => player.vel = orig, this.boostTime);
            break;
        case "shooting":
            orig = player.firingSpeed;
            player.firingSpeed = 1;
            setTimeout(() => player.firingSpeed = orig, this.boostTime);
            break;
        case "invincible":
            orig = player.health;
            player.health = 9999999;
            setTimeout(() => player.health = orig, this.boostTime);
            break;
        case "damage":
            orig = player.damage;
            player.damage = 10000;
            setTimeout(() => player.damage = orig, this.boostTime);
            break;
        case "health":
            player.health += ceil(player.maxHealth * .25);
            if(player.health > player.maxHealth) { player.health = player.maxHealth; }
            break;
    }
}

